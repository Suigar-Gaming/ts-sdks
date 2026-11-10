// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { accessories } from '@suigar/suifrens-display-system/accessories';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import { CataloguePreview } from './CataloguePreview.js';

const meta = {
	id: 'suifrenimageinline-accessories',
	title: 'Suifrens/Accessories/Catalogue',
	component: SuiFrenImageInline,
	tags: ['autodocs', 'catalogue-entry'],
} satisfies Meta<typeof SuiFrenImageInline>;

export default meta;

type Story = StoryObj<typeof SuiFrenImageInline>;

export const AllAccessories: Story = {
	tags: ['!catalogue-entry'],
	render: () => (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
			{accessories.map((accessory) => (
				<CataloguePreview
					key={accessory.name}
					title={accessory.name}
					subtitle={accessory.type}
					accessories={[accessory]}
				/>
			))}
		</div>
	),
};

function accessoryStory(name: string): Story {
	const accessory = accessories.find((entry) => entry.name === name);
	if (!accessory) throw new Error(`Unknown accessory: ${name}`);
	return {
		render: () => (
			<CataloguePreview title={name} subtitle={accessory.type} accessories={[accessory]} />
		),
	};
}
export const RunnerSinglet: Story = accessoryStory('runner singlet');
export const RunnerShorts: Story = accessoryStory('runner shorts');
export const RunnerHeadband: Story = accessoryStory('runner headband');
export const RunnerShoes: Story = accessoryStory('runner shoes');
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
export const SoccerTeamShirt: Story = accessoryStory('soccer team shirt');
export const SoccerTeamSwimTrunks: Story = accessoryStory('soccer team swim trunks');
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
export const LeftGothBoot: Story = accessoryStory('left goth boot');
export const RightGothBoot: Story = accessoryStory('right goth boot');
export const RockStarBoots: Story = accessoryStory('rock star boots');
export const WitchBoots: Story = accessoryStory('witch boots');
export const Bronze1: Story = { ...accessoryStory('bronze-1'), name: 'bronze-1' };
export const Bronze2: Story = { ...accessoryStory('bronze-2'), name: 'bronze-2' };
export const Bronze3: Story = { ...accessoryStory('bronze-3'), name: 'bronze-3' };
export const Silver1: Story = { ...accessoryStory('silver-1'), name: 'silver-1' };
export const Silver2: Story = { ...accessoryStory('silver-2'), name: 'silver-2' };
export const Silver3: Story = { ...accessoryStory('silver-3'), name: 'silver-3' };
export const Gold1: Story = { ...accessoryStory('gold-1'), name: 'gold-1' };
export const Gold2: Story = { ...accessoryStory('gold-2'), name: 'gold-2' };
export const Gold3: Story = { ...accessoryStory('gold-3'), name: 'gold-3' };
export const Platinum1: Story = { ...accessoryStory('platinum-1'), name: 'platinum-1' };
export const Platinum2: Story = { ...accessoryStory('platinum-2'), name: 'platinum-2' };
export const Platinum3: Story = { ...accessoryStory('platinum-3'), name: 'platinum-3' };
export const Diamond1: Story = { ...accessoryStory('diamond-1'), name: 'diamond-1' };
export const Diamond2: Story = { ...accessoryStory('diamond-2'), name: 'diamond-2' };
export const Diamond3: Story = { ...accessoryStory('diamond-3'), name: 'diamond-3' };
export const Master1: Story = { ...accessoryStory('master-1'), name: 'master-1' };
export const Master2: Story = { ...accessoryStory('master-2'), name: 'master-2' };
export const Legend: Story = accessoryStory('legend');
