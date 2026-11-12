// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { CORE_PRESET_SEQUENCES } from '../animation/presets/core.js';
import type { DEFERRED_PRESETS } from '../generated/preset-catalogues.js';

/** Names of the built-in core and deferred animation presets. */
export type AnimationPresetName =
	| keyof typeof CORE_PRESET_SEQUENCES
	| keyof typeof DEFERRED_PRESETS;

export type AnimationRegistration = {
	getBaseTransform: () => string | undefined;
	setTransform: (value: string) => void;
	pivotOverride?: { x: number; y: number } | undefined;
	lastTransform?: string;
	element?: SVGGraphicsElement;
};

export type NormalizedPlayback = {
	iterations: number;
	alternate: boolean;
	speed: number;
};

export type EasingFunction = (t: number) => number;

export type Matrix = [number, number, number, number, number, number];

export type AnimationPart =
	| 'body'
	| 'head'
	| 'leftArm'
	| 'rightArm'
	| 'leftLeg'
	| 'rightLeg'
	| 'tail'
	| 'fin';

export type PartPose = {
	rotate?: number;
	translate?: { x: number; y: number };
	scale?: { x?: number; y?: number };
};

export type EasingName = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';

export type AnimationKeyframe = {
	at: number;
	pose: PartPose;
	ease?: EasingName;
};

export type AnimationTrack = {
	part: AnimationPart;
	keyframes: Array<AnimationKeyframe>;
};

export type AnimationSequence = {
	name?: string;
	duration: number;
	tracks: Array<AnimationTrack>;
};

export type PlaybackOptions = {
	/** Number of directional passes to execute. Defaults to 1. Use "infinite" to repeat forever. */
	iterations?: number | 'infinite';
	/** Mirrors the sequence on every other iteration (forward then backward). */
	alternate?: boolean;
	/** Speed multiplier, where 1 is the authored speed. */
	speed?: number;
};

export type AnimationDirection = 'forward' | 'reverse';

export type PlayState = 'idle' | 'running' | 'paused' | 'stopped';

type AnimationBaseConfig = {
	playback?: PlaybackOptions;
	playState?: PlayState;
	direction?: AnimationDirection;
	/** Changing the trigger value restarts the animation timeline. */
	trigger?: string | number;
	/** Defines the resting start position when resetting or restarting. */
	startAt?: 'start' | 'end';
	/** Keeps the final pose instead of clearing once iterations end. */
	holdOnComplete?: boolean;
	/** Time in ms to blend from the previous pose into this animation. Use 0 to disable blending. */
	transitionMs?: number;
};

export type AnimationConfig =
	| (AnimationBaseConfig & {
			sequence: AnimationSequence;
			preset?: never;
	  })
	| (AnimationBaseConfig & {
			preset: string;
			sequence?: never;
	  });

export type AnimationTarget = {
	part: AnimationPart;
	element: SVGGraphicsElement | undefined;
	baseTransform: string | undefined;
	pivotOverride: { x: number; y: number } | undefined;
};
