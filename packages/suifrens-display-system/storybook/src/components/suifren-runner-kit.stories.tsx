// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import { buildRunnerAccessories } from '@suigar/suifrens-display-system/kits';
const meta = {
	title: 'SuiFrens/Runner kit',
	component: SuiFrenImageInline,
	parameters: { layout: 'centered' },
} satisfies Meta<typeof SuiFrenImageInline>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Capy: Story = {
	args: {
		attributes: {
			mainColor: 'A87C4C',
			secondaryColor: 'D5CBB1',
			skin: 'basic',
			expression: 'bigSmile',
			earShape: 'default',
		},
		accessories: buildRunnerAccessories({ color: '#ec7da6', number: 3 }),
		style: { width: 300 },
	},
};
export const Bullshark: Story = {
	args: {
		attributes: {
			mainColor: '469DFD',
			secondaryColor: 'E6FBFF',
			skin: 'basic',
			expression: 'happy',
			finStyle: 'classic',
		},
		accessories: buildRunnerAccessories({ color: '#73d4be', number: 8 }),
		style: { width: 300 },
	},
};
