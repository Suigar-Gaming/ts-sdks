// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { EAR_GENE_TO_EAR_SHAPE } from '@suigar/suifrens-display-system/attributes';
import type { CapyAttributes } from '@suigar/suifrens-display-system/types';
import { SuiLogo } from '../logos/SuiLogo.js';
import { characterControls } from './character-controls.js';
import {
	type CharacterArgs,
	CharacterPreview,
	ExpressionGallery,
	ExpressionTransitionPreview,
} from './ExpressionCard.js';

type Args = CharacterArgs<CapyAttributes>;

const meta = {
	title: 'Suifrens/Characters/Capy',
	render: (args) => <CharacterPreview {...args} />,
	argTypes: {
		...characterControls,
		earShape: { control: 'select', options: Object.values(EAR_GENE_TO_EAR_SHAPE) },
	},
	tags: ['1.0.0'],
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	argTypes: { expression: { table: { disable: true } } },
	render: (props) => <CharacterPreview {...props} preview={ExpressionGallery} />,
	args: {
		mainColor: '6fbbee',
		secondaryColor: 'e6fbff',
		skin: 'basic',
		earShape: 'default',
	},
};

export const ExpressionTransition: Story = {
	...Basic,
	render: (props) => <CharacterPreview {...props} preview={ExpressionTransitionPreview} />,
};

export const Cheetah: Story = {
	...Basic,
	args: {
		mainColor: 'fb825c',
		secondaryColor: 'fff1d6',
		skin: 'cheetah',
		earShape: 'quiet',
	},
};

export const Fox: Story = {
	...Basic,
	args: {
		mainColor: 'da8e2f',
		secondaryColor: 'fccd31',
		skin: 'fox',
		earShape: 'wild',
	},
};

export const Panda: Story = {
	...Basic,
	args: {
		mainColor: '707070',
		secondaryColor: 'fccd31',
		skin: 'panda',
		earShape: 'mischievous',
	},
};

export const Stripes: Story = {
	...Basic,
	args: {
		mainColor: 'fff1d6',
		secondaryColor: '707070',
		skin: 'stripes',
		earShape: 'default',
	},
};

export const Dalmation: Story = {
	...Basic,
	args: {
		mainColor: 'fff1d6',
		secondaryColor: '4e494e',
		skin: 'dalmation',
		earShape: 'default',
	},
};

export const Lizard: Story = {
	...Basic,
	args: {
		mainColor: '43426f',
		secondaryColor: '3f97ff',
		skin: 'lizard',
		earShape: 'default',
	},
};

export const Snake: Story = {
	...Basic,
	args: {
		mainColor: 'a17e52',
		secondaryColor: 'a87c4c',
		skin: 'snake',
		earShape: 'default',
	},
};

export const WithShadow: Story = {
	args: {
		mainColor: '6fbbee',
		secondaryColor: 'e6fbff',
		skin: 'basic',
		earShape: 'wild',
		expression: 'bigSmile',
		shadow: true,
	},
};

export const WithLogo: Story = {
	...WithShadow,
	args: {
		mainColor: '6fbbee',
		secondaryColor: 'e6fbff',
		skin: 'basic',
		earShape: 'wild',
		expression: 'bigSmile',
		logo: <SuiLogo />,
	},
};

export const Incognito: Story = {
	...WithShadow,
	args: {
		mainColor: 'ffffff',
		secondaryColor: 'ffffff',
		skin: 'basic',
		earShape: 'wild',
		expression: 'happy',
		incognito: true,
	},
};

export const ThumbsUp: Story = {
	...WithShadow,
	tags: ['!1.0.0', '1.2.0'],
	args: { ...WithShadow.args, gesture: 'thumbs_up' },
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
