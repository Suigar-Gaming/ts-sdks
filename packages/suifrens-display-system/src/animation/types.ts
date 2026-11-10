import type { AnimationPart } from './parts.js';

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
	/** Convenience alias for iterations. `true` means infinite loop. */
	loop?: boolean | number;
};

export type AnimationDirection = 'forward' | 'reverse';

export type PlayState = 'idle' | 'running' | 'paused' | 'stopped';

type AnimationBaseConfig = {
	playback?: PlaybackOptions;
	autoPlay?: boolean;
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
	  })
	| (AnimationBaseConfig & {
			preset: string;
	  });
