// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { BullsharkAttributes } from '@suigar/suifrens-display-system/types';
import { SuiLogo } from '../logos/SuiLogo.js';
import { characterControls } from './character-controls.js';
import {
	type CharacterArgs,
	CharacterPreview,
	ExpressionGallery,
	ExpressionTransitionPreview,
} from './ExpressionCard.js';

type Args = CharacterArgs<BullsharkAttributes>;

const meta = {
	title: 'Suifrens/Characters/Bullshark',
	render: (args) => <CharacterPreview {...args} />,
	argTypes: { ...characterControls, finStyle: { control: 'select', options: ['classic'] } },
	tags: ['1.0.0'],
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	argTypes: { expression: { table: { disable: true } } },
	render: (props) => <CharacterPreview {...props} preview={ExpressionGallery} />,
	args: {
		mainColor: '6FBBEE',
		secondaryColor: 'E6FBFF',
		skin: 'basic',
		finStyle: 'classic',
	},
};

export const ExpressionTransition: Story = {
	...Basic,
	render: (props) => <CharacterPreview {...props} preview={ExpressionTransitionPreview} />,
};

export const Cheetah: Story = {
	...Basic,
	args: {
		mainColor: 'FB825C',
		secondaryColor: 'FFF1D6',
		skin: 'cheetah',
		finStyle: 'classic',
	},
};

export const Fox: Story = {
	...Basic,
	args: {
		mainColor: 'DA8E2F',
		secondaryColor: 'FCCD31',
		skin: 'fox',
		finStyle: 'classic',
	},
};

export const Panda: Story = {
	...Basic,
	args: {
		mainColor: '707070',
		secondaryColor: 'FCCD31',
		skin: 'panda',
		finStyle: 'classic',
	},
};

export const Stripes: Story = {
	...Basic,
	args: {
		mainColor: 'FFF1D6',
		secondaryColor: '707070',
		skin: 'stripes',
		finStyle: 'classic',
	},
};

export const Dalmation: Story = {
	...Basic,
	args: {
		mainColor: 'FFF1D6',
		secondaryColor: 'EAB244',
		skin: 'dalmation',
		finStyle: 'classic',
	},
};

export const Lizard: Story = {
	...Basic,
	args: {
		mainColor: 'E991AB',
		secondaryColor: 'FF5C00',
		skin: 'lizard',
		finStyle: 'classic',
	},
};

export const Snake: Story = {
	...Basic,
	args: {
		mainColor: '066011',
		secondaryColor: '469DFD',
		skin: 'snake',
		finStyle: 'classic',
	},
};

export const WithShadow: Story = {
	args: {
		mainColor: '6FBBEE',
		secondaryColor: 'E6FBFF',
		skin: 'basic',
		finStyle: 'classic',
		expression: 'grimace',
		shadow: true,
	},
};

export const WithLogo: Story = {
	...WithShadow,
	args: {
		mainColor: '6FBBEE',
		secondaryColor: 'E6FBFF',
		skin: 'basic',
		finStyle: 'classic',
		expression: 'bigSmile',
		logo: <SuiLogo />,
	},
};

export const Incognito: Story = {
	...WithShadow,
	args: {
		mainColor: 'FFFFFF',
		secondaryColor: 'FFFFFF',
		skin: 'basic',
		finStyle: 'classic',
		expression: 'happy',
		incognito: true,
	},
};

export const ThumbsUp: Story = {
	...WithShadow,
	tags: ['!1.0.0', 'unreleased'],
	args: {
		...WithShadow.args,
		gesture: 'thumbs_up',
	},
};

export const ThumbsDown: Story = {
	...WithShadow,
	tags: ['!1.0.0', 'unreleased'],
	args: { ...WithShadow.args, gesture: 'thumbs_down' },
};

export const Point: Story = {
	...WithShadow,
	tags: ['!1.0.0', 'unreleased'],
	args: { ...WithShadow.args, gesture: 'point' },
};
