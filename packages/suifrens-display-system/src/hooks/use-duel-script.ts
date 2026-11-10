// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getPresetDurationMs } from '../animation/presets.js';
import type { AnimationConfig, PlaybackOptions } from '../types/animation.type.js';
import type {
	DuelHealth,
	DuelSide,
	DuelState,
	UseDuelScriptOptions,
	UseDuelScriptResult,
} from '../types/battle.type.js';

function wait(ms: number, signal: AbortSignal): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		if (signal.aborted) {
			reject(new DOMException('Aborted', 'AbortError'));
			return;
		}

		const onAbort = (): void => {
			window.clearTimeout(timeoutId);
			reject(new DOMException('Aborted', 'AbortError'));
		};

		const timeoutId = window.setTimeout(() => {
			signal.removeEventListener('abort', onAbort);
			resolve();
		}, ms);

		signal.addEventListener('abort', onAbort, { once: true });
	});
}

function asSideMap(value: number | DuelHealth | undefined, fallback: DuelHealth): DuelHealth {
	if (typeof value === 'number') {
		return { left: value, right: value };
	}
	return value ?? fallback;
}

export function useDuelScript<TExpression extends string = string>({
	script,
	baseExpression,
	maxHealth: maxHealthProp,
	initialHealth: initialHealthProp,
	idlePreset = 'idle',
	autoStart = true,
	disabled = false,
}: UseDuelScriptOptions<TExpression>): UseDuelScriptResult<TExpression> {
	const maxHealth = useMemo(
		() => asSideMap(maxHealthProp, { left: 20, right: 20 }),
		[maxHealthProp],
	);
	const initialHealth = useMemo(
		() => asSideMap(initialHealthProp, maxHealth),
		[initialHealthProp, maxHealth],
	);

	const baseExpressions = useMemo(
		() => ({ left: baseExpression.left, right: baseExpression.right }),
		[baseExpression.left, baseExpression.right],
	);

	const triggerRef = useRef<DuelHealth>({ left: 0, right: 0 });
	const healthRef = useRef<DuelHealth>({ left: initialHealth.left, right: initialHealth.right });
	const controllerRef = useRef<AbortController | null>(null);

	const initialState = useMemo<DuelState<TExpression>>(
		() => ({
			left: {
				health: initialHealth.left,
				maxHealth: maxHealth.left,
				expression: baseExpressions.left,
				baseExpression: baseExpressions.left,
				status: 'alive',
				animation: { preset: idlePreset, playback: { iterations: 'infinite' as const } },
			},
			right: {
				health: initialHealth.right,
				maxHealth: maxHealth.right,
				expression: baseExpressions.right,
				baseExpression: baseExpressions.right,
				status: 'alive',
				animation: { preset: idlePreset, playback: { iterations: 'infinite' as const } },
			},
			phase: script.name,
			running: false,
		}),
		[
			baseExpressions.left,
			baseExpressions.right,
			idlePreset,
			initialHealth.left,
			initialHealth.right,
			maxHealth.left,
			maxHealth.right,
			script.name,
		],
	);

	const stateRef = useRef<DuelState<TExpression>>(initialState);
	const [state, setState] = useState<DuelState<TExpression>>(initialState);

	const commit = useCallback(
		(updater: (prev: DuelState<TExpression>) => DuelState<TExpression>) => {
			const next = updater(stateRef.current);
			stateRef.current = next;
			setState(next);
		},
		[],
	);

	const abortRun = useCallback(() => {
		controllerRef.current?.abort();
		controllerRef.current = null;
	}, []);

	const reset = useCallback(() => {
		abortRun();
		triggerRef.current = { left: 0, right: 0 };
		healthRef.current = { left: initialHealth.left, right: initialHealth.right };
		commit(() => initialState);
	}, [abortRun, commit, initialHealth.left, initialHealth.right, initialState]);

	const setPhase = useCallback(
		(phase: string) => {
			commit((prev) => ({ ...prev, phase }));
		},
		[commit],
	);

	const setExpression = useCallback(
		(side: DuelSide, expression: TExpression) => {
			commit((prev) => ({
				...prev,
				[side]: { ...prev[side], expression },
			}));
		},
		[commit],
	);

	const playPreset = useCallback(
		(side: DuelSide, preset: string, playback?: PlaybackOptions, holdOnComplete?: boolean) => {
			triggerRef.current[side] += 1;
			const trigger = triggerRef.current[side];
			const config: AnimationConfig = {
				preset,
				...(playback && { playback }),
				trigger,
				...(holdOnComplete !== undefined && { holdOnComplete }),
			};
			commit((prev) => ({
				...prev,
				[side]: { ...prev[side], animation: config },
			}));
		},
		[commit],
	);

	const idle = useCallback(
		(side: DuelSide) => {
			playPreset(side, idlePreset, { iterations: 'infinite' as const });
		},
		[idlePreset, playPreset],
	);

	const applyDamage = useCallback(
		(side: DuelSide, amount: number) => {
			const current = healthRef.current[side];
			const next = Math.max(0, current - Math.max(0, amount));
			healthRef.current[side] = next;
			commit((prev) => ({
				...prev,
				[side]: { ...prev[side], health: next },
			}));
			return next;
		},
		[commit],
	);

	const markDead = useCallback(
		(side: DuelSide) => {
			commit((prev) => ({
				...prev,
				[side]: { ...prev[side], status: 'dead' },
			}));
		},
		[commit],
	);

	const start = useCallback(async () => {
		if (disabled || typeof window === 'undefined') {
			return;
		}

		reset();
		const controller = new AbortController();
		controllerRef.current = controller;
		const { signal } = controller;
		commit((prev) => ({ ...prev, running: true }));

		try {
			for (const step of script.steps) {
				if (signal.aborted) {
					break;
				}

				const label =
					step.type === 'wait'
						? (step.label ?? 'Wait')
						: 'label' in step && step.label
							? step.label
							: step.type;

				setPhase(label);

				switch (step.type) {
					case 'wait': {
						await wait(step.ms, signal);
						break;
					}
					case 'pose': {
						if (stateRef.current[step.side].status === 'dead') {
							break;
						}
						if (step.expression) {
							setExpression(step.side, step.expression);
						}
						playPreset(step.side, step.preset, step.playback, step.holdOnComplete);
						if (step.durationMs !== undefined) {
							await wait(step.durationMs, signal);
							if (step.revertToIdle !== false && stateRef.current[step.side].status !== 'dead') {
								idle(step.side);
								setExpression(step.side, stateRef.current[step.side].baseExpression);
							}
						}
						break;
					}
					case 'attack': {
						if (stateRef.current[step.attacker].status === 'dead') {
							break;
						}
						const hitPreset = step.hitPreset ?? 'hit';
						const hitDelayMs = step.hitDelayMs ?? 140;
						const afterMs = step.afterMs ?? 140;

						if (step.attackerExpression) {
							setExpression(step.attacker, step.attackerExpression);
						}
						if (step.targetExpression) {
							setExpression(step.target, step.targetExpression);
						}

						playPreset(step.attacker, step.preset, { iterations: 1 as const });

						await wait(hitDelayMs, signal);

						if (stateRef.current[step.target].status !== 'dead') {
							playPreset(step.target, hitPreset, { iterations: 1 as const });
							const nextHealth = applyDamage(step.target, step.damage);
							if (nextHealth <= 0) {
								// Keep the target in the hit pose until the script explicitly kills them.
								// (This keeps KO logic declarative and makes death variants easy to swap.)
							}
						}

						const attackDuration =
							getPresetDurationMs(step.preset, { iterations: 1 as const }) ?? 0;
						const reactionDuration =
							getPresetDurationMs(hitPreset, { iterations: 1 as const }) ?? 0;
						const totalDuration = Math.max(attackDuration, hitDelayMs + reactionDuration);
						const remaining = Math.max(0, totalDuration - hitDelayMs);
						if (remaining > 0) {
							await wait(remaining, signal);
						}
						await wait(afterMs, signal);

						if (stateRef.current[step.attacker].status !== 'dead') {
							idle(step.attacker);
							setExpression(step.attacker, stateRef.current[step.attacker].baseExpression);
						}

						if (
							stateRef.current[step.target].status !== 'dead' &&
							healthRef.current[step.target] > 0
						) {
							idle(step.target);
							setExpression(step.target, stateRef.current[step.target].baseExpression);
						}
						break;
					}
					case 'death': {
						if (stateRef.current[step.side].status === 'dead') {
							break;
						}
						if (step.expression) {
							setExpression(step.side, step.expression);
						}
						playPreset(step.side, step.preset, { iterations: 1 as const }, true);
						markDead(step.side);
						const duration = getPresetDurationMs(step.preset, { iterations: 1 as const });
						if (duration) {
							await wait(duration, signal);
						}
						if (step.afterMs) {
							await wait(step.afterMs, signal);
						}
						break;
					}
					case 'victory': {
						if (stateRef.current[step.side].status === 'dead') {
							break;
						}

						const preset = step.preset ?? 'victory';
						const loops = step.loops ?? 5;
						if (step.expression) {
							setExpression(step.side, step.expression);
						}

						playPreset(step.side, preset, { iterations: loops });
						const duration = getPresetDurationMs(preset, { iterations: loops });
						if (duration) {
							await wait(duration, signal);
						}
						if (step.afterMs) {
							await wait(step.afterMs, signal);
						}

						if (stateRef.current[step.side].status !== 'dead') {
							idle(step.side);
							setExpression(step.side, stateRef.current[step.side].baseExpression);
						}
						break;
					}
					default: {
						const exhaustive: never = step;
						throw new Error(`Unknown duel step: ${JSON.stringify(exhaustive)}`);
					}
				}
			}

			if (!signal.aborted) {
				setPhase('Complete');
			}
		} catch (error) {
			if ((error as Error)?.name !== 'AbortError') {
				setPhase('Error');
				// Swallow errors to keep the hook safe in Storybook / long-lived UIs.
				// Consumers can introspect `phase` or fork the hook for stricter handling.
				console.error(error);
			}
		} finally {
			if (controllerRef.current === controller) {
				controllerRef.current = null;
				commit((prev) => ({ ...prev, running: false }));
			}
		}
	}, [
		applyDamage,
		commit,
		disabled,
		idle,
		markDead,
		playPreset,
		reset,
		script.steps,
		setExpression,
		setPhase,
	]);

	const restart = useCallback(() => {
		if (disabled) {
			reset();
		} else {
			void start();
		}
	}, [disabled, reset, start]);

	const stop = useCallback(() => {
		abortRun();
		commit((prev) => ({ ...prev, running: false }));
	}, [abortRun, commit]);

	useEffect(() => {
		if (disabled || !autoStart) {
			return;
		}
		void start();
		return () => abortRun();
	}, [abortRun, autoStart, disabled, start]);

	return {
		state,
		restart,
		stop,
		reset,
	};
}
