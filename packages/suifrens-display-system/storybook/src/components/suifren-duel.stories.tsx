// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getPresetDurationMs } from '@suigar/suifrens-display-system/animation';
import { SuiFrenBattleSprite, useDuelScript } from '@suigar/suifrens-display-system/battle';
import type {
	AnimationConfig,
	BullsharkAttributes,
	CapyAttributes,
	DuelScript,
	DuelSide,
	SuiFrenExpression,
} from '@suigar/suifrens-display-system/types';

const SPRITE_SIZE = 240;
const STAGE_PADDING_X = 0;
const STAGE_HEIGHT = SPRITE_SIZE + 80;
const FIGHT_MAX_HEALTH = 5;
const FIGHT_HEARTS = 5;
const TAUNT_MS = 420;
const FIGHT_BASE_EXPRESSIONS = { left: 'angry', right: 'grimace' } as const;
const WANDER_MIN_SPEED = 22;
const WANDER_MAX_SPEED = 80;
const WANDER_SHIFT_MIN_MS = 550;
const WANDER_SHIFT_MAX_MS = 1400;
const RUN_SPEED_THRESHOLD = 42;
const SPRINT_SPEED_THRESHOLD = 68;
const COLLISION_DISTANCE = SPRITE_SIZE * 0.7;
const COLLISION_GAP_RATIO = 0.28;
const COLLISION_GAP_MAX = SPRITE_SIZE * 0.85;
const MAX_FRAME_MS = 64;
const RING_PADDING = 56;
const RING_COLLISION_DISTANCE = SPRITE_SIZE * 0.78;
const RING_FIGHT_GAP = SPRITE_SIZE * 0.45;
const CURRENT_USER_FIGHTER_ID = 'capy-1';
const MAX_PARALLEL_FIGHTS = 2;
const MIN_RING_FIGHT_MS = 1000;
const FINAL_VICTORY_PRESET = 'victory';
const FINAL_VICTORY_LOOPS = 2;
const FINAL_IDLE_PRESET = 'idle';
const FINAL_VICTORY_EXPRESSION: SuiFrenExpression = 'bigSmile';

type MotionMode = 'roam' | 'fight';
type WanderPreset = 'walk' | 'run' | 'sprint';
type WanderMotion = { preset: WanderPreset; facing: 'left' | 'right' };

