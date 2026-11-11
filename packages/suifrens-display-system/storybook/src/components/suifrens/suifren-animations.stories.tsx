// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { ACCESSORIES } from '@suigar/suifrens-display-system/accessories';
import { PRESET_CATALOG, type PresetCatalogEntry } from '../../animation/preset-catalog.js';
import { CatalogueDocs } from '../CatalogueDocs.js';
import { CataloguePreview } from './CataloguePreview.js';

const microphoneAccessory = ACCESSORIES.find((accessory) => accessory.name === 'microphone');

function getPreviewAccessories(presetName: string) {
	return presetName === 'talkMicrophone' && microphoneAccessory ? [microphoneAccessory] : [];
}

function PresetPreview({ preset }: { preset: PresetCatalogEntry }) {
	return (
		<CataloguePreview
			title={preset.label}
			subtitle={preset.name}
			animation={preset.config}
			accessories={getPreviewAccessories(preset.name)}
		/>
	);
}

const meta = {
	title: 'Suifrens/Animations/Presets',
	parameters: { controls: { disable: true }, docs: { page: CatalogueDocs } },
	tags: ['1.0.2'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Presets: Story = {
	render: () => (
		<div className="flex flex-col gap-10">
			{PRESET_CATALOG.map((group) => (
				<section key={group.title}>
					<h2 className="story-heading mb-4">{group.title}</h2>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{group.presets.map((preset) => (
							<PresetPreview key={preset.name} preset={preset} />
						))}
					</div>
				</section>
			))}
		</div>
	),
};

function presetStory(name: string): Story {
	const preset = PRESET_CATALOG.flatMap((group) => group.presets).find(
		(entry) => entry.name === name,
	);
	if (!preset) {
		throw new Error(`Unknown animation preset: ${name}`);
	}
	return { render: () => <PresetPreview preset={preset} /> };
}
export const Idle: Story = { ...presetStory('idle'), tags: ['!1.0.2', '1.0.1'] };
export const Walk: Story = { ...presetStory('walk'), tags: ['!1.0.2', '1.0.1'] };
export const GoalkeeperCrab: Story = {
	...presetStory('goalkeeperCrab'),
	tags: ['!1.0.2', '1.0.3'],
};
export const Sit: Story = { ...presetStory('sit'), tags: ['!1.0.2', '1.0.1'] };
export const Stand: Story = { ...presetStory('stand'), tags: ['!1.0.2', '1.0.1'] };
export const Run: Story = presetStory('run');
export const Sprint: Story = presetStory('sprint');
export const Jump: Story = { ...presetStory('jump'), tags: ['!1.0.2', '1.0.1'] };
export const WalkJumpSit: Story = {
	...presetStory('walkJumpSit'),
	tags: ['!1.0.2', '1.0.1'],
};
export const Celebrate: Story = {
	...presetStory('celebrate'),
	tags: ['!1.0.2', '1.0.1'],
};
export const Jackpot: Story = { ...presetStory('jackpot'), tags: ['!1.0.2', '1.0.1'] };
export const SlotPull: Story = {
	...presetStory('slotPull'),
	tags: ['!1.0.2', '1.0.1'],
};
export const Suspense: Story = {
	...presetStory('suspense'),
	tags: ['!1.0.2', '1.0.1'],
};
export const TalkMicrophone: Story = {
	tags: ['!1.0.2', '1.0.3'],
	...presetStory('talkMicrophone'),
	name: 'Talk Mic · talkMicrophone',
};
export const Crouch: Story = presetStory('crouch');
export const CrouchWalk: Story = presetStory('crouchWalk');
export const Slide: Story = presetStory('slide');
export const Ourah: Story = presetStory('ourah');
export const Showing: Story = presetStory('showing');
export const Punch: Story = presetStory('punch');
export const Kick: Story = presetStory('kick');
export const Melee: Story = presetStory('melee');
export const Hit: Story = { ...presetStory('hit'), name: 'Hit Reaction · hit' };
export const Knockdown: Story = {
	...presetStory('knockdown'),
	name: 'Knockdown / Get Up · knockdown',
};
export const Revive: Story = presetStory('revive');
export const Death: Story = { ...presetStory('death'), name: 'Death (Alt 1) · death' };
export const Death2: Story = { ...presetStory('death2'), name: 'Death (Alt 2) · death2' };
export const Death3: Story = { ...presetStory('death3'), name: 'Death (Alt 3) · death3' };
export const Victory: Story = presetStory('victory');
export const Floss: Story = { ...presetStory('floss'), name: 'Floss (Victory Alt) · floss' };
