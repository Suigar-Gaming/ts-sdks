// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getPresetDurationMs, normalizePlayback } from '@suigar/suifrens-display-system/animation';
import type { AnimationConfig, PlaybackOptions } from '@suigar/suifrens-display-system/types';

export type LocomotionState = 'idle' | 'walk' | 'run' | 'jump' | 'crouch' | 'crouchWalk';
export type FacingDirection = 'left' | 'right';

type ControlState = {
	x: number;
	y: number;
	run: boolean;
	crouch: boolean;
	jumpRequested: boolean;
};

export type SuiFrenActorPose = {
	position: { x: number; y: number };
	elevation: number;
	facing: FacingDirection;
};

export type SuiFrenActorOptions<TExpression extends string = string> = {
	initialPosition?: { x: number; y: number };
	bounds?: { width: number; height: number; padding?: number };
	moveSpeed?: number;
	runMultiplier?: number;
	crouchMultiplier?: number;
	/** Units per second squared applied while moving. */
	acceleration?: number;
	/** Units per second squared applied while stopping. */
	deceleration?: number;
	jumpStrength?: number;
	gravity?: number;
	/**
	 * How often (ms) to sync React state. Higher = fewer rerenders; visual pose still updates via
	 * poseRef/onPose.
	 */
	reactSyncIntervalMs?: number;
	/** Expression used when no emote is active. */
	defaultExpression: TExpression;
	/** Optional callback fired every frame with pose. */
	onPose?: (pose: SuiFrenActorPose) => void;
};

type PresetAnimation = Extract<AnimationConfig, { preset: string }>;

export type SuiFrenActorSnapshot<TExpression extends string = string> = {
	position: { x: number; y: number };
	elevation: number;
	facing: FacingDirection;
	locomotion: LocomotionState;
	animation: PresetAnimation & { trigger: number };
	expression: TExpression;
	baseExpression: TExpression;
};

export type SuiFrenActorControls<TExpression extends string = string> = {
	setDirection: (x: number, y: number) => void;
	setRun: (run: boolean) => void;
	setCrouch: (crouch: boolean) => void;
	requestJump: () => void;
	triggerEmote: (expression: TExpression, durationMs?: number) => void;
	setBaseExpression: (expression: TExpression) => void;
	reset: (position?: { x: number; y: number }) => void;
};

type DerivedConfig<TExpression extends string> = {
	bounds: SuiFrenActorOptions<TExpression>['bounds'];
	moveSpeed: number;
	runMultiplier: number;
	crouchMultiplier: number;
	acceleration: number;
	deceleration: number;
	jumpStrength: number;
	gravity: number;
	padding: number;
	startPosition: { x: number; y: number };
	defaultExpression: TExpression;
	reactSyncIntervalMs: number;
};

type EmoteState<TExpression extends string> = { expression: TExpression; until: number } | null;

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

function playbackEquals(a?: PlaybackOptions, b?: PlaybackOptions) {
	if (a === b) {
		return true;
	}
	if (!a || !b) {
		return false;
	}
	return a.iterations === b.iterations && a.alternate === b.alternate && a.speed === b.speed;
}

function deriveAnimation(locomotion: LocomotionState, speedMultiplier: number): PresetAnimation {
	switch (locomotion) {
		case 'walk':
			return { preset: 'walk', playback: { iterations: 'infinite' } };
		case 'run':
			return {
				preset: 'run',
				playback: { iterations: 'infinite', speed: Math.max(1, speedMultiplier) },
			};
		case 'jump':
			return { preset: 'jump', playback: { iterations: 1 } };
		case 'crouchWalk':
			return {
				preset: 'crouchWalk',
				playback: {
					iterations: 'infinite',
					speed: Math.max(0.5, Math.min(1, speedMultiplier)),
				},
			};
		case 'crouch':
			return {
				preset: 'crouch',
				playback: { iterations: 'infinite' },
				holdOnComplete: true,
			};
		case 'idle':
		default:
			return { preset: 'idle', playback: { iterations: 'infinite' } };
	}
}