type FighterKind = 'bullshark' | 'capy';
type FighterStatus = 'roam' | 'fight' | 'dead' | 'victory';
type FighterSeed = {
	id: string;
	label: string;
	kind: FighterKind;
	attributes: BullsharkAttributes | CapyAttributes;
	power: number;
};
type FighterState = FighterSeed & {
	status: FighterStatus;
	health: number;
	maxHealth: number;
	position: { x: number; y: number };
	velocity: { x: number; y: number };
	nextShiftAt: number;
	wanderPreset: WanderPreset;
	facing: 'left' | 'right';
	animationOverride?: AnimationConfig | null | undefined;
	expressionOverride?: SuiFrenExpression | undefined;
};
type ActiveFight = {
	id: number;
	leftId: string;
	rightId: string;
	winnerId: string;
	script: DuelScript<SuiFrenExpression>;
	slot: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
const nowMs = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
const randomVelocity = () => {
	const speed = randomBetween(WANDER_MIN_SPEED, WANDER_MAX_SPEED);
	return (Math.random() < 0.5 ? -1 : 1) * speed;
};
const pickWanderPreset = (speed: number): WanderPreset => {
	if (speed >= SPRINT_SPEED_THRESHOLD) {
		return 'sprint';
	}
	if (speed >= RUN_SPEED_THRESHOLD) {
		return 'run';
	}
	return 'walk';
};
const pickWanderExpression = (preset: WanderPreset, base: SuiFrenExpression) => {
	if (preset === 'sprint') {
		return 'angry';
	}
	if (preset === 'run') {
		return 'annoyed';
	}
	return base;
};
const mirrorSide = (side: DuelSide): DuelSide => (side === 'left' ? 'right' : 'left');
const mirrorScript = (script: DuelScript<SuiFrenExpression>): DuelScript<SuiFrenExpression> => ({
	...script,
	steps: script.steps.map((step) => {
		switch (step.type) {
			case 'pose':
				return { ...step, side: mirrorSide(step.side) };
			case 'attack':
				return {
					...step,
					attacker: { ...step.attacker, side: mirrorSide(step.attacker.side) },
				};
			case 'death':
				return { ...step, side: mirrorSide(step.side) };
			case 'victory':
				return { ...step, side: mirrorSide(step.side) };
			case 'wait':
				return step;
			default: {
				const exhaustive: never = step;
				return exhaustive;
			}
		}
	}),
});
const stripVictorySteps = <TExpression extends string>(
	script: DuelScript<TExpression>,
): DuelScript<TExpression> => ({
	...script,
	steps: script.steps.filter((step) => step.type !== 'victory'),
});
const randomVelocityVector = () => {
	const speed = randomBetween(WANDER_MIN_SPEED, WANDER_MAX_SPEED);
	const angle = randomBetween(0, Math.PI * 2);
	return { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
};
const randomRunVelocityVector = () => {
	const speed = randomBetween(RUN_SPEED_THRESHOLD, WANDER_MAX_SPEED);
	const angle = randomBetween(0, Math.PI * 2);
	return { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
};
const separateVelocityVector = (dx: number, dy: number) => {
	const distance = Math.hypot(dx, dy);
	if (!distance) {
		return randomRunVelocityVector();
	}
	const speed = randomBetween(RUN_SPEED_THRESHOLD, WANDER_MAX_SPEED);
	return { x: (dx / distance) * speed, y: (dy / distance) * speed };
};
const seekVelocityVector = (fighter: FighterState, roster: Array<FighterState>) => {
	let closest: FighterState | null = null;
	let closestDistanceSq = Number.POSITIVE_INFINITY;

	for (const other of roster) {
		if (other.id === fighter.id || other.status !== 'roam') {
			continue;
		}
		const dx = other.position.x - fighter.position.x;
		const dy = other.position.y - fighter.position.y;
		const distanceSq = dx * dx + dy * dy;
		if (distanceSq < closestDistanceSq) {
			closestDistanceSq = distanceSq;
			closest = other;
		}
	}

	if (!closest) {
		return randomVelocityVector();
	}

	const dx = closest.position.x - fighter.position.x;
	const dy = closest.position.y - fighter.position.y;
	const distance = Math.hypot(dx, dy);
	if (!distance) {
		return randomVelocityVector();
	}
	const speed = randomBetween(WANDER_MIN_SPEED, WANDER_MAX_SPEED);
	return { x: (dx / distance) * speed, y: (dy / distance) * speed };
};
const buildGridPositions = (
	count: number,
	minX: number,
	maxX: number,
	minY: number,
	maxY: number,
) => {
	if (count <= 0) {
		return [];
	}
	const columns = Math.ceil(Math.sqrt(count));
	const rows = Math.ceil(count / columns);
	const width = maxX - minX;
	const height = maxY - minY;
	const xStep = columns > 1 ? width / (columns - 1) : 0;
	const yStep = rows > 1 ? height / (rows - 1) : 0;
	const positions: Array<{ x: number; y: number }> = [];

	for (let row = 0; row < rows; row += 1) {
		const rowStart = row * columns;
		const rowCount = Math.min(columns, count - rowStart);
		const rowWidth = rowCount > 1 ? xStep * (rowCount - 1) : 0;
		const rowOffset = (width - rowWidth) / 2;
		const y = rows === 1 ? (minY + maxY) / 2 : minY + row * yStep;

		for (let col = 0; col < rowCount; col += 1) {
			const x = columns === 1 ? (minX + maxX) / 2 : minX + rowOffset + col * xStep;
			positions.push({ x: clamp(x, minX, maxX), y: clamp(y, minY, maxY) });
		}
	}

	return positions;
};
const getHitFlashTrigger = (animation?: AnimationConfig | null) => {
	if (!animation || !('preset' in animation) || animation.preset !== 'hit') {
		return null;
	}
	return animation.trigger ?? animation.preset;
};
const leftWinScript: DuelScript<SuiFrenExpression> = {
	name: 'Preset Fight',
	steps: [
		{
			type: 'pose',
			label: 'Taunt',
			side: 'left',
			preset: 'ourah',
			playback: { iterations: 'infinite' },
			expression: 'angry',
		},
		{
			type: 'pose',
			label: 'Taunt',
			side: 'right',
			preset: 'showing',
			playback: { iterations: 'infinite' },
			expression: 'cool',
		},
		{
			type: 'wait',
			label: 'Taunt',
			ms: TAUNT_MS,
		},
		{
			type: 'attack',
			label: 'Left punches',
			attacker: { side: 'left', preset: 'punch', expression: 'angry' },
			target: { expression: 'grimace', damage: 1 },
		},
		{
			type: 'attack',
			label: 'Right punches back',
			attacker: { side: 'right', preset: 'punch', expression: 'angry' },
			target: { expression: 'annoyed', damage: 1 },
		},
		{
			type: 'attack',
			label: 'Left kicks',
			attacker: { side: 'left', preset: 'kick', expression: 'angry' },
			target: { expression: 'sad', damage: 1 },
		},
		{
			type: 'attack',
			label: 'Right swings (melee)',
			attacker: { side: 'right', preset: 'melee', expression: 'grimace' },
			target: { expression: 'dizzyFace', damage: 1 },
		},
		{
			type: 'attack',
			label: 'Left melee combo',
			attacker: { side: 'left', preset: 'melee', expression: 'angry' },
			target: { expression: 'shocked', damage: 1 },
		},
		{
			type: 'attack',
			label: 'Right kicks back',
			attacker: { side: 'right', preset: 'kick', expression: 'angry' },
			target: { expression: 'sad', damage: 1 },
		},
		{
			type: 'attack',
			label: 'Left combo',
			attacker: { side: 'left', preset: 'melee', expression: 'angry' },
			target: { expression: 'dizzyFace', damage: 1 },
		},
		{
			type: 'attack',
			label: 'Final punch (KO)',
			attacker: { side: 'left', preset: 'punch', expression: 'angry' },
			target: { expression: 'dizzyFace', damage: 1 },
			afterMs: 200,
		},
		{
			type: 'death',
			label: 'Right falls (death alt)',
			side: 'right',
			preset: 'death2',
			expression: 'dizzyFace',
			afterMs: 200,
		},
		{
			type: 'victory',
			label: 'Left victory (x3)',
			side: 'left',
			preset: 'victory',
			iterations: 3,
			expression: 'bigSmile',
		},
	],
};
const leftWinFightScript = stripVictorySteps(leftWinScript);
const rightWinFightScript = mirrorScript(leftWinFightScript);

const bullsharkBase: BullsharkAttributes = {
	mainColor: '6FBBEE',
	secondaryColor: 'E6FBFF',
	skin: 'basic',
	finStyle: 'classic',
	expression: 'happy',
};

const capyBase: CapyAttributes = {
	mainColor: 'FB825C',
	secondaryColor: 'FFF1D6',
	skin: 'fox',
	earShape: 'wild',
	expression: 'happy',
};

const RING_FIGHTERS: Array<FighterSeed> = [
	{
		id: 'bull-1',
		label: 'Bull 1',
		kind: 'bullshark',
		power: 5,
		attributes: {
			mainColor: '6FBBEE',
			secondaryColor: 'E6FBFF',
			skin: 'basic',
			finStyle: 'classic',
			expression: 'happy',
		},
	},
	{
		id: 'capy-1',
		label: 'Capy 1',
		kind: 'capy',
		power: 4,
		attributes: {
			mainColor: 'FB825C',
			secondaryColor: 'FFF1D6',
			skin: 'fox',
			earShape: 'wild',
			expression: 'happy',
		},
	},
	{
		id: 'bull-2',
		label: 'Bull 2',
		kind: 'bullshark',
		power: 3,
		attributes: {
			mainColor: '469DFD',
			secondaryColor: 'E6FBFF',
			skin: 'panda',
			finStyle: 'classic',
			expression: 'happy',
		},
	},
	{
		id: 'capy-2',
		label: 'Capy 2',
		kind: 'capy',
		power: 2,
		attributes: {
			mainColor: '9DE284',
			secondaryColor: 'FFF1D6',
			skin: 'basic',
			earShape: 'mischievous',
			expression: 'happy',
		},
	},
	{
		id: 'bull-3',
		label: 'Bull 3',
		kind: 'bullshark',
		power: 1,
		attributes: {
			mainColor: 'D85A58',
			secondaryColor: 'F4F4F1',
			skin: 'stripes',
			finStyle: 'classic',
			expression: 'happy',
		},
	},
	{
		id: 'capy-3',
		label: 'Capy 3',
		kind: 'capy',
		power: 0,
		attributes: {
			mainColor: 'FCFF73',
			secondaryColor: 'FFF1D6',
			skin: 'panda',
			earShape: 'quiet',
			expression: 'happy',
		},
	},
];

const FIGHT_SLOT_COUNT = Math.min(
	MAX_PARALLEL_FIGHTS,
	Math.max(1, Math.floor(RING_FIGHTERS.length / 2)),
);

const meta = {
	id: 'suifrenimage-battle-royale',
	title: 'Suifrens/Playground/Battle Royale',
	component: SuiFrenBattleSprite,
	tags: ['autodocs', 'beta'],
} satisfies Meta<typeof SuiFrenBattleSprite>;

export default meta;

type Story = StoryObj<typeof SuiFrenBattleSprite>;

function BattleControls({
	onStart,
	onRestart,
	onStop,
	canStart,
	canStop,
}: {
	onStart: () => void;
	onRestart: () => void;
	onStop: () => void;
	canStart: boolean;
	canStop: boolean;
}) {
	return (
		<>
			<button
				className="story-button disabled:cursor-not-allowed disabled:opacity-50"
				type="button"
				disabled={!canStart}
				onClick={onStart}
			>
				Start
			</button>
			<button className="story-button" type="button" onClick={onRestart}>
				Restart
			</button>
			<button
				className="story-button disabled:cursor-not-allowed disabled:opacity-50"
				type="button"
				disabled={!canStop}
				onClick={onStop}
			>
				Stop
			</button>
		</>
	);
}

export const Duel: Story = {
	render: () => {
		const isDocs =
			typeof window !== 'undefined' &&
			new URLSearchParams(window.location.search).get('viewMode') === 'docs';

		const stageRef = useRef<HTMLDivElement | null>(null);
		const [stageWidth, setStageWidth] = useState(0);
		const [mode, setMode] = useState<MotionMode>('roam');
		const [positions, setPositions] = useState<{ left: number; right: number }>({
			left: 0,
			right: 0,
		});
		const [wanderMotion, setWanderMotion] = useState<Record<'left' | 'right', WanderMotion>>({
			left: { preset: 'walk', facing: 'right' },
			right: { preset: 'walk', facing: 'left' },
		});

		const positionsRef = useRef(positions);
		const velocityRef = useRef({ left: 0, right: 0 });
		const nextShiftRef = useRef({ left: 0, right: 0 });

		const { state, restart, reset, stop } = useDuelScript<SuiFrenExpression>({
			script: leftWinScript,
			baseExpression: FIGHT_BASE_EXPRESSIONS,
			maxHealth: FIGHT_MAX_HEALTH,
			idlePreset: 'idle',
			autoStart: false,
		});

		useEffect(() => {
			if (typeof window === 'undefined') {
				return;
			}
			const stage = stageRef.current;
			if (!stage) {
				return;
			}
			const update = () => setStageWidth(stage.clientWidth);
			update();

			if (typeof ResizeObserver === 'undefined') {
				window.addEventListener('resize', update);
				return () => window.removeEventListener('resize', update);
			}

			const observer = new ResizeObserver(() => update());
			observer.observe(stage);
			return () => observer.disconnect();
		}, []);

		const setWanderVelocity = useCallback(
			(side: 'left' | 'right', velocity: number, now: number) => {
				velocityRef.current[side] = velocity;
				nextShiftRef.current[side] = now + randomBetween(WANDER_SHIFT_MIN_MS, WANDER_SHIFT_MAX_MS);
				const speed = Math.abs(velocity);
				const preset = pickWanderPreset(speed);
				const facing = velocity >= 0 ? 'right' : 'left';
				setWanderMotion((prev) => {
					const current = prev[side];
					if (current.preset === preset && current.facing === facing) {
						return prev;
					}
					return { ...prev, [side]: { preset, facing } };
				});
			},
			[],
		);

		const resetRoam = useCallback(() => {
			if (!stageWidth) {
				return;
			}
			const minX = STAGE_PADDING_X + SPRITE_SIZE / 2;
			const maxX = Math.max(minX, stageWidth - STAGE_PADDING_X - SPRITE_SIZE / 2);
			const minSeparation = Math.min(stageWidth * 0.5, SPRITE_SIZE * 1.6);

			let left = minX;
			let right = maxX;
			for (let i = 0; i < 24; i += 1) {
				const candidateLeft = randomBetween(minX, maxX);
				const candidateRight = randomBetween(minX, maxX);
				if (Math.abs(candidateLeft - candidateRight) >= minSeparation) {
					left = candidateLeft;
					right = candidateRight;
					break;
				}
			}

			positionsRef.current = { left, right };
			setPositions({ left, right });

			const now = nowMs();
			setWanderVelocity('left', randomVelocity(), now);
			setWanderVelocity('right', randomVelocity(), now);
		}, [setWanderVelocity, stageWidth]);

		useEffect(() => {
			if (!stageWidth || mode !== 'roam') {
				return;
			}
			resetRoam();
		}, [mode, resetRoam, stageWidth]);

		const startFight = useCallback(
			(left: number, right: number) => {
				const minX = STAGE_PADDING_X + SPRITE_SIZE / 2;
				const maxX = Math.max(minX, stageWidth - STAGE_PADDING_X - SPRITE_SIZE / 2);
				const gap = Math.min(COLLISION_GAP_MAX, stageWidth * COLLISION_GAP_RATIO);
				const midpoint = (left + right) / 2;
				const bullsharkOnLeft = left <= right;
				const leftTarget = bullsharkOnLeft ? midpoint - gap / 2 : midpoint + gap / 2;
				const rightTarget = bullsharkOnLeft ? midpoint + gap / 2 : midpoint - gap / 2;
				const snappedLeft = clamp(leftTarget, minX, maxX);
				const snappedRight = clamp(rightTarget, minX, maxX);
				positionsRef.current = { left: snappedLeft, right: snappedRight };
				setPositions({ left: snappedLeft, right: snappedRight });
				setMode('fight');
			},
			[stageWidth],
		);

		useEffect(() => {
			if (mode !== 'fight') {
				return;
			}
			restart();
			return stop;
		}, [mode, restart, stop]);

		useEffect(() => {
			if (typeof window === 'undefined' || isDocs || mode !== 'roam' || !stageWidth) {
				return;
			}

			let frameId = 0;
			let last = 0;
			const minX = STAGE_PADDING_X + SPRITE_SIZE / 2;
			const maxX = Math.max(minX, stageWidth - STAGE_PADDING_X - SPRITE_SIZE / 2);

			const tick = (now: number) => {
				if (!last) {
					last = now;
				}
				const dt = Math.min(MAX_FRAME_MS, now - last);
				last = now;

				const velocities = velocityRef.current;
				const shifts = nextShiftRef.current;
				if (now >= shifts.left) {
					setWanderVelocity('left', randomVelocity(), now);
				}
				if (now >= shifts.right) {
					setWanderVelocity('right', randomVelocity(), now);
				}

				let left = positionsRef.current.left + velocities.left * (dt / 1000);
				let right = positionsRef.current.right + velocities.right * (dt / 1000);

				if (left <= minX) {
					left = minX;
					const speed =
						Math.abs(velocities.left) || randomBetween(WANDER_MIN_SPEED, WANDER_MAX_SPEED);
					setWanderVelocity('left', speed, now);
				} else if (left >= maxX) {
					left = maxX;
					const speed =
						Math.abs(velocities.left) || randomBetween(WANDER_MIN_SPEED, WANDER_MAX_SPEED);
					setWanderVelocity('left', -speed, now);
				}

				if (right <= minX) {
					right = minX;
					const speed =
						Math.abs(velocities.right) || randomBetween(WANDER_MIN_SPEED, WANDER_MAX_SPEED);
					setWanderVelocity('right', speed, now);
				} else if (right >= maxX) {
					right = maxX;
					const speed =
						Math.abs(velocities.right) || randomBetween(WANDER_MIN_SPEED, WANDER_MAX_SPEED);
					setWanderVelocity('right', -speed, now);
				}

				if (Math.abs(left - right) <= COLLISION_DISTANCE) {
					startFight(left, right);
					return;
				}

				positionsRef.current = { left, right };
				setPositions({ left, right });
				frameId = window.requestAnimationFrame(tick);
			};

			frameId = window.requestAnimationFrame(tick);
			return () => window.cancelAnimationFrame(frameId);
		}, [isDocs, mode, setWanderVelocity, stageWidth, startFight]);

		const leftDead = state.left.status === 'dead';
		const rightDead = state.right.status === 'dead';

		const leftAttributes: BullsharkAttributes = {
			...bullsharkBase,
			expression:
				mode === 'fight'
					? state.left.expression
					: pickWanderExpression(wanderMotion.left.preset, bullsharkBase.expression),
		};

		const rightAttributes: CapyAttributes = {
			...capyBase,
			expression:
				mode === 'fight'
					? state.right.expression
					: pickWanderExpression(wanderMotion.right.preset, capyBase.expression),
		};

		const leftImageStyle = {
			filter: leftDead ? 'grayscale(1)' : 'none',
			opacity: leftDead ? 0.28 : 1,
			transition: 'filter 180ms ease-out, opacity 260ms ease-out',
			transitionDelay: leftDead ? '0ms, 140ms' : '0ms, 0ms',
		} as const;

		const rightImageStyle = {
			filter: rightDead ? 'grayscale(1)' : 'none',
			opacity: rightDead ? 0.28 : 1,
			transition: 'filter 180ms ease-out, opacity 260ms ease-out',
			transitionDelay: rightDead ? '0ms, 140ms' : '0ms, 0ms',
		} as const;

		const leftHitFlashTrigger = mode === 'fight' ? getHitFlashTrigger(state.left.animation) : null;
		const rightHitFlashTrigger =
			mode === 'fight' ? getHitFlashTrigger(state.right.animation) : null;

		const leftWanderAnimation = useMemo(
			() => ({
				preset: wanderMotion.left.preset,
				playback: { iterations: 'infinite' as const },
			}),
			[wanderMotion.left.preset],
		);

		const rightWanderAnimation = useMemo(
			() => ({
				preset: wanderMotion.right.preset,
				playback: { iterations: 'infinite' as const },
			}),
			[wanderMotion.right.preset],
		);

		const bullsharkOnLeft = positions.left <= positions.right;
		const leftFacing =
			mode === 'fight' ? (bullsharkOnLeft ? 'right' : 'left') : wanderMotion.left.facing;
		const rightFacing =
			mode === 'fight' ? (bullsharkOnLeft ? 'left' : 'right') : wanderMotion.right.facing;

		const leftSpriteStyle = {
			position: 'absolute',
			bottom: 0,
			left: 0,
			transform: `translate3d(${positions.left - SPRITE_SIZE / 2}px, 0, 0)`,
			transition: mode === 'fight' ? 'transform 180ms ease-out' : 'none',
			willChange: 'transform',
			zIndex: leftDead ? 1 : 5,
		} as const;

		const rightSpriteStyle = {
			position: 'absolute',
			bottom: 0,
			left: 0,
			transform: `translate3d(${positions.right - SPRITE_SIZE / 2}px, 0, 0)`,
			transition: mode === 'fight' ? 'transform 180ms ease-out' : 'none',
			willChange: 'transform',
			zIndex: rightDead ? 1 : 5,
		} as const;

		const phaseLabel = mode === 'roam' ? 'Roaming' : state.phase;

		const handleRestart = () => {
			stop();
			reset();
			resetRoam();
			setMode('roam');
		};

		return (
			<div className="story-panel flex flex-col gap-4">
				<div className="flex flex-wrap items-center gap-3">
					<BattleControls
						canStart={Boolean(stageWidth) && !state.running}
						canStop={state.running}
						onStart={() =>
							mode === 'roam'
								? startFight(positionsRef.current.left, positionsRef.current.right)
								: restart()
						}
						onRestart={handleRestart}
						onStop={stop}
					/>
					<div className="text-sm text-slate-700">
						<span className="font-semibold text-slate-900">Phase:</span> {phaseLabel}
					</div>
				</div>

				<div className="story-scene relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-b from-sky-50 to-blue-100 inset-shadow-sm">
					<div className="absolute inset-4 rounded-2xl bg-linear-to-b from-white/70 to-sky-50" />
					<div className="absolute inset-x-10 bottom-10 h-6 rounded-full bg-slate-400/10 blur-md" />

					<div className="battle-field relative px-4 py-8">
						<div ref={stageRef} className="relative" style={{ height: STAGE_HEIGHT }}>
							<SuiFrenBattleSprite
								label="Bullshark"
								health={state.left.health}
								maxHealth={state.left.maxHealth}
								attributes={leftAttributes}
								animation={mode === 'fight' ? state.left.animation : leftWanderAnimation}
								hitFlashTrigger={leftHitFlashTrigger}
								facing={leftFacing}
								size={SPRITE_SIZE}
								style={leftSpriteStyle}
								imageStyle={leftImageStyle}
								healthBarProps={{
									showNumbers: false,
									size: 18,
									hearts: leftDead ? 0 : FIGHT_HEARTS,
								}}
							/>
							<SuiFrenBattleSprite
								label="Capy"
								health={state.right.health}
								maxHealth={state.right.maxHealth}
								attributes={rightAttributes}
								animation={mode === 'fight' ? state.right.animation : rightWanderAnimation}
								hitFlashTrigger={rightHitFlashTrigger}
								facing={rightFacing}
								size={SPRITE_SIZE}
								style={rightSpriteStyle}
								imageStyle={rightImageStyle}
								healthBarProps={{
									showNumbers: false,
									size: 18,
									hearts: rightDead ? 0 : FIGHT_HEARTS,
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	},
};

export const Ring: Story = {
	render: () => {
		const [session, setSession] = useState<'ready' | 'running' | 'stopped'>('ready');
		const ringRef = useRef<HTMLDivElement | null>(null);
		const [ringSize, setRingSize] = useState(0);
		const [fighters, setFighters] = useState<Array<FighterState>>([]);
		const fightersRef = useRef<Array<FighterState>>([]);
		const [activeFights, setActiveFights] = useState<Array<ActiveFight>>([]);
		const activeFightsRef = useRef<Array<ActiveFight>>([]);
		const fightIdRef = useRef(0);
		const resolvedFightRef = useRef(new Set<number>());
		const fightMetaRef = useRef(
			new Map<number, { duelStarted: boolean; startedAt: number | null }>(),
		);
		const ringWinnerRef = useRef<string | null>(null);
		const ringWinnerTimeoutRef = useRef<number | null>(null);
		const [ringWinnerId, setRingWinnerId] = useState<string | null>(null);

		const activeFightBySlot = useMemo(() => {
			const slots: Array<ActiveFight | null> = Array.from({ length: FIGHT_SLOT_COUNT }, () => null);
			for (const fight of activeFights) {
				if (fight.slot < slots.length) {
					slots[fight.slot] = fight;
				}
			}
			return slots;
		}, [activeFights]);

		const duelSlot0 = useDuelScript<SuiFrenExpression>({
			script: activeFightBySlot[0]?.script ?? leftWinScript,
			baseExpression: FIGHT_BASE_EXPRESSIONS,
			maxHealth: FIGHT_MAX_HEALTH,
			idlePreset: 'idle',
			autoStart: session === 'running' && Boolean(activeFightBySlot[0]),
		});
		const duelSlot1 = useDuelScript<SuiFrenExpression>({
			script: activeFightBySlot[1]?.script ?? leftWinScript,
			baseExpression: FIGHT_BASE_EXPRESSIONS,
			maxHealth: FIGHT_MAX_HEALTH,
			idlePreset: 'idle',
			autoStart: session === 'running' && Boolean(activeFightBySlot[1]),
		});

		const { state: duelState0, reset: resetDuel0, stop: stopDuel0 } = duelSlot0;
		const { state: duelState1, reset: resetDuel1, stop: stopDuel1 } = duelSlot1;
		const duelStates = useMemo(() => [duelState0, duelState1], [duelState0, duelState1]);

		useEffect(() => {
			activeFightsRef.current = activeFights;
		}, [activeFights]);

		useEffect(() => {
			if (typeof window === 'undefined') {
				return;
			}
			const ring = ringRef.current;
			if (!ring) {
				return;
			}
			const update = () => setRingSize(ring.clientWidth);
			update();

			if (typeof ResizeObserver === 'undefined') {
				window.addEventListener('resize', update);
				return () => window.removeEventListener('resize', update);
			}

			const observer = new ResizeObserver(() => update());
			observer.observe(ring);
			return () => observer.disconnect();
		}, []);

		const updateVelocity = useCallback(
			(fighter: FighterState, velocity: { x: number; y: number }, now: number): FighterState => {
				const speed = Math.hypot(velocity.x, velocity.y);
				return {
					...fighter,
					velocity,
					nextShiftAt: now + randomBetween(WANDER_SHIFT_MIN_MS, WANDER_SHIFT_MAX_MS),
					wanderPreset: pickWanderPreset(speed),
					facing: velocity.x >= 0 ? 'right' : 'left',
				};
			},
			[],
		);

		const resetRing = useCallback(() => {
			if (!ringSize) {
				return;
			}
			const now = nowMs();
			const minX = RING_PADDING + SPRITE_SIZE / 2;
			const maxX = Math.max(minX, ringSize - RING_PADDING - SPRITE_SIZE / 2);
			const minY = RING_PADDING + SPRITE_SIZE / 2;
			const maxY = Math.max(minY, ringSize - RING_PADDING - SPRITE_SIZE / 2);

			const gridPositions = buildGridPositions(RING_FIGHTERS.length, minX, maxX, minY, maxY);
			const seeded: Array<FighterState> = RING_FIGHTERS.map((seed, index) => {
				const position = gridPositions[index] ?? { x: minX, y: minY };
				return {
					...seed,
					status: 'roam',
					health: FIGHT_MAX_HEALTH,
					maxHealth: FIGHT_MAX_HEALTH,
					position,
					velocity: { x: 0, y: 0 },
					nextShiftAt: now,
					wanderPreset: 'walk',
					facing: 'right',
				};
			});

			const seededWithVelocity = seeded.map((fighter) =>
				updateVelocity(fighter, seekVelocityVector(fighter, seeded), now),
			);

			fightersRef.current = seededWithVelocity;
			setFighters(seededWithVelocity);
			setActiveFights([]);
			activeFightsRef.current = [];
			resolvedFightRef.current.clear();
			fightMetaRef.current.clear();
			fightIdRef.current = 0;
			ringWinnerRef.current = null;
			setRingWinnerId(null);
			if (ringWinnerTimeoutRef.current) {
				window.clearTimeout(ringWinnerTimeoutRef.current);
				ringWinnerTimeoutRef.current = null;
			}
			resetDuel0();
			resetDuel1();
		}, [ringSize, resetDuel0, resetDuel1, updateVelocity]);

		useEffect(() => {
			if (!ringSize) {
				return;
			}
			resetRing();
		}, [resetRing, ringSize]);

		useEffect(() => {
			if (typeof window === 'undefined' || session !== 'running' || ringWinnerId || !ringSize) {
				return;
			}

			let frameId = 0;
			let last = 0;
			const minX = RING_PADDING + SPRITE_SIZE / 2;
			const maxX = Math.max(minX, ringSize - RING_PADDING - SPRITE_SIZE / 2);
			const minY = RING_PADDING + SPRITE_SIZE / 2;
			const maxY = Math.max(minY, ringSize - RING_PADDING - SPRITE_SIZE / 2);
			const collisionDistanceSq = RING_COLLISION_DISTANCE * RING_COLLISION_DISTANCE;

			const tick = (now: number) => {
				if (!last) {
					last = now;
				}
				const dt = Math.min(MAX_FRAME_MS, now - last);
				last = now;
				const canSeekFight =
					!ringWinnerRef.current && activeFightsRef.current.length < FIGHT_SLOT_COUNT;

				let next = fightersRef.current.map((fighter) => {
					if (fighter.status !== 'roam') {
						return fighter;
					}

					let velocity = fighter.velocity;
					if (now >= fighter.nextShiftAt) {
						velocity = canSeekFight
							? seekVelocityVector(fighter, fightersRef.current)
							: randomRunVelocityVector();
					}

					let x = fighter.position.x + velocity.x * (dt / 1000);
					let y = fighter.position.y + velocity.y * (dt / 1000);
					let bounced = false;

					if (x <= minX || x >= maxX) {
						x = clamp(x, minX, maxX);
						velocity = { ...velocity, x: -velocity.x };
						bounced = true;
					}
					if (y <= minY || y >= maxY) {
						y = clamp(y, minY, maxY);
						velocity = { ...velocity, y: -velocity.y };
						bounced = true;
					}

					const updated = { ...fighter, position: { x, y }, velocity };
					if (bounced || now >= fighter.nextShiftAt) {
						return updateVelocity(updated, velocity, now);
					}
					return updated;
				});

				const activeIds = new Set<string>();
				const occupiedSlots = new Set<number>();
				for (const fight of activeFightsRef.current) {
					activeIds.add(fight.leftId);
					activeIds.add(fight.rightId);
					occupiedSlots.add(fight.slot);
				}

				const availableSlots: Array<number> = [];
				for (let slot = 0; slot < FIGHT_SLOT_COUNT; slot += 1) {
					if (!occupiedSlots.has(slot)) {
						availableSlots.push(slot);
					}
				}

				const startedFights: Array<ActiveFight> = [];
				const startFight = (first: FighterState, second: FighterState, slot: number) => {
					const leftId =
						first.position.x < second.position.x
							? first.id
							: first.position.x > second.position.x
								? second.id
								: first.id < second.id
									? first.id
									: second.id;
					const rightId = leftId === first.id ? second.id : first.id;
					const leftFighter = leftId === first.id ? first : second;
					const rightFighter = leftId === first.id ? second : first;
					const winnerId =
						leftFighter.power === rightFighter.power
							? leftFighter.id < rightFighter.id
								? leftFighter.id
								: rightFighter.id
							: leftFighter.power > rightFighter.power
								? leftFighter.id
								: rightFighter.id;

					const midpointX = (leftFighter.position.x + rightFighter.position.x) / 2;
					const midpointY = (leftFighter.position.y + rightFighter.position.y) / 2;
					const gap = Math.min(RING_FIGHT_GAP, maxX - minX);
					const leftPos = {
						x: clamp(midpointX - gap / 2, minX, maxX),
						y: clamp(midpointY, minY, maxY),
					};
					const rightPos = {
						x: clamp(midpointX + gap / 2, minX, maxX),
						y: clamp(midpointY, minY, maxY),
					};

					next = next.map((fighter): FighterState => {
						if (fighter.id === leftId) {
							return {
								...fighter,
								status: 'fight',
								position: leftPos,
								velocity: { x: 0, y: 0 },
								facing: 'right',
								animationOverride: undefined,
								expressionOverride: undefined,
							};
						}
						if (fighter.id === rightId) {
							return {
								...fighter,
								status: 'fight',
								position: rightPos,
								velocity: { x: 0, y: 0 },
								facing: 'left',
								animationOverride: undefined,
								expressionOverride: undefined,
							};
						}
						return fighter;
					});

					const fightId = (fightIdRef.current += 1);
					startedFights.push({
						id: fightId,
						leftId,
						rightId,
						winnerId,
						script: winnerId === leftId ? leftWinFightScript : rightWinFightScript,
						slot,
					});
					fightMetaRef.current.set(fightId, { duelStarted: false, startedAt: null });

					activeIds.add(leftId);
					activeIds.add(rightId);
				};
				if (!ringWinnerRef.current && availableSlots.length) {
					outer: for (const [i, first] of next.entries()) {
						if (first.status !== 'roam' || activeIds.has(first.id)) {
							continue;
						}
						for (let j = i + 1; j < next.length; j += 1) {
							const second = next[j];
							if (!second) {
								continue;
							}
							if (second.status !== 'roam' || activeIds.has(second.id)) {
								continue;
							}
							const dx = first.position.x - second.position.x;
							const dy = first.position.y - second.position.y;
							if (dx * dx + dy * dy <= collisionDistanceSq) {
								const slot = availableSlots.shift();
								if (slot === undefined) {
									break outer;
								}
								startFight(first, second, slot);

								if (!availableSlots.length) {
									break outer;
								}
								break;
							}
						}
					}
				}

				if (!ringWinnerRef.current && availableSlots.length) {
					let candidates = next.filter(
						(fighter) => fighter.status === 'roam' && !activeIds.has(fighter.id),
					);
					while (availableSlots.length && candidates.length >= 2) {
						let bestA = 0;
						let bestB = 1;
						let bestDistanceSq = Number.POSITIVE_INFINITY;
						for (const [i, first] of candidates.entries()) {
							for (let j = i + 1; j < candidates.length; j += 1) {
								const second = candidates[j];
								if (!second) {
									continue;
								}
								const dx = first.position.x - second.position.x;
								const dy = first.position.y - second.position.y;
								const distanceSq = dx * dx + dy * dy;
								if (distanceSq < bestDistanceSq) {
									bestDistanceSq = distanceSq;
									bestA = i;
									bestB = j;
								}
							}
						}
						const slot = availableSlots.shift();
						if (slot === undefined) {
							break;
						}
						const first = candidates[bestA];
						const second = candidates[bestB];
						if (!first || !second) {
							break;
						}
						startFight(first, second, slot);
						const usedIds = new Set([first.id, second.id]);
						candidates = candidates.filter((fighter) => !usedIds.has(fighter.id));
					}
				}

				if (startedFights.length) {
					const updatedFights = [...activeFightsRef.current, ...startedFights];
					activeFightsRef.current = updatedFights;
					setActiveFights(updatedFights);
				}

				if (!ringWinnerRef.current && !availableSlots.length) {
					const avoidVelocities = new Map<string, { x: number; y: number }>();
					for (const [i, first] of next.entries()) {
						if (first.status !== 'roam' || activeIds.has(first.id)) {
							continue;
						}
						for (let j = i + 1; j < next.length; j += 1) {
							const second = next[j];
							if (!second) {
								continue;
							}
							if (second.status !== 'roam' || activeIds.has(second.id)) {
								continue;
							}
							const dx = first.position.x - second.position.x;
							const dy = first.position.y - second.position.y;
							if (dx * dx + dy * dy <= collisionDistanceSq) {
								const velocity = separateVelocityVector(dx, dy);
								avoidVelocities.set(first.id, velocity);
								avoidVelocities.set(second.id, { x: -velocity.x, y: -velocity.y });
							}
						}
					}
					if (avoidVelocities.size) {
						next = next.map((fighter): FighterState => {
							const velocity = avoidVelocities.get(fighter.id);
							if (!velocity) {
								return fighter;
							}
							return updateVelocity({ ...fighter, velocity }, velocity, now);
						});
					}
				}

				fightersRef.current = next;
				setFighters(next);
				frameId = window.requestAnimationFrame(tick);
			};

			frameId = window.requestAnimationFrame(tick);
			return () => window.cancelAnimationFrame(frameId);
		}, [session, ringWinnerId, ringSize, updateVelocity]);

		useEffect(() => {
			if (session !== 'running' || !activeFights.length) {
				return;
			}

			const now = nowMs();
			let updated = false;
			let next = fightersRef.current;
			const remainingFights: Array<ActiveFight> = [];

			for (const fight of activeFights) {
				const duelState = duelStates[fight.slot];
				if (!duelState) {
					remainingFights.push(fight);
					continue;
				}
				let fightMeta = fightMetaRef.current.get(fight.id);
				if (!fightMeta) {
					fightMeta = { duelStarted: false, startedAt: null };
					fightMetaRef.current.set(fight.id, fightMeta);
				}

				const duelHasStarted = duelState.running || duelState.phase !== 'Complete';
				if (duelHasStarted && !fightMeta.duelStarted) {
					fightMeta.duelStarted = true;
					fightMeta.startedAt = now;
				}

				const duelComplete = !duelState.running && duelState.phase === 'Complete';
				const fightDuration = fightMeta.startedAt ? now - fightMeta.startedAt : 0;
				const readyToResolve = fightMeta.duelStarted && fightDuration >= MIN_RING_FIGHT_MS;

				if (!duelComplete || !readyToResolve) {
					remainingFights.push(fight);
					continue;
				}
				if (resolvedFightRef.current.has(fight.id)) {
					continue;
				}
				resolvedFightRef.current.add(fight.id);
				fightMetaRef.current.delete(fight.id);

				next = next.map((fighter): FighterState => {
					if (fighter.id !== fight.leftId && fighter.id !== fight.rightId) {
						return fighter;
					}
					const isLeft = fighter.id === fight.leftId;
					const duelSideState = isLeft ? duelState.left : duelState.right;

					if (fighter.id === fight.winnerId) {
						const velocity = seekVelocityVector(fighter, fightersRef.current);
						return updateVelocity(
							{
								...fighter,
								status: 'roam',
								health: fighter.maxHealth,
								animationOverride: undefined,
								expressionOverride: undefined,
							},
							velocity,
							now,
						);
					}

					return {
						...fighter,
						status: 'dead',
						health: 0,
						velocity: { x: 0, y: 0 },
						nextShiftAt: Number.POSITIVE_INFINITY,
						animationOverride: duelSideState.animation,
						expressionOverride: 'dizzyFace',
					};
				});

				updated = true;
			}

			if (updated) {
				fightersRef.current = next;
				setFighters(next);
			}

			if (remainingFights.length !== activeFights.length) {
				activeFightsRef.current = remainingFights;
				setActiveFights(remainingFights);
			}

			if (!remainingFights.length && !ringWinnerRef.current) {
				const alive = next.filter((fighter) => fighter.status !== 'dead');
				const [winner] = alive;
				if (winner && alive.length === 1) {
					ringWinnerRef.current = winner.id;
					setRingWinnerId(winner.id);
					const celebratePlayback = { iterations: FINAL_VICTORY_LOOPS };
					const celebrateAnimation: AnimationConfig = {
						preset: FINAL_VICTORY_PRESET,
						playback: celebratePlayback,
					};
					const idleAnimation: AnimationConfig = {
						preset: FINAL_IDLE_PRESET,
						playback: { iterations: 'infinite' as const },
					};
					const updatedFighters = next.map((fighter): FighterState =>
						fighter.id === winner.id
							? {
									...fighter,
									status: 'victory',
									velocity: { x: 0, y: 0 },
									nextShiftAt: Number.POSITIVE_INFINITY,
									animationOverride: celebrateAnimation,
									expressionOverride: FINAL_VICTORY_EXPRESSION,
								}
							: fighter,
					);
					fightersRef.current = updatedFighters;
					setFighters(updatedFighters);

					const celebrateDuration =
						getPresetDurationMs(FINAL_VICTORY_PRESET, celebratePlayback) ?? 0;
					if (celebrateDuration > 0) {
						ringWinnerTimeoutRef.current = window.setTimeout(() => {
							const current = fightersRef.current;
							const nextFighters = current.map((fighter) =>
								fighter.id === winner.id && fighter.status === 'victory'
									? {
											...fighter,
											animationOverride: idleAnimation,
											expressionOverride: fighter.attributes.expression,
										}
									: fighter,
							);
							fightersRef.current = nextFighters;
							setFighters(nextFighters);
							ringWinnerTimeoutRef.current = null;
						}, celebrateDuration);
					}
				}
			}
		}, [activeFights, duelStates, session, updateVelocity]);

		const handleStop = () => {
			setSession('stopped');
			stopDuel0();
			stopDuel1();
		};

		useEffect(
			() => () => {
				if (ringWinnerTimeoutRef.current) {
					window.clearTimeout(ringWinnerTimeoutRef.current);
					ringWinnerTimeoutRef.current = null;
				}
			},
			[],
		);

		const fightersById = new Map(fighters.map((fighter) => [fighter.id, fighter]));
		const fightLookup = new Map<
			string,
			{ fight: ActiveFight; side: DuelSide; duelState: (typeof duelStates)[number] }
		>();
		for (const fight of activeFights) {
			const duelState = duelStates[fight.slot];
			if (!duelState) {
				continue;
			}
			fightLookup.set(fight.leftId, { fight, side: 'left', duelState });
			fightLookup.set(fight.rightId, { fight, side: 'right', duelState });
		}

		const aliveFighters = fighters.filter((fighter) => {
			const entry = fightLookup.get(fighter.id);
			const duelState = entry?.duelState;
			const duelSideState =
				entry && duelState ? (entry.side === 'left' ? duelState.left : duelState.right) : null;
			if (duelSideState?.status === 'dead') {
				return false;
			}
			return fighter.status !== 'dead';
		});
		const predictedChampion = aliveFighters.reduce<FighterState | null>((best, fighter) => {
			if (!best) {
				return fighter;
			}
			if (fighter.power === best.power) {
				return fighter.id < best.id ? fighter : best;
			}
			return fighter.power > best.power ? fighter : best;
		}, null);
		const sortedActiveFights = [...activeFights].sort((a, b) => a.id - b.id);
		const firstFight = sortedActiveFights[0];
		const firstPredictedWinner = firstFight
			? (fightersById.get(firstFight.winnerId) ?? null)
			: null;
		const ringPhase =
			session === 'stopped'
				? 'Stopped'
				: ringWinnerId
					? 'Victory'
					: activeFights.length
						? 'Fighting'
						: 'Roaming';

		return (
			<div className="story-panel flex flex-col gap-4">
				<div className="flex flex-wrap items-center gap-3">
					<BattleControls
						canStart={Boolean(ringSize) && (session !== 'running' || Boolean(ringWinnerId))}
						canStop={session === 'running' && !ringWinnerId}
						onStart={() => {
							if (session === 'stopped' || ringWinnerId) resetRing();
							setSession('running');
						}}
						onRestart={() => {
							setSession('ready');
							resetRing();
						}}
						onStop={handleStop}
					/>
					<div className="text-sm text-slate-700">
						<span className="font-semibold text-slate-900">Fighters:</span> {fighters.length}
					</div>
				</div>

				<div className="story-tile p-4 text-sm text-slate-700">
					<div className="flex flex-wrap gap-4">
						<div>
							<span className="font-semibold text-slate-900">Phase:</span> {ringPhase}
						</div>
						<div>
							<span className="font-semibold text-slate-900">Active fights:</span>{' '}
							{activeFights.length}
						</div>
						<div>
							<span className="font-semibold text-slate-900">Alive:</span> {aliveFighters.length}/
							{fighters.length}
						</div>
						<div>
							<span className="font-semibold text-slate-900">Resolved fights:</span>{' '}
							{resolvedFightRef.current.size}
						</div>
						<div>
							<span className="font-semibold text-slate-900">Predicted champion:</span>{' '}
							{predictedChampion
								? predictedChampion.id === CURRENT_USER_FIGHTER_ID
									? 'YOU'
									: predictedChampion.label
								: 'Unknown'}
						</div>
						{ringWinnerId ? (
							<div>
								<span className="font-semibold text-slate-900">Winner:</span>{' '}
								{ringWinnerId === CURRENT_USER_FIGHTER_ID
									? 'YOU'
									: (fightersById.get(ringWinnerId)?.label ?? ringWinnerId)}
							</div>
						) : null}
						<div>
							<span className="font-semibold text-slate-900">First predicted winner:</span>{' '}
							{firstPredictedWinner
								? firstPredictedWinner.id === CURRENT_USER_FIGHTER_ID
									? 'YOU'
									: firstPredictedWinner.label
								: 'None'}
						</div>
					</div>

					<div className="mt-4 grid gap-4 lg:grid-cols-2">
						<div className="rounded-xl bg-white px-3 py-2">
							<div className="mb-2 text-sm font-semibold text-slate-800">Active fights</div>
							{activeFights.length ? (
								<div className="grid gap-1">
									{sortedActiveFights.map((fight) => {
										const left = fightersById.get(fight.leftId);
										const right = fightersById.get(fight.rightId);
										const winner = fightersById.get(fight.winnerId);
										return (
											<div key={fight.id} className="flex flex-wrap items-center gap-2">
												<span className="font-semibold text-slate-900">Fight {fight.id}:</span>
												<span>
													{left
														? left.id === CURRENT_USER_FIGHTER_ID
															? 'YOU'
															: left.label
														: fight.leftId}
													{' vs '}
													{right
														? right.id === CURRENT_USER_FIGHTER_ID
															? 'YOU'
															: right.label
														: fight.rightId}
												</span>
												<span className="text-slate-500">|</span>
												<span className="text-slate-600">
													Winner:{' '}
													{winner
														? winner.id === CURRENT_USER_FIGHTER_ID
															? 'YOU'
															: winner.label
														: fight.winnerId}
												</span>
												<span className="text-slate-500">|</span>
												<span className="text-slate-500">Slot {fight.slot + 1}</span>
											</div>
										);
									})}
								</div>
							) : (
								<div className="text-slate-500">No active fights.</div>
							)}
						</div>

						<div className="rounded-xl bg-white px-3 py-2">
							<div className="mb-2 text-sm font-semibold text-slate-800">Roster snapshot</div>
							<div className="grid gap-1">
								{fighters.map((fighter) => {
									const entry = fightLookup.get(fighter.id);
									const duelState = entry?.duelState;
									const duelSideState =
										entry && duelState
											? entry.side === 'left'
												? duelState.left
												: duelState.right
											: null;
									const currentAnimation = duelSideState?.animation ??
										fighter.animationOverride ?? {
											preset: fighter.wanderPreset,
										};
									const animationLabel =
										'preset' in currentAnimation ? currentAnimation.preset : 'custom';
									const rosterDead =
										fighter.status === 'dead' ||
										duelSideState?.status === 'dead' ||
										duelSideState?.health === 0;
									const currentExpression = rosterDead
										? 'dizzyFace'
										: (duelSideState?.expression ??
											fighter.expressionOverride ??
											fighter.attributes.expression);
									const currentHealth = duelSideState?.health ?? fighter.health;
									const statusLabel =
										duelSideState?.status === 'dead' && fighter.status !== 'dead'
											? `${fighter.status} (dead)`
											: fighter.status;
									return (
										<div key={fighter.id} className="flex flex-wrap items-center gap-2">
											<span className="font-semibold text-slate-900">
												{fighter.id === CURRENT_USER_FIGHTER_ID ? 'YOU' : fighter.label}
											</span>
											<span className="text-slate-500">|</span>
											<span>Status: {statusLabel}</span>
											<span className="text-slate-500">|</span>
											<span>
												HP: {Math.round(currentHealth)}/{fighter.maxHealth}
											</span>
											<span className="text-slate-500">|</span>
											<span>Power: {fighter.power}</span>
											<span className="text-slate-500">|</span>
											<span>Expr: {currentExpression}</span>
											<span className="text-slate-500">|</span>
											<span>Anim: {animationLabel}</span>
											<span className="text-slate-500">|</span>
											<span>Facing: {fighter.facing}</span>
											<span className="text-slate-500">|</span>
											<span>
												Pos: {Math.round(fighter.position.x)},{Math.round(fighter.position.y)}
											</span>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>

				<div className="story-scene relative overflow-hidden rounded-2xl border border-slate-300 bg-linear-to-br from-amber-50 via-amber-100 to-amber-200 inset-shadow-sm">
					<div className="battle-field relative mx-auto w-full max-w-215 px-6 py-8">
						<div ref={ringRef} className="relative w-full" style={{ height: ringSize }}>
							{fighters.map((fighter) => {
								const entry = fightLookup.get(fighter.id);
								const duelState = entry?.duelState;
								const duelSideState =
									entry && duelState
										? entry.side === 'left'
											? duelState.left
											: duelState.right
										: null;
								const isCurrentUser = fighter.id === CURRENT_USER_FIGHTER_ID;
								const duelDead = Boolean(duelSideState && duelSideState.status === 'dead');
								const duelHealthZero = duelSideState?.health === 0;
								const isDead = fighter.status === 'dead' || duelDead || duelHealthZero;

								const animation =
									fighter.status === 'dead'
										? (fighter.animationOverride ?? { preset: 'death2', holdOnComplete: true })
										: fighter.status === 'victory'
											? (fighter.animationOverride ?? {
													preset: FINAL_IDLE_PRESET,
													playback: { iterations: 'infinite' as const },
												})
											: duelSideState
												? duelSideState.animation
												: (fighter.animationOverride ?? {
														preset: fighter.wanderPreset,
														playback: { iterations: 'infinite' as const },
													});

								const expression =
									duelHealthZero || isDead
										? 'dizzyFace'
										: fighter.status === 'victory'
											? (fighter.expressionOverride ?? fighter.attributes.expression)
											: duelSideState
												? duelSideState.expression
												: pickWanderExpression(fighter.wanderPreset, fighter.attributes.expression);

								const facing =
									fighter.status === 'fight' && entry
										? entry.side === 'left'
											? 'right'
											: 'left'
										: fighter.facing;

								const health = duelSideState ? duelSideState.health : fighter.health;
								const hitFlashTrigger = duelSideState
									? getHitFlashTrigger(duelSideState.animation)
									: null;
								const imageStyle = {
									filter: isDead ? 'grayscale(1)' : 'none',
									opacity: isDead ? 0.24 : 1,
									transition: 'filter 200ms ease-out, opacity 280ms ease-out',
									transitionDelay: isDead ? '0ms, 160ms' : '0ms, 0ms',
								} as const;
								const label = isCurrentUser ? (
									<span
										style={{
											padding: '2px 8px',
											borderRadius: 999,
											background: '#0ea5e9',
											color: '#fff',
											fontWeight: 800,
											letterSpacing: 0.6,
										}}
									>
										YOU
									</span>
								) : (
									fighter.label
								);

								const style = {
									position: 'absolute',
									left: 0,
									top: 0,
									transform: `translate3d(${fighter.position.x - SPRITE_SIZE / 2}px, ${fighter.position.y - SPRITE_SIZE / 2}px, 0)`,
									transition: fighter.status === 'fight' ? 'transform 180ms ease-out' : 'none',
									willChange: 'transform',
									zIndex: isDead ? 0 : Math.round(fighter.position.y) + 5,
								} as const;

								if (fighter.kind === 'bullshark') {
									return (
										<SuiFrenBattleSprite
											key={fighter.id}
											label={label}
											health={health}
											maxHealth={fighter.maxHealth}
											attributes={{ ...fighter.attributes, expression }}
											animation={animation}
											hitFlashTrigger={hitFlashTrigger}
											facing={facing}
											size={SPRITE_SIZE}
											style={style}
											imageStyle={imageStyle}
											healthBarProps={{
												showNumbers: false,
												size: 14,
												hearts: isDead ? 0 : FIGHT_HEARTS,
											}}
										/>
									);
								}

								return (
									<SuiFrenBattleSprite
										key={fighter.id}
										label={label}
										health={health}
										maxHealth={fighter.maxHealth}
										attributes={{ ...fighter.attributes, expression }}
										animation={animation}
										hitFlashTrigger={hitFlashTrigger}
										facing={facing}
										size={SPRITE_SIZE}
										style={style}
										imageStyle={imageStyle}
										healthBarProps={{
											showNumbers: false,
											size: 14,
											hearts: isDead ? 0 : FIGHT_HEARTS,
										}}
									/>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		);
	},
};
