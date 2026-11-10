// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { type PointerEvent, type RefObject, useEffect, useRef, useState } from 'react';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import type { BullsharkExpression } from '@suigar/suifrens-display-system/types';
import {
	type SuiFrenActorPose,
	type SuiFrenActorSnapshot,
	useSuiFrenActor,
} from '../utils/use-suifren-actor.js';

const PLAYGROUND_WIDTH = 960;
const PLAYGROUND_HEIGHT = 540;
const SPRITE_SIZE = 240;

const baseAttributes = {
	mainColor: '6FBBEE',
	secondaryColor: 'E6FBFF',
	skin: 'basic',
	finStyle: 'classic',
	expression: 'happy',
} as const;

const meta = {
	title: 'SuiFrenImageInline/Playable Sandbox',
	component: SuiFrenImageInline,
	tags: ['autodocs'],
} satisfies Meta<typeof SuiFrenImageInline>;

export default meta;

type Story = StoryObj<typeof SuiFrenImageInline>;

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
		event.preventDefault();
		event.currentTarget.setPointerCapture?.(event.pointerId);
		onPress();
	};
	const handleUp = (event: PointerEvent<HTMLButtonElement>) => {
		event.preventDefault();
		onRelease?.();
		event.currentTarget.releasePointerCapture?.(event.pointerId);
	};
	const handleLeave = () => {
		onRelease?.();
	};

	return (
		<button
			type="button"
			aria-label={ariaLabel ?? label}
			onPointerDown={handleDown}
			onPointerUp={handleUp}
			onPointerLeave={handleLeave}
			onPointerCancel={handleLeave}
			className={[
				'flex h-12 items-center justify-center rounded-xl border text-sm font-semibold shadow-xs transition',
				active
					? 'border-blue-500 bg-blue-500 text-white shadow-blue-200'
					: 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100',
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
	state: SuiFrenActorSnapshot<BullsharkExpression>;
	poseRef: RefObject<SuiFrenActorPose>;
	title?: string;
	note?: string;
	live?: boolean;
};

function SuiFrenStage({ state, poseRef, title, note, live = true }: StageProps) {
	const spriteRef = useRef<HTMLDivElement | null>(null);
	const isEmoting = state.expression !== state.baseExpression;

	useEffect(() => {
		const el = spriteRef.current;
		const pose = poseRef.current;
		if (!el || !pose) {
			return;
		}
		const x = pose.position.x - SPRITE_SIZE / 2;
		const y = pose.position.y - SPRITE_SIZE - pose.elevation;
		const flip = pose.facing === 'left' ? -1 : 1;
		el.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${flip})`;
	}, [poseRef, live]);

	useEffect(() => {
		if (!live || typeof window === 'undefined') {
			return;
		}
		let raf = 0;
		const updateTransform = () => {
			if (document.visibilityState === 'hidden') {
				raf = requestAnimationFrame(updateTransform);
				return;
			}
			const pose = poseRef.current;
			const el = spriteRef.current;
			if (pose && el) {
				const x = pose.position.x - SPRITE_SIZE / 2;
				const y = pose.position.y - SPRITE_SIZE - pose.elevation;
				const flip = pose.facing === 'left' ? -1 : 1;
				el.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${flip})`;
			}
			raf = requestAnimationFrame(updateTransform);
		};
		raf = requestAnimationFrame(updateTransform);
		return () => cancelAnimationFrame(raf);
	}, [poseRef, live]);

	return (
		<div>
			{title ? <h3 className="mb-2 text-sm font-semibold text-slate-800">{title}</h3> : null}
			<div
				className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-b from-sky-50 to-blue-100 inset-shadow-sm"
				style={{ width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT }}
			>
				<div className="absolute inset-4 rounded-2xl bg-linear-to-b from-white/70 to-sky-50" />
				<div className="absolute inset-x-6 bottom-12 h-6 rounded-full bg-slate-400/10 blur-md" />

				<div
					ref={spriteRef}
					style={{
						width: SPRITE_SIZE,
						height: SPRITE_SIZE,
						position: 'absolute',
						transformOrigin: '50% 80%',
						willChange: 'transform',
					}}
				>
					<div className="relative h-full w-full">
						{isEmoting ? (
							<div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
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

				<div className="absolute top-4 left-4 flex flex-col gap-1 rounded-lg bg-white/85 px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs">
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
			{note ? <p className="mt-2 text-xs text-slate-600">{note}</p> : null}
		</div>
	);
}

export const ControlPadPlayground: Story = {
	render: () => {
		const isDocs =
			typeof window !== 'undefined' &&
			new URLSearchParams(window.location.search).get('viewMode') === 'docs';

		const { state, controls, poseRef } = useSuiFrenActor<BullsharkExpression>({
			bounds: { width: PLAYGROUND_WIDTH, height: PLAYGROUND_HEIGHT, padding: SPRITE_SIZE / 2 },
			initialPosition: {
				x: PLAYGROUND_WIDTH / 2,
				y: PLAYGROUND_HEIGHT - SPRITE_SIZE * 0.4,
			},
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
				if (event.metaKey || event.ctrlKey || event.altKey) {
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
				held.delete(event.code);
				updateFromKeys();
			};

			window.addEventListener('keydown', handleKeyDown);
			window.addEventListener('keyup', handleKeyUp);

			return () => {
				window.removeEventListener('keydown', handleKeyDown);
				window.removeEventListener('keyup', handleKeyUp);
			};
		}, [controls, isDocs]);

		return (
			<div className="flex flex-col gap-4 lg:flex-row">
				<div className="flex-1">
					<SuiFrenStage
						state={state}
						poseRef={poseRef}
						title="Control Pad"
						note="Buttons can be long-pressed; movement, run, crouch, jump, and emotes stay independent so you can trigger emotes mid-run or mid-jump."
						live={!isDocs}
					/>
				</div>

				<div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-xs backdrop-blur-sm">
					<div>
						<h3 className="text-sm font-semibold text-slate-800">Movement Pad</h3>
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
						<h3 className="text-sm font-semibold text-slate-800">Emotes</h3>
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