export function useSuiFrenActor<TExpression extends string = string>(
	options: SuiFrenActorOptions<TExpression>,
) {
	const bounds = options.bounds;
	const startPosition = useMemo(() => {
		if (options.initialPosition) {
			return options.initialPosition;
		}
		if (bounds) {
			const padding = bounds.padding ?? 0;
			return { x: bounds.width / 2, y: bounds.height - padding * 2 };
		}
		return { x: 0, y: 0 };
	}, [options.initialPosition, bounds]);

	const config = useMemo<DerivedConfig<TExpression>>(
		() => ({
			bounds,
			moveSpeed: options.moveSpeed ?? 280,
			runMultiplier: options.runMultiplier ?? 1.6,
			crouchMultiplier: options.crouchMultiplier ?? 0.6,
			acceleration: options.acceleration ?? 2200,
			deceleration: options.deceleration ?? 1800,
			jumpStrength: options.jumpStrength ?? 780,
			gravity: options.gravity ?? 2400,
			padding: options.bounds?.padding ?? 32,
			startPosition,
			defaultExpression: options.defaultExpression,
			reactSyncIntervalMs: options.reactSyncIntervalMs ?? 80,
		}),
		[
			bounds,
			options.bounds?.padding,
			options.acceleration,
			options.deceleration,
			options.crouchMultiplier,
			options.defaultExpression,
			options.gravity,
			options.jumpStrength,
			options.moveSpeed,
			options.runMultiplier,
			options.reactSyncIntervalMs,
			startPosition,
		],
	);

	const controlsRef = useRef<ControlState>({
		x: 0,
		y: 0,
		run: false,
		crouch: false,
		jumpRequested: false,
	});

	const baseExpressionRef = useRef<TExpression>(config.defaultExpression);
	const emoteRef = useRef<EmoteState<TExpression>>(null);
	const verticalVelocityRef = useRef(0);
	const jumpingRef = useRef(false);
	const planarVelocityRef = useRef({ x: 0, y: 0 });
	const poseRef = useRef<SuiFrenActorPose>({
		position: config.startPosition,
		elevation: 0,
		facing: 'right',
	});
	const lockedUntilRef = useRef(0);
	const lockedLocomotionRef = useRef<LocomotionState | null>(null);
	const pendingLocomotionRef = useRef<LocomotionState | null>(null);
	const onPoseRef = useRef(options.onPose);

	useEffect(() => {
		onPoseRef.current = options.onPose;
	}, [options.onPose]);

	const initialState: SuiFrenActorSnapshot<TExpression> = useMemo(() => {
		const baseAnimation = deriveAnimation('idle', config.runMultiplier);
		return {
			position: config.startPosition,
			elevation: 0,
			facing: 'right',
			locomotion: 'idle',
			animation: { ...baseAnimation, trigger: 0 },
			expression: config.defaultExpression,
			baseExpression: config.defaultExpression,
		};
	}, [config.defaultExpression, config.runMultiplier, config.startPosition]);

	const stateRef = useRef<SuiFrenActorSnapshot<TExpression>>(initialState);
	const syncedStateRef = useRef<SuiFrenActorSnapshot<TExpression>>(initialState);
	const [reactState, setReactState] = useState<SuiFrenActorSnapshot<TExpression>>(initialState);

	useEffect(() => {
		baseExpressionRef.current = options.defaultExpression;
		if (!emoteRef.current) {
			const next = {
				...stateRef.current,
				expression: options.defaultExpression,
				baseExpression: options.defaultExpression,
			};
			stateRef.current = next;
			syncedStateRef.current = next;
			setReactState(next);
		}
	}, [options.defaultExpression]);

	useEffect(() => {
		let raf = 0;
		let last = performance.now();
		let lastReactSync = last;

		const tick = (time: number) => {
			const deltaSeconds = (time - last) / 1000;
			last = time;

			if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
				raf = requestAnimationFrame(tick);
				return;
			}

			const current = stateRef.current;
			const previousLocomotion = current.locomotion;
			const controls = controlsRef.current;

			const directionMagnitude = Math.hypot(controls.x, controls.y);
			const normalizedX = directionMagnitude > 1 ? controls.x / directionMagnitude : controls.x;
			const normalizedY = directionMagnitude > 1 ? controls.y / directionMagnitude : controls.y;

			const runEnabled = controls.run && !controls.crouch;
			const movementMultiplier = controls.crouch
				? config.crouchMultiplier
				: runEnabled
					? config.runMultiplier
					: 1;
			const maxSpeed = config.moveSpeed * movementMultiplier;
			const desiredVelocity = { x: normalizedX * maxSpeed, y: normalizedY * maxSpeed };

			const accelerationStep = config.acceleration * deltaSeconds;
			const decelerationStep = config.deceleration * deltaSeconds;
			const nextPlanarVelocity = { ...planarVelocityRef.current };

			for (const axis of ['x', 'y'] as const) {
				const target = desiredVelocity[axis];
				const currentVelocity = planarVelocityRef.current[axis];
				if (Math.abs(target) > 0.0001) {
					const delta = target - currentVelocity;
					const applied = Math.sign(delta) * Math.min(Math.abs(delta), accelerationStep);
					nextPlanarVelocity[axis] = currentVelocity + applied;
				} else {
					const decay = Math.min(Math.abs(currentVelocity), decelerationStep);
					nextPlanarVelocity[axis] = currentVelocity - Math.sign(currentVelocity) * decay;
				}
				if (Math.abs(nextPlanarVelocity[axis]) < 2) {
					nextPlanarVelocity[axis] = 0;
				}
			}

			let nextX = current.position.x + nextPlanarVelocity.x * deltaSeconds;
			let nextY = current.position.y + nextPlanarVelocity.y * deltaSeconds;

			if (config.bounds) {
				const minX = config.padding;
				const maxX = config.bounds.width - config.padding;
				const minY = config.padding;
				const maxY = config.bounds.height - config.padding;
				nextX = clamp(nextX, minX, maxX);
				nextY = clamp(nextY, minY, maxY);
				if (nextX === minX || nextX === maxX) {
					nextPlanarVelocity.x = 0;
				}
				if (nextY === minY || nextY === maxY) {
					nextPlanarVelocity.y = 0;
				}
			}

			const facing: FacingDirection =
				normalizedX < -0.1 ? 'left' : normalizedX > 0.1 ? 'right' : current.facing;

			let consumedJump = false;
			if (controls.jumpRequested && !jumpingRef.current && !controls.crouch) {
				jumpingRef.current = true;
				verticalVelocityRef.current = config.jumpStrength;
				consumedJump = true;
			}

			let elevation = current.elevation;
			if (jumpingRef.current || elevation > 0) {
				verticalVelocityRef.current -= config.gravity * deltaSeconds;
				elevation = Math.max(0, elevation + verticalVelocityRef.current * deltaSeconds);
				if (elevation <= 0 && verticalVelocityRef.current <= 0) {
					elevation = 0;
					verticalVelocityRef.current = 0;
					jumpingRef.current = false;
				}
			}

			const moving = directionMagnitude > 0.05;
			const planarSpeed = Math.hypot(nextPlanarVelocity.x, nextPlanarVelocity.y);
			let requestedLocomotion: LocomotionState = current.locomotion;
			if (jumpingRef.current || elevation > 0) {
				requestedLocomotion = 'jump';
			} else if (controls.crouch) {
				requestedLocomotion = moving ? 'crouchWalk' : 'crouch';
			} else if (moving && runEnabled && planarSpeed > 1) {
				requestedLocomotion = 'run';
			} else if (moving || planarSpeed > 8) {
				requestedLocomotion = 'walk';
			} else {
				requestedLocomotion = 'idle';
			}

			const now = time;
			let locomotion = requestedLocomotion;

			if (lockedLocomotionRef.current) {
				if (lockedLocomotionRef.current === 'idle') {
					lockedLocomotionRef.current = null;
					lockedUntilRef.current = 0;
					pendingLocomotionRef.current = null;
				} else if (now < lockedUntilRef.current) {
					if (requestedLocomotion !== lockedLocomotionRef.current) {
						pendingLocomotionRef.current = requestedLocomotion;
					}
					locomotion = lockedLocomotionRef.current;
				} else {
					lockedLocomotionRef.current = null;
					lockedUntilRef.current = 0;
					if (pendingLocomotionRef.current) {
						locomotion = pendingLocomotionRef.current;
						pendingLocomotionRef.current = null;
					}
				}
			}

			let trigger = current.animation.trigger;
			if (locomotion === 'jump' || (locomotion === 'idle' && previousLocomotion === 'jump')) {
				trigger += 1;
			}

			const animation = deriveAnimation(locomotion, movementMultiplier);

			const { iterations, speed } = normalizePlayback(animation.playback);
			const presetDuration = getPresetDurationMs(animation.preset);
			const loopDuration = presetDuration ? presetDuration / speed : null;

			if (loopDuration && locomotion !== 'idle' && locomotion !== 'crouch') {
				if (lockedLocomotionRef.current === locomotion) {
					if (!Number.isFinite(iterations) && now >= lockedUntilRef.current) {
						lockedUntilRef.current = now + loopDuration;
					}
				} else {
					const lockLength = Number.isFinite(iterations) ? loopDuration * iterations : loopDuration;
					lockedLocomotionRef.current = locomotion;
					lockedUntilRef.current = now + lockLength;
				}
			} else {
				lockedLocomotionRef.current = null;
				lockedUntilRef.current = 0;
			}

			const emote = emoteRef.current;
			if (emote && emote.until <= time) {
				emoteRef.current = null;
			}
			const expression = emoteRef.current?.expression ?? baseExpressionRef.current;

			if (consumedJump) {
				controlsRef.current.jumpRequested = false;
			}
			planarVelocityRef.current = nextPlanarVelocity;

			poseRef.current = {
				position: { x: nextX, y: nextY },
				elevation,
				facing,
			};
			onPoseRef.current?.(poseRef.current);

			const lastSynced = syncedStateRef.current;
			const previous = lastSynced.animation;
			const animationChanged =
				previous.preset !== animation.preset ||
				previous.holdOnComplete !== animation.holdOnComplete ||
				previous.trigger !== trigger ||
				!playbackEquals(previous.playback, animation.playback);

			const nextState: SuiFrenActorSnapshot<TExpression> = {
				position: { x: nextX, y: nextY },
				elevation,
				facing,
				locomotion,
				animation: animationChanged ? { ...animation, trigger } : previous,
				expression,
				baseExpression: baseExpressionRef.current,
			};

			stateRef.current = nextState;

			const locomotionChanged = lastSynced.locomotion !== nextState.locomotion;
			const expressionChanged = lastSynced.expression !== nextState.expression;
			const baseExpressionChanged = lastSynced.baseExpression !== nextState.baseExpression;
			const shouldSyncByTime = time - lastReactSync >= config.reactSyncIntervalMs;

			if (
				shouldSyncByTime ||
				animationChanged ||
				locomotionChanged ||
				expressionChanged ||
				baseExpressionChanged
			) {
				lastReactSync = time;
				syncedStateRef.current = nextState;
				setReactState(nextState);
			}

			raf = requestAnimationFrame(tick);
		};

		raf = requestAnimationFrame((time) => {
			last = time;
			tick(time);
		});

		return () => cancelAnimationFrame(raf);
	}, [config]);

	const setDirection = useCallback((x: number, y: number) => {
		controlsRef.current.x = clamp(x, -1, 1);
		controlsRef.current.y = clamp(y, -1, 1);
	}, []);

	const setRun = useCallback((run: boolean) => {
		controlsRef.current.run = run;
		if (run) {
			controlsRef.current.crouch = false;
		}
	}, []);

	const setCrouch = useCallback((crouch: boolean) => {
		controlsRef.current.crouch = crouch;
		if (crouch) {
			controlsRef.current.run = false;
			controlsRef.current.jumpRequested = false;
			jumpingRef.current = false;
			verticalVelocityRef.current = 0;
		}
	}, []);

	const requestJump = useCallback(() => {
		controlsRef.current.jumpRequested = true;
	}, []);

	const triggerEmote = useCallback((expression: TExpression, durationMs = 1500) => {
		const until = performance.now() + durationMs;
		emoteRef.current = { expression, until };
		const next = { ...stateRef.current, expression };
		stateRef.current = next;
		syncedStateRef.current = next;
		setReactState(next);
	}, []);

	const setBaseExpression = useCallback((expression: TExpression) => {
		baseExpressionRef.current = expression;
		if (!emoteRef.current) {
			const next = { ...stateRef.current, expression, baseExpression: expression };
			stateRef.current = next;
			syncedStateRef.current = next;
			setReactState(next);
		}
	}, []);

	const reset = useCallback(
		(position?: { x: number; y: number }) => {
			controlsRef.current = { x: 0, y: 0, run: false, crouch: false, jumpRequested: false };
			emoteRef.current = null;
			jumpingRef.current = false;
			verticalVelocityRef.current = 0;
			planarVelocityRef.current = { x: 0, y: 0 };
			lockedUntilRef.current = 0;
			lockedLocomotionRef.current = null;
			pendingLocomotionRef.current = null;

			const nextPosition = position ?? config.startPosition;
			const animation = deriveAnimation('idle', config.runMultiplier);
			const expression = baseExpressionRef.current;
			const nextState: SuiFrenActorSnapshot<TExpression> = {
				position: nextPosition,
				elevation: 0,
				facing: 'right',
				locomotion: 'idle',
				animation: { ...animation, trigger: stateRef.current.animation.trigger + 1 },
				expression,
				baseExpression: expression,
			};

			poseRef.current = { position: nextPosition, elevation: 0, facing: 'right' };
			stateRef.current = nextState;
			syncedStateRef.current = nextState;
			setReactState(nextState);
		},
		[config.runMultiplier, config.startPosition],
	);

	const controls = useMemo<SuiFrenActorControls<TExpression>>(
		() => ({
			setDirection,
			setRun,
			setCrouch,
			requestJump,
			triggerEmote,
			setBaseExpression,
			reset,
		}),
		[requestJump, reset, setBaseExpression, setCrouch, setDirection, setRun, triggerEmote],
	);

	return { state: reactState, controls, poseRef };
}
