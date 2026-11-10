// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { accessories } from '@suigar/suifrens-display-system/accessories';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import { accessoryLabel } from '../../utils/accessory-label.js';
import { CatalogueDocs } from '../CatalogueDocs.js';
import { CataloguePreview } from './CataloguePreview.js';

const meta = {
	title: 'Suifrens/Accessories/Catalogue',
	component: SuiFrenImageInline,
	parameters: { docs: { page: CatalogueDocs } },
	tags: ['1.0.0'],
} satisfies Meta<typeof SuiFrenImageInline>;

export default meta;

type Story = StoryObj<typeof SuiFrenImageInline>;

export const AllAccessories: Story = {
	tags: ['!1.0.0', '1.0.2'],
	render: () => (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
			{accessories.map((accessory) => (
				<CataloguePreview
					key={accessory.name}
					title={accessoryLabel(accessory)}
					subtitle={accessory.type}
					accessories={[accessory]}
				/>
			))}
		</div>
	),
};

function accessoryStory(name: string): Story {
	const accessory = accessories.find((entry) => entry.name === name);
	if (!accessory) {
		throw new Error(`Unknown accessory: ${name}`);
	}
	return {
		render: () => (
			<CataloguePreview
				title={accessoryLabel(accessory)}
				subtitle={accessory.type}
				accessories={[accessory]}
			/>
		),
	};
}
export const RunnerSinglet: Story = {
	...accessoryStory('runner singlet'),
	tags: ['!1.0.0', '1.1.0'],
};
export const RunnerShorts: Story = {
	...accessoryStory('runner shorts'),
	tags: ['!1.0.0', '1.1.0'],
};
export const RunnerHeadband: Story = {
	...accessoryStory('runner headband'),
	tags: ['!1.0.0', '1.1.0'],
};
export const RunnerShoes: Story = {
	...accessoryStory('runner shoes'),
	tags: ['!1.0.0', '1.1.0'],
};
export const BaseballCap: Story = accessoryStory('baseball cap');
export const Beanie: Story = accessoryStory('beanie');
export const Beret: Story = accessoryStory('beret');
export const BowlerHat: Story = accessoryStory('bowler hat');
export const CowboyHat: Story = accessoryStory('cowboy hat');
export const HairBow: Story = accessoryStory('hair bow');
export const Halo: Story = accessoryStory('halo');
export const SantaHat: Story = accessoryStory('santa hat');
export const BlondeWig: Story = accessoryStory('blonde wig');
export const CurlyWig: Story = accessoryStory('curly wig');
export const Mohawk: Story = accessoryStory('mohawk');
export const WizardHat: Story = accessoryStory('wizard hat');
export const Snorkel: Story = accessoryStory('snorkel');
export const EightBitGlasses: Story = { ...accessoryStory('8 bit glasses'), name: '8 bit glasses' };
export const SuperheroMask: Story = accessoryStory('superhero mask');
export const XrGoggles: Story = accessoryStory('xr goggles');
export const BugEyes: Story = accessoryStory('bug eyes');
export const Apron: Story = accessoryStory('apron');
export const Cardigan: Story = accessoryStory('cardigan');
export const LeatherJacket: Story = accessoryStory('leather jacket');
export const Vest: Story = accessoryStory('vest');
export const SuperheroCape: Story = accessoryStory('superhero cape');
export const WizardRobe: Story = accessoryStory('wizard robe');
export const Wings: Story = accessoryStory('wings');
export const WhitePants: Story = accessoryStory('white pants');
export const BellBottoms: Story = accessoryStory('bell bottoms');
export const BlueJeans: Story = accessoryStory('blue jeans');
export const BusinessSlacks: Story = accessoryStory('business slacks');
export const Cutoffs: Story = accessoryStory('cutoffs');
export const SwimTrunks: Story = accessoryStory('swim trunks');
export const SoccerTeamShirt: Story = {
	...accessoryStory('soccer team shirt'),
	tags: ['!1.0.0', '1.0.3'],
};
export const SoccerTeamSwimTrunks: Story = {
	...accessoryStory('soccer team swim trunks'),
	tags: ['!1.0.0', '1.0.3'],
};
export const PunkSkirt: Story = accessoryStory('punk skirt');
export const RockStarRuffle: Story = accessoryStory('rock star ruffle');
export const SuperheroStars: Story = accessoryStory('superhero stars');
export const Palette: Story = accessoryStory('palette');
export const Brush: Story = accessoryStory('brush');
export const Lasso: Story = accessoryStory('lasso');
export const Pencil: Story = accessoryStory('pencil');
export const MagicWand: Story = accessoryStory('magic wand');
export const Microphone: Story = accessoryStory('microphone');
export const BusinessShirt: Story = accessoryStory('business shirt');
export const CowboyShirt: Story = accessoryStory('cowboy shirt');
export const Swimsuit: Story = accessoryStory('swimsuit');
export const HeartShirt: Story = accessoryStory('heart shirt');
export const Lifeguard: Story = accessoryStory('lifeguard');
export const SkullShirt: Story = accessoryStory('skull shirt');
export const StripeShirt: Story = accessoryStory('stripe shirt');
export const BlueSlipOns: Story = accessoryStory('blue slip ons');
export const Boots: Story = accessoryStory('boots');
export const CasualShoes: Story = accessoryStory('casual shoes');
export const DressShoes: Story = accessoryStory('dress shoes');
export const PinkSlipOns: Story = accessoryStory('pink slip ons');
export const Sneakers: Story = accessoryStory('sneakers');
export const GothBoots: Story = accessoryStory('goth boots');
export const LeftGothBoot: Story = {
	...accessoryStory('left goth boot'),
	tags: ['!1.0.0', '1.0.3'],
};
export const RightGothBoot: Story = {
	...accessoryStory('right goth boot'),
	tags: ['!1.0.0', '1.0.3'],
};
export const RockStarBoots: Story = accessoryStory('rock star boots');
export const WitchBoots: Story = accessoryStory('witch boots');
export const VipBronzeI: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('bronze-1'),
	name: 'VIP Bronze I',
};
export const VipBronzeII: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('bronze-2'),
	name: 'VIP Bronze II',
};
export const VipBronzeIII: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('bronze-3'),
	name: 'VIP Bronze III',
};
export const VipSilverI: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('silver-1'),
	name: 'VIP Silver I',
};
export const VipSilverII: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('silver-2'),
	name: 'VIP Silver II',
};
export const VipSilverIII: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('silver-3'),
	name: 'VIP Silver III',
};
export const VipGoldI: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('gold-1'),
	name: 'VIP Gold I',
};
export const VipGoldII: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('gold-2'),
	name: 'VIP Gold II',
};
export const VipGoldIII: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('gold-3'),
	name: 'VIP Gold III',
};
export const VipPlatinumI: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('platinum-1'),
	name: 'VIP Platinum I',
};
export const VipPlatinumII: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('platinum-2'),
	name: 'VIP Platinum II',
};
export const VipPlatinumIII: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('platinum-3'),
	name: 'VIP Platinum III',
};
export const VipDiamondI: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('diamond-1'),
	name: 'VIP Diamond I',
};
export const VipDiamondII: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('diamond-2'),
	name: 'VIP Diamond II',
};
export const VipDiamondIII: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('diamond-3'),
	name: 'VIP Diamond III',
};
export const VipMasterI: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('master-1'),
	name: 'VIP Master I',
};
export const VipMasterII: Story = {
	tags: ['!1.0.0', 'unreleased'],
	...accessoryStory('master-2'),
	name: 'VIP Master II',
};
export const VipLegend: Story = {
	...accessoryStory('legend'),
	name: 'VIP Legend',
	tags: ['!1.0.0', '1.0.3'],
};
