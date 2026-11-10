import type { AnimationConfig } from '@suigar/suifrens-display-system/animation';

export type PresetCatalogEntry = {
	label: string;
	name: string;
	config: AnimationConfig;
};

export type PresetCatalogGroup = {
	title: string;
	presets: Array<PresetCatalogEntry>;
};

const LOOP = { iterations: 'infinite' as const };

export const PRESET_CATALOG: Array<PresetCatalogGroup> = [
	{
		title: 'Base',
		presets: [
			{ label: 'Idle', name: 'idle', config: { preset: 'idle', playback: LOOP } },
			{
				label: 'Walk',
				name: 'walk',
				config: { preset: 'walk', playback: { ...LOOP, alternate: true } },
			},
			{
				label: 'Goalkeeper Crab',
				name: 'goalkeeperCrab',
				config: { preset: 'goalkeeperCrab', playback: LOOP },
			},
			{ label: 'Run', name: 'run', config: { preset: 'run', playback: LOOP } },
			{ label: 'Sprint', name: 'sprint', config: { preset: 'sprint', playback: LOOP } },
			{
				label: 'Jump',
				name: 'jump',
				config: { preset: 'jump', playback: { ...LOOP, alternate: true } },
			},
			{
				label: 'Walk → Jump → Sit',
				name: 'walkJumpSit',
				config: {
					preset: 'walkJumpSit',
					playback: { iterations: 1 as const },
					holdOnComplete: true,
				},
			},
		],
	},
	{
		title: 'Casino',
		presets: [
			{
				label: 'Celebrate',
				name: 'celebrate',
				config: { preset: 'celebrate', playback: { ...LOOP, alternate: true } },
			},
			{ label: 'Jackpot', name: 'jackpot', config: { preset: 'jackpot', playback: LOOP } },
			{ label: 'Slot Pull', name: 'slotPull', config: { preset: 'slotPull', playback: LOOP } },
			{ label: 'Suspense', name: 'suspense', config: { preset: 'suspense', playback: LOOP } },
			{
				label: 'Talk Mic',
				name: 'talkMicrophone',
				config: { preset: 'talkMicrophone', playback: LOOP },
			},
		],
	},
	{
		title: 'Battle Royale · Locomotion',
		presets: [
			{ label: 'Crouch', name: 'crouch', config: { preset: 'crouch', playback: LOOP } },
			{
				label: 'Crouch Walk',
				name: 'crouchWalk',
				config: { preset: 'crouchWalk', playback: LOOP },
			},
			{
				label: 'Slide',
				name: 'slide',
				config: { preset: 'slide', playback: { ...LOOP, alternate: true } },
			},
		],
	},
	{
		title: 'Gestures',
		presets: [
			{
				label: 'Ourah',
				name: 'ourah',
				config: { preset: 'ourah', playback: { ...LOOP, alternate: true } },
			},
			{
				label: 'Showing',
				name: 'showing',
				config: { preset: 'showing', playback: { ...LOOP, alternate: true } },
			},
		],
	},
	{
		title: 'Battle Royale · Combat',
		presets: [
			{ label: 'Punch', name: 'punch', config: { preset: 'punch', playback: LOOP } },
			{ label: 'Kick', name: 'kick', config: { preset: 'kick', playback: LOOP } },
			{ label: 'Melee', name: 'melee', config: { preset: 'melee', playback: LOOP } },
		],
	},
	{
		title: 'Battle Royale · Damage',
		presets: [
			{ label: 'Hit Reaction', name: 'hit', config: { preset: 'hit', playback: LOOP } },
			{
				label: 'Knockdown / Get Up',
				name: 'knockdown',
				config: { preset: 'knockdown', playback: { ...LOOP, alternate: true } },
			},
			{
				label: 'Revive',
				name: 'revive',
				config: { preset: 'revive', playback: { ...LOOP, alternate: true } },
			},
			{
				label: 'Death (Alt 1)',
				name: 'death',
				config: { preset: 'death', playback: { iterations: 1 }, holdOnComplete: true },
			},
			{
				label: 'Death (Alt 2)',
				name: 'death2',
				config: { preset: 'death2', playback: { iterations: 1 }, holdOnComplete: true },
			},
			{
				label: 'Death (Alt 3)',
				name: 'death3',
				config: { preset: 'death3', playback: { iterations: 1 }, holdOnComplete: true },
			},
			{
				label: 'Victory',
				name: 'victory',
				config: { preset: 'victory', playback: { ...LOOP, alternate: true } },
			},
			{ label: 'Floss (Victory Alt)', name: 'floss', config: { preset: 'floss', playback: LOOP } },
		],
	},
];
