// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { type PointerEvent, type RefObject, useEffect, useRef, useState } from 'react';
import { expect } from 'storybook/test';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import type { SuiFrenExpression } from '@suigar/suifrens-display-system/types';
import {
	type SuiFrenActorPose,
	type SuiFrenActorSnapshot,
	useSuiFrenActor,
} from '../../utils/use-suifren-actor.js';

const PLAYGROUND_WIDTH = 960;
const PLAYGROUND_HEIGHT = 540;
const SPRITE_SIZE = 240;

const bounds = { width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, padding: SPRITE_SIZE / 2 };
const initialPosition = { x: PLAYGROUND_WIDTH / 2, y: PLAYGROUND_HEIGHT - bounds.padding };

const baseAttributes = {
	mainColor: '6FBBEE',
	secondaryColor: 'E6FBFF',
	skin: 'basic',
	finStyle: 'classic',
	expression: 'happy',
} as const;

const meta = {
	title: 'Suifrens/Playground/Sandbox',
	parameters: { controls: { disable: true } },
	tags: ['1.0.2'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

type DirectionKey = 'up' | 'down' | 'left' | 'right';

type ControlButtonProps = {
	label: string;
	ariaLabel?: string;
	active?: boolean;
	onPress: () => void;
	onRelease?: () => void;
	className?: string;
};

function ControlButton({
	label,
	ariaLabel,
	active,
	onPress,
	onRelease,
	className,
}: ControlButtonProps) {
	const handleDown = (event: PointerEvent<HTMLButtonElement>) => {
		if (event.button !== 0 || !onRelease) {
			return;
		}
		event.preventDefault();
		event.currentTarget.setPointerCapture(event.pointerId);
		onPress();
	};

	return (
		<button
			type="button"
			aria-label={ariaLabel ?? label}
			onPointerDown={handleDown}
			onLostPointerCapture={onRelease}
			onClick={onRelease ? undefined : onPress}
			onKeyDown={(event) => {
				if (onRelease && !event.repeat && (event.key === ' ' || event.key === 'Enter')) {
					onPress();
				}
			}}
			onKeyUp={(event) => {
				if (event.key === ' ' || event.key === 'Enter') {
					onRelease?.();
				}
			}}
			onBlur={onRelease}
			className={[
				'flex min-h-12 touch-none select-none px-2 items-center justify-center rounded-xl border text-sm font-semibold shadow-xs transition',
				active
					? 'border-blue-500 bg-blue-500 text-white shadow-blue-200'
					: 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700',
				className ?? '',
			]
				.filter(Boolean)
				.join(' ')}
		>
			{label}
		</button>
	);
}

type StageProps = {
	state: SuiFrenActorSnapshot<SuiFrenExpression>;
	spriteRef: RefObject<HTMLDivElement | null>;
	title?: string;
	note?: string;
};

function updateSprite(el: HTMLDivElement | null, pose: SuiFrenActorPose) {
	if (!el) {
		return;
	}
	const x = (pose.position.x / SPRITE_SIZE - 0.5) * 100;
	const y = ((pose.position.y - pose.elevation) / SPRITE_SIZE - 1) * 100;
	el.style.transform = `translate3d(${x}%, ${y}%, 0) scaleX(${pose.facing === 'left' ? -1 : 1})`;
}

function SuiFrenStage({ state, spriteRef, title, note }: StageProps) {
	const isEmoting = state.expression !== state.baseExpression;

	return (
		<div>
			{title ? (
				<h3 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
			) : null}
			<div
				className="story-scene story-stage"
				style={{ aspectRatio: PLAYGROUND_WIDTH / PLAYGROUND_HEIGHT }}
			>
				<div
					ref={spriteRef}
					style={{
						width: `${(SPRITE_SIZE / PLAYGROUND_WIDTH) * 100}%`,
						aspectRatio: '1',
						position: 'absolute',
						transformOrigin: '50% 80%',
						willChange: 'transform',
					}}
				>
					<div className="relative h-full w-full">
						{isEmoting ? (
							<div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:bg-slate-900/90 dark:text-slate-200">
								{state.expression}
							</div>
						) : null}
						<SuiFrenImageInline
							attributes={{ ...baseAttributes, expression: state.expression }}
							shadow
							style={{ width: '100%', height: '100%' }}
							animation={state.animation}
						/>
					</div>
				</div>

				<div className="absolute top-4 left-4 flex flex-col gap-1 rounded-lg bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs dark:bg-slate-900/85 dark:text-slate-200">
					<span>Locomotion: {state.locomotion}</span>
					<span>Facing: {state.facing}</span>
					<span>
						Expression: {state.expression}
						{isEmoting ? ' (emote)' : ''}
					</span>
					<span>
						Position: {Math.round(state.position.x)}, {Math.round(state.position.y)}
					</span>
				</div>
			</div>
			{note ? <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{note}</p> : null}
		</div>
	);
}

export const ControlPadPlayground: Story = {
	play: async ({ canvas, userEvent }) => {
		await userEvent.click(canvas.getByRole('button', { name: 'Heart eyes' }));
		await expect(canvas.getByText('Expression: heartEyes', { exact: false })).toBeVisible();
		await userEvent.click(canvas.getByRole('button', { name: 'Reset position' }));
		await expect(canvas.getByText('Expression: happy', { exact: false })).toBeVisible();
	},
	render: () => {
		const isDocs =
			typeof window !== 'undefined' &&
			new URLSearchParams(window.location.search).get('viewMode') === 'docs';

		const spriteRef = useRef<HTMLDivElement>(null);
		const { state, controls } = useSuiFrenActor<SuiFrenExpression>({
			bounds,
			initialPosition,
			onPose: (pose) => updateSprite(spriteRef.current, pose),
			moveSpeed: 320,
			runMultiplier: 1.8,
			jumpStrength: 820,
			gravity: 2600,
			defaultExpression: baseAttributes.expression,
			reactSyncIntervalMs: 120,
		});

		const directionRef = useRef<Set<DirectionKey>>(new Set());
		const runRef = useRef(false);
		const crouchRef = useRef(false);
		const [activeDirections, setActiveDirections] = useState<Array<DirectionKey>>([]);
		const [runActive, setRunActive] = useState(false);
		const [crouchActive, setCrouchActive] = useState(false);

		const applyControls = () => {
			const x =
				(directionRef.current.has('left') ? -1 : 0) + (directionRef.current.has('right') ? 1 : 0);
			const y =
				(directionRef.current.has('up') ? -1 : 0) + (directionRef.current.has('down') ? 1 : 0);
			controls.setDirection(x, y);
			controls.setRun(runRef.current);
			controls.setCrouch(crouchRef.current);
		};

		const pressDirection = (dir: DirectionKey) => {
			if (!directionRef.current.has(dir)) {
				directionRef.current.add(dir);
				setActiveDirections(Array.from(directionRef.current));
			}
			applyControls();
		};

		const releaseDirection = (dir: DirectionKey) => {
			if (directionRef.current.delete(dir)) {
				setActiveDirections(Array.from(directionRef.current));
				applyControls();
			}
		};

		const pressRun = () => {
			runRef.current = true;
			crouchRef.current = false;
			setCrouchActive(false);
			setRunActive(true);
			applyControls();
		};

		const releaseRun = () => {
			runRef.current = false;
			setRunActive(false);
			applyControls();
		};

		const pressCrouch = () => {
			crouchRef.current = true;
			setCrouchActive(true);
			runRef.current = false;
			setRunActive(false);
			applyControls();
		};

		const releaseCrouch = () => {
			crouchRef.current = false;
			setCrouchActive(false);
			applyControls();
		};

		useEffect(() => {
			if (typeof window === 'undefined' || isDocs) {
				return;
			}
			const held = new Set<string>();

			const updateFromKeys = () => {
				const x =
					(held.has('ArrowLeft') || held.has('KeyA') ? -1 : 0) +
					(held.has('ArrowRight') || held.has('KeyD') ? 1 : 0);
				const y =
					(held.has('ArrowUp') || held.has('KeyW') ? -1 : 0) +
					(held.has('ArrowDown') || held.has('KeyS') ? 1 : 0);
				controls.setDirection(x, y);
				controls.setRun(held.has('ShiftLeft') || held.has('ShiftRight'));
				controls.setCrouch(held.has('KeyC'));
			};

			const handleKeyDown = (event: KeyboardEvent) => {
				if (
					event.metaKey ||
					event.ctrlKey ||
					event.altKey ||
					(event.code === 'Space' && event.target instanceof HTMLButtonElement) ||
					![
						'ArrowLeft',
						'ArrowRight',
						'ArrowUp',
						'ArrowDown',
						'KeyA',
						'KeyD',
						'KeyW',
						'KeyS',
						'ShiftLeft',
						'ShiftRight',
						'KeyC',
						'Space',
						'Digit1',
						'Digit2',
						'Digit3',
						'Digit4',
						'KeyR',
					].includes(event.code)
				) {
					return;
				}
				event.preventDefault();
				if (event.repeat) {
					return;
				}
				held.add(event.code);

				if (event.code === 'Space') {
					controls.requestJump();
				} else if (event.code === 'Digit1') {
					controls.triggerEmote('heartEyes', 1600);
				} else if (event.code === 'Digit2') {
					controls.triggerEmote('laughing', 1600);
				} else if (event.code === 'Digit3') {
					controls.triggerEmote('angry', 1600);
				} else if (event.code === 'Digit4') {
					controls.triggerEmote('cool', 1600);
				} else if (event.code === 'KeyR') {
					controls.reset();
				}

				updateFromKeys();
			};

			const handleKeyUp = (event: KeyboardEvent) => {
				if (held.delete(event.code)) {
					updateFromKeys();
				}
			};

			window.addEventListener('keydown', handleKeyDown);
			window.addEventListener('keyup', handleKeyUp);

			return () => {
				window.removeEventListener('keydown', handleKeyDown);
				window.removeEventListener('keyup', handleKeyUp);
			};
		}, [controls, isDocs]);

		return (
			<div className="flex w-full flex-wrap items-start gap-4">
				<div className="min-w-0 flex-[3_1_28rem]">
					<SuiFrenStage
						state={state}
						spriteRef={spriteRef}
						title="Control Pad"
						note="Hold Run to run forward. Use the arrows to steer."
					/>
				</div>

				<div className="story-panel flex flex-[1_1_16rem] flex-col gap-4">
					<div>
						<h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
							Movement Pad
						</h3>
						<div className="mt-3 grid grid-cols-3 gap-2">
							<div />
							<ControlButton
								label="↑"
								ariaLabel="Move up"
								active={activeDirections.includes('up')}
								onPress={() => pressDirection('up')}
								onRelease={() => releaseDirection('up')}
							/>
							<div />
							<ControlButton
								label="←"
								ariaLabel="Move left"
								active={activeDirections.includes('left')}
								onPress={() => pressDirection('left')}
								onRelease={() => releaseDirection('left')}
							/>
							<div />
							<ControlButton
								label="→"
								ariaLabel="Move right"
								active={activeDirections.includes('right')}
								onPress={() => pressDirection('right')}
								onRelease={() => releaseDirection('right')}
							/>
							<div />
							<ControlButton
								label="↓"
								ariaLabel="Move down"
								active={activeDirections.includes('down')}
								onPress={() => pressDirection('down')}
								onRelease={() => releaseDirection('down')}
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2">
						<ControlButton
							label="Run (Hold)"
							ariaLabel="Hold to run"
							active={runActive}
							onPress={pressRun}
							onRelease={releaseRun}
						/>
						<ControlButton
							label="Crouch (Hold)"
							ariaLabel="Hold to crouch"
							active={crouchActive}
							onPress={pressCrouch}
							onRelease={releaseCrouch}
						/>
						<ControlButton label="Jump" ariaLabel="Jump" onPress={() => controls.requestJump()} />
						<ControlButton
							label="Reset"
							ariaLabel="Reset position"
							onPress={() => controls.reset()}
						/>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Emotes</h3>
						<div className="mt-2 grid grid-cols-2 gap-2">
							<ControlButton
								label="❤️"
								ariaLabel="Heart eyes"
								onPress={() => controls.triggerEmote('heartEyes', 1600)}
							/>
							<ControlButton
								label="😂"
								ariaLabel="Laughing"
								onPress={() => controls.triggerEmote('laughing', 1600)}
							/>
							<ControlButton
								label="😡"
								ariaLabel="Angry"
								onPress={() => controls.triggerEmote('angry', 1600)}
							/>
							<ControlButton
								label="😎"
								ariaLabel="Cool"
								onPress={() => controls.triggerEmote('cool', 1600)}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	},
};
