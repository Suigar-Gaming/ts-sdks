import type { AnimationSequence } from './types.js';

const RUN_DURATION = 900;

const runSequence: AnimationSequence = {
	name: 'run',
	duration: RUN_DURATION,
	tracks: [
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 22, translate: { x: 10, y: -6 } },
					ease: 'easeInOut',
				},
				{
					at: RUN_DURATION / 2,
					pose: { rotate: -22, translate: { x: -10, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: RUN_DURATION,
					pose: { rotate: 22, translate: { x: 10, y: -6 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -22, translate: { x: -10, y: -6 } },
					ease: 'easeInOut',
				},
				{
					at: RUN_DURATION / 2,
					pose: { rotate: 22, translate: { x: 10, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: RUN_DURATION,
					pose: { rotate: -22, translate: { x: -10, y: -6 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'leftLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -14, translate: { x: -8, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: RUN_DURATION / 2,
					pose: { rotate: 14, translate: { x: 8, y: -6 } },
					ease: 'easeInOut',
				},
				{
					at: RUN_DURATION,
					pose: { rotate: -14, translate: { x: -8, y: 4 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'rightLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 14, translate: { x: 8, y: -6 } },
					ease: 'easeInOut',
				},
				{
					at: RUN_DURATION / 2,
					pose: { rotate: -14, translate: { x: -8, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: RUN_DURATION,
					pose: { rotate: 14, translate: { x: 8, y: -6 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 3, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
				{
					at: RUN_DURATION / 2,
					pose: { rotate: -3, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: RUN_DURATION,
					pose: { rotate: 3, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -2, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
				{
					at: RUN_DURATION / 2,
					pose: { rotate: 2, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: RUN_DURATION,
					pose: { rotate: -2, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 1.5, translate: { x: 0, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: RUN_DURATION / 2,
					pose: { rotate: -1.5, translate: { x: 0, y: -4 } },
					ease: 'easeInOut',
				},
				{
					at: RUN_DURATION,
					pose: { rotate: 1.5, translate: { x: 0, y: 0 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -1.2, translate: { x: 0, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: RUN_DURATION / 2,
					pose: { rotate: 1.2, translate: { x: 0, y: -9 } },
					ease: 'easeInOut',
				},
				{
					at: RUN_DURATION,
					pose: { rotate: -1.2, translate: { x: 0, y: 0 } },
					ease: 'easeInOut',
				},
			],
		},
	],
};

const SPRINT_DURATION = 700;

const sprintSequence: AnimationSequence = {
	name: 'sprint',
	duration: SPRINT_DURATION,
	tracks: [
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 30, translate: { x: 12, y: -8 } },
					ease: 'easeInOut',
				},
				{
					at: SPRINT_DURATION / 2,
					pose: { rotate: -30, translate: { x: -12, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: SPRINT_DURATION,
					pose: { rotate: 30, translate: { x: 12, y: -8 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -30, translate: { x: -12, y: -8 } },
					ease: 'easeInOut',
				},
				{
					at: SPRINT_DURATION / 2,
					pose: { rotate: 30, translate: { x: 12, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: SPRINT_DURATION,
					pose: { rotate: -30, translate: { x: -12, y: -8 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'leftLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -20, translate: { x: -10, y: 5 } },
					ease: 'easeInOut',
				},
				{
					at: SPRINT_DURATION / 2,
					pose: { rotate: 20, translate: { x: 10, y: -8 } },
					ease: 'easeInOut',
				},
				{
					at: SPRINT_DURATION,
					pose: { rotate: -20, translate: { x: -10, y: 5 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'rightLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 20, translate: { x: 10, y: -8 } },
					ease: 'easeInOut',
				},
				{
					at: SPRINT_DURATION / 2,
					pose: { rotate: -20, translate: { x: -10, y: 5 } },
					ease: 'easeInOut',
				},
				{
					at: SPRINT_DURATION,
					pose: { rotate: 20, translate: { x: 10, y: -8 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 4, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
				{
					at: SPRINT_DURATION / 2,
					pose: { rotate: -4, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: SPRINT_DURATION,
					pose: { rotate: 4, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -2.5, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
				{
					at: SPRINT_DURATION / 2,
					pose: { rotate: 2.5, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: SPRINT_DURATION,
					pose: { rotate: -2.5, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 2.5, translate: { x: 0, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: SPRINT_DURATION / 2,
					pose: { rotate: -2.5, translate: { x: 0, y: -5 } },
					ease: 'easeInOut',
				},
				{
					at: SPRINT_DURATION,
					pose: { rotate: 2.5, translate: { x: 0, y: 0 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -2.5, translate: { x: 0, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: SPRINT_DURATION / 2,
					pose: { rotate: 2.5, translate: { x: 0, y: -12 } },
					ease: 'easeInOut',
				},
				{
					at: SPRINT_DURATION,
					pose: { rotate: -2.5, translate: { x: 0, y: 0 } },
					ease: 'easeInOut',
				},
			],
		},
	],
};

const CROUCH_DURATION = 1000;

const crouchSequence: AnimationSequence = {
	name: 'crouch',
	duration: CROUCH_DURATION,
	tracks: [
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -0.6, translate: { x: 0, y: 18 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_DURATION / 2,
					pose: { rotate: 0.6, translate: { x: 0, y: 20 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_DURATION,
					pose: { rotate: -0.6, translate: { x: 0, y: 18 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -2, translate: { x: 0, y: 3 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_DURATION / 2,
					pose: { rotate: 1.5, translate: { x: 0, y: 5 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_DURATION,
					pose: { rotate: -2, translate: { x: 0, y: 3 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'leftLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -18, translate: { x: -4, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_DURATION / 2,
					pose: { rotate: -20, translate: { x: -5, y: 8 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_DURATION,
					pose: { rotate: -18, translate: { x: -4, y: 6 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'rightLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -18, translate: { x: 4, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_DURATION / 2,
					pose: { rotate: -20, translate: { x: 5, y: 8 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_DURATION,
					pose: { rotate: -18, translate: { x: 4, y: 6 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -18, translate: { x: -4, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_DURATION / 2,
					pose: { rotate: -20, translate: { x: -5, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_DURATION,
					pose: { rotate: -18, translate: { x: -4, y: 4 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 18, translate: { x: 4, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_DURATION / 2,
					pose: { rotate: 20, translate: { x: 5, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_DURATION,
					pose: { rotate: 18, translate: { x: 4, y: 4 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 1.5, translate: { x: 0, y: 2 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_DURATION / 2,
					pose: { rotate: -1.5, translate: { x: 0, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_DURATION,
					pose: { rotate: 1.5, translate: { x: 0, y: 2 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -1, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_DURATION / 2,
					pose: { rotate: 1, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_DURATION,
					pose: { rotate: -1, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
			],
		},
	],
};

const CROUCH_WALK_DURATION = 1200;

const crouchWalkSequence: AnimationSequence = {
	name: 'crouchWalk',
	duration: CROUCH_WALK_DURATION,
	tracks: [
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -0.8, translate: { x: 0, y: 18 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_WALK_DURATION / 2,
					pose: { rotate: 0.8, translate: { x: 0, y: 16 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_WALK_DURATION,
					pose: { rotate: -0.8, translate: { x: 0, y: 18 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -1, translate: { x: 0, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_WALK_DURATION / 2,
					pose: { rotate: 1, translate: { x: 0, y: 3 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_WALK_DURATION,
					pose: { rotate: -1, translate: { x: 0, y: 4 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'leftLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -12, translate: { x: -6, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_WALK_DURATION / 2,
					pose: { rotate: -26, translate: { x: 6, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_WALK_DURATION,
					pose: { rotate: -12, translate: { x: -6, y: 6 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'rightLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -26, translate: { x: 6, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_WALK_DURATION / 2,
					pose: { rotate: -12, translate: { x: -6, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_WALK_DURATION,
					pose: { rotate: -26, translate: { x: 6, y: 4 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -16, translate: { x: -4, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_WALK_DURATION / 2,
					pose: { rotate: -22, translate: { x: -6, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_WALK_DURATION,
					pose: { rotate: -16, translate: { x: -4, y: 4 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 16, translate: { x: 4, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_WALK_DURATION / 2,
					pose: { rotate: 22, translate: { x: 6, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_WALK_DURATION,
					pose: { rotate: 16, translate: { x: 4, y: 4 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 2, translate: { x: 0, y: 2 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_WALK_DURATION / 2,
					pose: { rotate: -2, translate: { x: 0, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_WALK_DURATION,
					pose: { rotate: 2, translate: { x: 0, y: 2 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -1.2, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_WALK_DURATION / 2,
					pose: { rotate: 1.2, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: CROUCH_WALK_DURATION,
					pose: { rotate: -1.2, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
			],
		},
	],
};

const SLIDE_DURATION = 650;

const slideSequence: AnimationSequence = {
	name: 'slide',
	duration: SLIDE_DURATION,
	tracks: [
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: SLIDE_DURATION * 0.25,
					pose: { rotate: 10, translate: { x: 0, y: 26 } },
					ease: 'easeInOut',
				},
				{
					at: SLIDE_DURATION * 0.6,
					pose: { rotate: 6, translate: { x: 0, y: 30 } },
					ease: 'easeInOut',
				},
				{
					at: SLIDE_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 18 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: SLIDE_DURATION * 0.25,
					pose: { rotate: -10, translate: { x: 0, y: 8 } },
					ease: 'easeInOut',
				},
				{
					at: SLIDE_DURATION * 0.6,
					pose: { rotate: -6, translate: { x: 0, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: SLIDE_DURATION,
					pose: { rotate: -2, translate: { x: 0, y: 3 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: SLIDE_DURATION * 0.25,
					pose: { rotate: -26, translate: { x: 6, y: 10 } },
					ease: 'easeInOut',
				},
				{
					at: SLIDE_DURATION,
					pose: { rotate: -18, translate: { x: 4, y: 8 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: SLIDE_DURATION * 0.25,
					pose: { rotate: -18, translate: { x: 8, y: 8 } },
					ease: 'easeInOut',
				},
				{
					at: SLIDE_DURATION,
					pose: { rotate: -18, translate: { x: 6, y: 8 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -6, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: SLIDE_DURATION * 0.25,
					pose: { rotate: -32, translate: { x: -12, y: -4 } },
					ease: 'easeInOut',
				},
				{
					at: SLIDE_DURATION * 0.6,
					pose: { rotate: -24, translate: { x: -8, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: SLIDE_DURATION,
					pose: { rotate: -18, translate: { x: -6, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 6, translate: { x: 2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: SLIDE_DURATION * 0.25,
					pose: { rotate: 32, translate: { x: 12, y: -4 } },
					ease: 'easeInOut',
				},
				{
					at: SLIDE_DURATION * 0.6,
					pose: { rotate: 24, translate: { x: 8, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: SLIDE_DURATION,
					pose: { rotate: 18, translate: { x: 6, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: SLIDE_DURATION * 0.35,
					pose: { rotate: 10, translate: { x: 0, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: SLIDE_DURATION,
					pose: { rotate: 1.5, translate: { x: 0, y: 1 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: SLIDE_DURATION * 0.35,
					pose: { rotate: -4, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: SLIDE_DURATION,
					pose: { rotate: -1, translate: { x: 0, y: 1 } },
					ease: 'easeIn',
				},
			],
		},
	],
};

const OURAH_DURATION = 900;

const ourahSequence: AnimationSequence = {
	name: 'ourah',
	duration: OURAH_DURATION,
	tracks: [
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: OURAH_DURATION * 0.3,
					pose: { rotate: -4, translate: { x: 0, y: -6 } },
					ease: 'easeInOut',
				},
				{
					at: OURAH_DURATION * 0.6,
					pose: { rotate: 3, translate: { x: 0, y: -4 } },
					ease: 'easeInOut',
				},
				{
					at: OURAH_DURATION,
					pose: { rotate: -2, translate: { x: 0, y: -5 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: OURAH_DURATION * 0.3,
					pose: { rotate: -6, translate: { x: 0, y: -6 } },
					ease: 'easeInOut',
				},
				{
					at: OURAH_DURATION * 0.6,
					pose: { rotate: 4, translate: { x: 0, y: -3 } },
					ease: 'easeInOut',
				},
				{
					at: OURAH_DURATION,
					pose: { rotate: -4, translate: { x: 0, y: -4 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 4, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: OURAH_DURATION * 0.25,
					pose: { rotate: 30, translate: { x: -4, y: -10 } },
					ease: 'easeInOut',
				},
				{
					at: OURAH_DURATION * 0.55,
					pose: { rotate: 24, translate: { x: -2, y: -8 } },
					ease: 'easeInOut',
				},
				{
					at: OURAH_DURATION,
					pose: { rotate: 26, translate: { x: -3, y: -9 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -4, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: OURAH_DURATION * 0.25,
					pose: { rotate: -30, translate: { x: 4, y: -10 } },
					ease: 'easeInOut',
				},
				{
					at: OURAH_DURATION * 0.55,
					pose: { rotate: -24, translate: { x: 2, y: -8 } },
					ease: 'easeInOut',
				},
				{
					at: OURAH_DURATION,
					pose: { rotate: -26, translate: { x: 3, y: -9 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: OURAH_DURATION * 0.5,
					pose: { rotate: 6, translate: { x: 0, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: OURAH_DURATION,
					pose: { rotate: 2, translate: { x: 0, y: -1 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: OURAH_DURATION * 0.5,
					pose: { rotate: -3, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: OURAH_DURATION,
					pose: { rotate: -1, translate: { x: 0, y: -1 } },
					ease: 'easeIn',
				},
			],
		},
	],
};

const SHOWING_DURATION = 950;

const showingSequence: AnimationSequence = {
	name: 'showing',
	duration: SHOWING_DURATION,
	tracks: [
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: SHOWING_DURATION * 0.3,
					pose: { rotate: 4, translate: { x: 0, y: -4 } },
					ease: 'easeInOut',
				},
				{
					at: SHOWING_DURATION * 0.65,
					pose: { rotate: 2, translate: { x: 0, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: SHOWING_DURATION,
					pose: { rotate: 3, translate: { x: 0, y: -3 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: SHOWING_DURATION * 0.3,
					pose: { rotate: 6, translate: { x: 0, y: -4 } },
					ease: 'easeInOut',
				},
				{
					at: SHOWING_DURATION * 0.65,
					pose: { rotate: 3, translate: { x: 0, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: SHOWING_DURATION,
					pose: { rotate: 4, translate: { x: 0, y: -3 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 6, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: SHOWING_DURATION * 0.3,
					pose: { rotate: -48, translate: { x: 6, y: -14 } },
					ease: 'easeInOut',
				},
				{
					at: SHOWING_DURATION * 0.6,
					pose: { rotate: -38, translate: { x: 3, y: -10 } },
					ease: 'easeInOut',
				},
				{
					at: SHOWING_DURATION,
					pose: { rotate: 44, translate: { x: 4, y: -12 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -6, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: SHOWING_DURATION * 0.3,
					pose: { rotate: -12, translate: { x: -4, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: SHOWING_DURATION * 0.6,
					pose: { rotate: -8, translate: { x: -3, y: 1 } },
					ease: 'easeInOut',
				},
				{
					at: SHOWING_DURATION,
					pose: { rotate: -10, translate: { x: -3, y: 1 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: SHOWING_DURATION * 0.5,
					pose: { rotate: 5, translate: { x: 0, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: SHOWING_DURATION,
					pose: { rotate: 2, translate: { x: 0, y: -1 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: SHOWING_DURATION * 0.5,
					pose: { rotate: -2.5, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: SHOWING_DURATION,
					pose: { rotate: -1, translate: { x: 0, y: -1 } },
					ease: 'easeIn',
				},
			],
		},
	],
};

const VICTORY_DURATION = 900;

const victorySequence: AnimationSequence = {
	name: 'victory',
	duration: VICTORY_DURATION,
	tracks: [
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: VICTORY_DURATION * 0.3,
					pose: { rotate: -4, translate: { x: 0, y: -8 } },
					ease: 'easeInOut',
				},
				{
					at: VICTORY_DURATION * 0.6,
					pose: { rotate: 3, translate: { x: 0, y: -6 } },
					ease: 'easeInOut',
				},
				{
					at: VICTORY_DURATION,
					pose: { rotate: -2, translate: { x: 0, y: -7 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: VICTORY_DURATION * 0.3,
					pose: { rotate: -8, translate: { x: 0, y: -8 } },
					ease: 'easeInOut',
				},
				{
					at: VICTORY_DURATION * 0.6,
					pose: { rotate: 5, translate: { x: 0, y: -5 } },
					ease: 'easeInOut',
				},
				{
					at: VICTORY_DURATION,
					pose: { rotate: -5, translate: { x: 0, y: -6 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -8, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: VICTORY_DURATION * 0.25,
					pose: { rotate: -64, translate: { x: -8, y: -20 } },
					ease: 'easeInOut',
				},
				{
					at: VICTORY_DURATION * 0.55,
					pose: { rotate: -54, translate: { x: -4, y: -16 } },
					ease: 'easeInOut',
				},
				{
					at: VICTORY_DURATION,
					pose: { rotate: -58, translate: { x: -6, y: -18 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 8, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: VICTORY_DURATION * 0.25,
					pose: { rotate: 64, translate: { x: 8, y: -20 } },
					ease: 'easeInOut',
				},
				{
					at: VICTORY_DURATION * 0.55,
					pose: { rotate: 54, translate: { x: 4, y: -16 } },
					ease: 'easeInOut',
				},
				{
					at: VICTORY_DURATION,
					pose: { rotate: 58, translate: { x: 6, y: -18 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: VICTORY_DURATION * 0.5,
					pose: { rotate: 6, translate: { x: -4, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: VICTORY_DURATION,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: VICTORY_DURATION * 0.5,
					pose: { rotate: -6, translate: { x: 4, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: VICTORY_DURATION,
					pose: { rotate: 0, translate: { x: 2, y: 2 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: VICTORY_DURATION * 0.5,
					pose: { rotate: 6, translate: { x: 0, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: VICTORY_DURATION,
					pose: { rotate: 2, translate: { x: 0, y: -1 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: VICTORY_DURATION * 0.5,
					pose: { rotate: -3, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: VICTORY_DURATION,
					pose: { rotate: -1, translate: { x: 0, y: -1 } },
					ease: 'easeIn',
				},
			],
		},
	],
};

const FLOSS_DURATION = 1200;

const flossSequence: AnimationSequence = {
	name: 'floss',
	duration: FLOSS_DURATION,
	tracks: [
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 2, translate: { x: -4, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.25,
					pose: { rotate: -6, translate: { x: 8, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.5,
					pose: { rotate: 6, translate: { x: -8, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.75,
					pose: { rotate: -6, translate: { x: 8, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION,
					pose: { rotate: 2, translate: { x: -4, y: 0 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -2, translate: { x: -2, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.25,
					pose: { rotate: 4, translate: { x: 3, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.5,
					pose: { rotate: -4, translate: { x: -3, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.75,
					pose: { rotate: 4, translate: { x: 3, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION,
					pose: { rotate: -2, translate: { x: -2, y: -1 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -20, translate: { x: 10, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.25,
					pose: { rotate: -70, translate: { x: -12, y: -6 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.5,
					pose: { rotate: 26, translate: { x: -10, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.75,
					pose: { rotate: -70, translate: { x: 12, y: -6 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION,
					pose: { rotate: -20, translate: { x: 10, y: 0 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 20, translate: { x: -10, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.25,
					pose: { rotate: 70, translate: { x: 12, y: -6 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.5,
					pose: { rotate: -26, translate: { x: 10, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.75,
					pose: { rotate: 70, translate: { x: -12, y: -6 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION,
					pose: { rotate: 20, translate: { x: -10, y: 0 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'leftLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -4, translate: { x: -2, y: 2 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.25,
					pose: { rotate: 6, translate: { x: -4, y: 2 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.5,
					pose: { rotate: -6, translate: { x: -2, y: 2 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.75,
					pose: { rotate: 6, translate: { x: -4, y: 2 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION,
					pose: { rotate: -4, translate: { x: -2, y: 2 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'rightLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 4, translate: { x: 2, y: 2 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.25,
					pose: { rotate: -6, translate: { x: 4, y: 2 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.5,
					pose: { rotate: 6, translate: { x: 2, y: 2 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.75,
					pose: { rotate: -6, translate: { x: 4, y: 2 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION,
					pose: { rotate: 4, translate: { x: 2, y: 2 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.25,
					pose: { rotate: 6, translate: { x: 0, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.5,
					pose: { rotate: -6, translate: { x: 0, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.75,
					pose: { rotate: 6, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.25,
					pose: { rotate: -3, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.5,
					pose: { rotate: 3, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION * 0.75,
					pose: { rotate: -3, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: FLOSS_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
			],
		},
	],
};

const PUNCH_DURATION = 420;

const punchSequence: AnimationSequence = {
	name: 'punch',
	duration: PUNCH_DURATION,
	tracks: [
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: PUNCH_DURATION * 0.25,
					pose: { rotate: -3, translate: { x: 0, y: 1 } },
					ease: 'easeInOut',
				},
				{
					at: PUNCH_DURATION * 0.5,
					pose: { rotate: 6, translate: { x: 0, y: -4 } },
					ease: 'easeInOut',
				},
				{
					at: PUNCH_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: PUNCH_DURATION * 0.25,
					pose: { rotate: -3, translate: { x: -2, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: PUNCH_DURATION * 0.5,
					pose: { rotate: 4, translate: { x: 2, y: -4 } },
					ease: 'easeInOut',
				},
				{
					at: PUNCH_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -12, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: PUNCH_DURATION * 0.25,
					pose: { rotate: 18, translate: { x: -10, y: -10 } },
					ease: 'easeInOut',
				},
				{
					at: PUNCH_DURATION * 0.5,
					pose: { rotate: -62, translate: { x: 14, y: 8 } },
					ease: 'easeInOut',
				},
				{
					at: PUNCH_DURATION,
					pose: { rotate: -12, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -6, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: PUNCH_DURATION * 0.25,
					pose: { rotate: 12, translate: { x: 4, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: PUNCH_DURATION * 0.5,
					pose: { rotate: -20, translate: { x: -6, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: PUNCH_DURATION,
					pose: { rotate: -6, translate: { x: -2, y: 2 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: PUNCH_DURATION * 0.5,
					pose: { rotate: -6, translate: { x: -4, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: PUNCH_DURATION,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: PUNCH_DURATION * 0.5,
					pose: { rotate: 6, translate: { x: 4, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: PUNCH_DURATION,
					pose: { rotate: 0, translate: { x: 2, y: 2 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: PUNCH_DURATION * 0.5,
					pose: { rotate: 7, translate: { x: 0, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: PUNCH_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: PUNCH_DURATION * 0.5,
					pose: { rotate: -3.5, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: PUNCH_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeIn',
				},
			],
		},
	],
};

const KICK_DURATION = 560;

const kickSequence: AnimationSequence = {
	name: 'kick',
	duration: KICK_DURATION,
	tracks: [
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: KICK_DURATION * 0.22,
					pose: { rotate: -10, translate: { x: 0, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: KICK_DURATION * 0.5,
					pose: { rotate: 14, translate: { x: 0, y: -10 } },
					ease: 'easeInOut',
				},
				{
					at: KICK_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: KICK_DURATION * 0.22,
					pose: { rotate: -5, translate: { x: -2, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: KICK_DURATION * 0.5,
					pose: { rotate: 7, translate: { x: 2, y: -4 } },
					ease: 'easeInOut',
				},
				{
					at: KICK_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: KICK_DURATION * 0.22,
					pose: { rotate: 10, translate: { x: 4, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: KICK_DURATION * 0.5,
					pose: { rotate: -58, translate: { x: 10, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: KICK_DURATION * 0.75,
					pose: { rotate: -12, translate: { x: 2, y: 2 } },
					ease: 'easeInOut',
				},
				{
					at: KICK_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: KICK_DURATION * 0.5,
					pose: { rotate: -10, translate: { x: -6, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: KICK_DURATION,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: KICK_DURATION * 0.22,
					pose: { rotate: -24, translate: { x: -8, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: KICK_DURATION * 0.5,
					pose: { rotate: -14, translate: { x: -6, y: 2 } },
					ease: 'easeInOut',
				},
				{
					at: KICK_DURATION,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: KICK_DURATION * 0.22,
					pose: { rotate: 24, translate: { x: 8, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: KICK_DURATION * 0.5,
					pose: { rotate: 14, translate: { x: 6, y: 2 } },
					ease: 'easeInOut',
				},
				{
					at: KICK_DURATION,
					pose: { rotate: 0, translate: { x: 2, y: 2 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: KICK_DURATION * 0.5,
					pose: { rotate: 10, translate: { x: 0, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: KICK_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: KICK_DURATION * 0.5,
					pose: { rotate: -5, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: KICK_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeIn',
				},
			],
		},
	],
};

const MELEE_DURATION = 520;

const meleeSequence: AnimationSequence = {
	name: 'melee',
	duration: MELEE_DURATION,
	tracks: [
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: MELEE_DURATION * 0.22,
					pose: { rotate: -14, translate: { x: 0, y: 2 } },
					ease: 'easeInOut',
				},
				{
					at: MELEE_DURATION * 0.5,
					pose: { rotate: 18, translate: { x: 0, y: -6 } },
					ease: 'easeInOut',
				},
				{
					at: MELEE_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: MELEE_DURATION * 0.22,
					pose: { rotate: -6, translate: { x: -2, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: MELEE_DURATION * 0.5,
					pose: { rotate: 8, translate: { x: 2, y: -4 } },
					ease: 'easeInOut',
				},
				{
					at: MELEE_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: MELEE_DURATION * 0.22,
					pose: { rotate: -26, translate: { x: 10, y: -8 } },
					ease: 'easeInOut',
				},
				{
					at: MELEE_DURATION * 0.5,
					pose: { rotate: 75, translate: { x: -12, y: 10 } },
					ease: 'easeInOut',
				},
				{
					at: MELEE_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: MELEE_DURATION * 0.22,
					pose: { rotate: 14, translate: { x: 4, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: MELEE_DURATION * 0.5,
					pose: { rotate: -18, translate: { x: -6, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: MELEE_DURATION,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: MELEE_DURATION * 0.5,
					pose: { rotate: 6, translate: { x: 0, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: MELEE_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: MELEE_DURATION * 0.5,
					pose: { rotate: -3, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: MELEE_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeIn',
				},
			],
		},
	],
};

const HIT_DURATION = 320;

const hitSequence: AnimationSequence = {
	name: 'hit',
	duration: HIT_DURATION,
	tracks: [
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: HIT_DURATION * 0.35,
					pose: { rotate: -10, translate: { x: -10, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: HIT_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: HIT_DURATION * 0.35,
					pose: { rotate: 7, translate: { x: 4, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: HIT_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: HIT_DURATION * 0.35,
					pose: { rotate: 24, translate: { x: 6, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: HIT_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: HIT_DURATION * 0.35,
					pose: { rotate: -24, translate: { x: -6, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: HIT_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: HIT_DURATION * 0.35,
					pose: { rotate: -8, translate: { x: 0, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: HIT_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeIn',
				},
			],
		},
	],
};

const KNOCKDOWN_DURATION = 980;

const knockdownSequence: AnimationSequence = {
	name: 'knockdown',
	duration: KNOCKDOWN_DURATION,
	tracks: [
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: KNOCKDOWN_DURATION * 0.25,
					pose: { rotate: 8, translate: { x: 0, y: 14 } },
					ease: 'easeInOut',
				},
				{
					at: KNOCKDOWN_DURATION * 0.6,
					pose: { rotate: 22, translate: { x: 0, y: 42 } },
					ease: 'easeInOut',
				},
				{
					at: KNOCKDOWN_DURATION,
					pose: { rotate: 16, translate: { x: 0, y: 46 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: KNOCKDOWN_DURATION * 0.25,
					pose: { rotate: 4, translate: { x: 0, y: 5 } },
					ease: 'easeInOut',
				},
				{
					at: KNOCKDOWN_DURATION * 0.6,
					pose: { rotate: 8, translate: { x: 0, y: 10 } },
					ease: 'easeInOut',
				},
				{
					at: KNOCKDOWN_DURATION,
					pose: { rotate: 6, translate: { x: 0, y: 9 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: KNOCKDOWN_DURATION * 0.35,
					pose: { rotate: -30, translate: { x: -6, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: KNOCKDOWN_DURATION,
					pose: { rotate: -64, translate: { x: -10, y: 12 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: KNOCKDOWN_DURATION * 0.35,
					pose: { rotate: -30, translate: { x: 6, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: KNOCKDOWN_DURATION,
					pose: { rotate: -64, translate: { x: 10, y: 12 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: KNOCKDOWN_DURATION * 0.35,
					pose: { rotate: 36, translate: { x: 8, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: KNOCKDOWN_DURATION,
					pose: { rotate: 52, translate: { x: 10, y: -4 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: KNOCKDOWN_DURATION * 0.35,
					pose: { rotate: -36, translate: { x: -8, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: KNOCKDOWN_DURATION,
					pose: { rotate: -52, translate: { x: -10, y: -4 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: KNOCKDOWN_DURATION * 0.6,
					pose: { rotate: 8, translate: { x: 0, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: KNOCKDOWN_DURATION,
					pose: { rotate: 4, translate: { x: 0, y: 1 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: KNOCKDOWN_DURATION * 0.6,
					pose: { rotate: -4, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: KNOCKDOWN_DURATION,
					pose: { rotate: -2, translate: { x: 0, y: 1 } },
					ease: 'easeIn',
				},
			],
		},
	],
};

const REVIVE_DURATION = 1200;

const reviveSequence: AnimationSequence = {
	name: 'revive',
	duration: REVIVE_DURATION,
	tracks: [
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 16, translate: { x: 0, y: 46 } },
					ease: 'easeOut',
				},
				{
					at: REVIVE_DURATION * 0.45,
					pose: { rotate: 0, translate: { x: 0, y: 18 } },
					ease: 'easeInOut',
				},
				{
					at: REVIVE_DURATION * 0.8,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeInOut',
				},
				{
					at: REVIVE_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 6, translate: { x: 0, y: 9 } },
					ease: 'easeOut',
				},
				{
					at: REVIVE_DURATION * 0.45,
					pose: { rotate: -2, translate: { x: 0, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: REVIVE_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -50, translate: { x: -10, y: 12 } },
					ease: 'easeOut',
				},
				{
					at: REVIVE_DURATION * 0.45,
					pose: { rotate: -18, translate: { x: -6, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: REVIVE_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -50, translate: { x: 10, y: 12 } },
					ease: 'easeOut',
				},
				{
					at: REVIVE_DURATION * 0.45,
					pose: { rotate: -18, translate: { x: 6, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: REVIVE_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 52, translate: { x: 10, y: -4 } },
					ease: 'easeOut',
				},
				{
					at: REVIVE_DURATION * 0.45,
					pose: { rotate: -18, translate: { x: -4, y: 2 } },
					ease: 'easeInOut',
				},
				{
					at: REVIVE_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -52, translate: { x: -10, y: -4 } },
					ease: 'easeOut',
				},
				{
					at: REVIVE_DURATION * 0.45,
					pose: { rotate: 18, translate: { x: 4, y: 2 } },
					ease: 'easeInOut',
				},
				{
					at: REVIVE_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 4, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: REVIVE_DURATION * 0.45,
					pose: { rotate: 1.5, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: REVIVE_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: -2, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: REVIVE_DURATION * 0.45,
					pose: { rotate: -1, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: REVIVE_DURATION,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeIn',
				},
			],
		},
	],
};

const DEATH_DURATION = 1150;

const deathSequence: AnimationSequence = {
	name: 'death',
	duration: DEATH_DURATION,
	tracks: [
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.18,
					pose: { rotate: 8, translate: { x: 2, y: 14 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.55,
					pose: { rotate: 48, translate: { x: 16, y: 30 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.82,
					pose: { rotate: 68, translate: { x: 20, y: 32 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: 64, translate: { x: 18, y: 30 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.18,
					pose: { rotate: -3, translate: { x: 0, y: 3 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.55,
					pose: { rotate: 4, translate: { x: 0, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.82,
					pose: { rotate: 7, translate: { x: 0, y: 8 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: 6, translate: { x: 0, y: 7 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.45,
					pose: { rotate: -18, translate: { x: -5, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.75,
					pose: { rotate: -42, translate: { x: -10, y: 10 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: -38, translate: { x: -9, y: 10 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.45,
					pose: { rotate: -18, translate: { x: 5, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.75,
					pose: { rotate: -42, translate: { x: 10, y: 10 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: -38, translate: { x: 9, y: 10 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.35,
					pose: { rotate: 24, translate: { x: 6, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.65,
					pose: { rotate: 58, translate: { x: 12, y: -6 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: 50, translate: { x: 10, y: -4 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.35,
					pose: { rotate: -24, translate: { x: -6, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.65,
					pose: { rotate: -58, translate: { x: -12, y: -6 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: -50, translate: { x: -10, y: -4 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.6,
					pose: { rotate: 8, translate: { x: 0, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: 6, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.6,
					pose: { rotate: -4, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: -3, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
	],
};

const death2Sequence: AnimationSequence = {
	name: 'death2',
	duration: DEATH_DURATION,
	tracks: [
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.2,
					pose: { rotate: -8, translate: { x: -2, y: 14 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.55,
					pose: { rotate: -48, translate: { x: -16, y: 30 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.8,
					pose: { rotate: -68, translate: { x: -20, y: 34 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: -64, translate: { x: -18, y: 32 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.2,
					pose: { rotate: 3, translate: { x: 0, y: 3 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.55,
					pose: { rotate: -4, translate: { x: 0, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.8,
					pose: { rotate: -7, translate: { x: 0, y: 8 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: -6, translate: { x: 0, y: 7 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.4,
					pose: { rotate: -16, translate: { x: -5, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.75,
					pose: { rotate: -36, translate: { x: -9, y: 10 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: -32, translate: { x: -8, y: 10 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.4,
					pose: { rotate: -16, translate: { x: 5, y: 6 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.75,
					pose: { rotate: -36, translate: { x: 9, y: 10 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: -32, translate: { x: 8, y: 10 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.35,
					pose: { rotate: 20, translate: { x: 4, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.65,
					pose: { rotate: 48, translate: { x: 10, y: -6 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: 40, translate: { x: 8, y: -4 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.35,
					pose: { rotate: -20, translate: { x: -4, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.65,
					pose: { rotate: -48, translate: { x: -10, y: -6 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: -40, translate: { x: -8, y: -4 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.6,
					pose: { rotate: -8, translate: { x: 0, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: -6, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.6,
					pose: { rotate: 4, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: 3, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
	],
};

const death3Sequence: AnimationSequence = {
	name: 'death3',
	duration: DEATH_DURATION,
	tracks: [
		{
			part: 'body',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.15,
					pose: { rotate: 12, translate: { x: 4, y: 12 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.45,
					pose: { rotate: 64, translate: { x: 18, y: 24 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.75,
					pose: { rotate: 84, translate: { x: 24, y: 28 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: 82, translate: { x: 22, y: 26 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'head',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 0 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.15,
					pose: { rotate: -4, translate: { x: 0, y: 4 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.45,
					pose: { rotate: 10, translate: { x: 0, y: 8 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.75,
					pose: { rotate: 14, translate: { x: 0, y: 10 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: 12, translate: { x: 0, y: 9 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.45,
					pose: { rotate: -28, translate: { x: -8, y: 8 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.75,
					pose: { rotate: -58, translate: { x: -12, y: 12 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: -54, translate: { x: -11, y: 12 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightLeg',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.45,
					pose: { rotate: -28, translate: { x: 8, y: 8 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.75,
					pose: { rotate: -58, translate: { x: 12, y: 12 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: -54, translate: { x: 11, y: 12 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'leftArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: -2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.35,
					pose: { rotate: 36, translate: { x: 8, y: -4 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.6,
					pose: { rotate: 72, translate: { x: 14, y: -8 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: 64, translate: { x: 12, y: -6 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'rightArm',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 2, y: 2 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.35,
					pose: { rotate: -36, translate: { x: -8, y: -4 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION * 0.6,
					pose: { rotate: -72, translate: { x: -14, y: -8 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: -64, translate: { x: -12, y: -6 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'tail',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.5,
					pose: { rotate: 10, translate: { x: 0, y: -2 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: 8, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
		{
			part: 'fin',
			keyframes: [
				{
					at: 0,
					pose: { rotate: 0, translate: { x: 0, y: 1 } },
					ease: 'easeOut',
				},
				{
					at: DEATH_DURATION * 0.5,
					pose: { rotate: -5, translate: { x: 0, y: -1 } },
					ease: 'easeInOut',
				},
				{
					at: DEATH_DURATION,
					pose: { rotate: -4, translate: { x: 0, y: 0 } },
					ease: 'easeIn',
				},
			],
		},
	],
};

export const BATTLE_ROYALE_PRESETS: Record<string, AnimationSequence> = {
	run: runSequence,
	sprint: sprintSequence,
	crouch: crouchSequence,
	crouchWalk: crouchWalkSequence,
	slide: slideSequence,
	ourah: ourahSequence,
	showing: showingSequence,
	victory: victorySequence,
	floss: flossSequence,
	punch: punchSequence,
	kick: kickSequence,
	melee: meleeSequence,
	hit: hitSequence,
	knockdown: knockdownSequence,
	revive: reviveSequence,
	death: deathSequence,
	death2: death2Sequence,
	death3: death3Sequence,
};
