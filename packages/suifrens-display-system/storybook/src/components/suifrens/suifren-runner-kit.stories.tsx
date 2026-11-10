// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import { buildRunnerAccessories } from '@suigar/suifrens-display-system/kits';
import { imageControls } from './character-controls.js';
import { KitRendererComparison } from './KitRendererComparison.js';

const meta = {
	title: 'Suifrens/Accessories/Kits/Runner Kit',
	component: RunnerKitPreview,
	argTypes: imageControls,
	tags: ['1.1.0'],
} satisfies Meta<typeof RunnerKitPreview>;
export default meta;
type Story = StoryObj<typeof meta>;
const runners = [
	{
		label: 'Capy',
		attributes: {
			mainColor: 'A87C4C',
			secondaryColor: 'D5CBB1',
			skin: 'basic',
			expression: 'bigSmile',
			earShape: 'default',
		},
		accessories: buildRunnerAccessories({ color: '#ec7da6', number: 3 }),
	},
	{
		label: 'Bullshark',
		attributes: {
			mainColor: '469DFD',
			secondaryColor: 'E6FBFF',
			skin: 'basic',
			expression: 'happy',
			finStyle: 'classic',
		},
		accessories: buildRunnerAccessories({ color: '#73d4be', number: 8 }),
	},
] as const;

function RunnerKitPreview(
	props: Omit<ComponentProps<typeof SuiFrenImageInline>, 'attributes' | 'accessories'>,
) {
	return (
		<div className="story-panel grid max-w-2xl grid-cols-2 gap-3">
			{runners.map(({ label, attributes, accessories }) => (
				<figure key={label} className="story-tile grid justify-items-center gap-2 p-3">
					<SuiFrenImageInline
						{...props}
						attributes={attributes}
						accessories={accessories}
						style={{ width: '100%' }}
					/>
					<figcaption className="text-xs font-semibold text-slate-600 dark:text-slate-300">
						{label}
					</figcaption>
				</figure>
			))}
		</div>
	);
}

export const Runners: Story = {};

export const CompareSvgRenderers: Story = {
	name: 'Compare SVG Renderers',
	render: (props) => (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			{runners.map(({ label, attributes, accessories }) => (
				<section key={label} className="story-panel">
					<h2 className="story-heading mb-2">{label}</h2>
					<KitRendererComparison {...props} attributes={attributes} accessories={accessories} />
				</section>
			))}
		</div>
	),
};
