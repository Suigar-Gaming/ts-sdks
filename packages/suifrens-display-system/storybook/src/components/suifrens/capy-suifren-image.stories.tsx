// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { earGeneToEarShape } from '@suigar/suifrens-display-system/attributes';
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
		earShape: { control: 'select', options: Object.values(earGeneToEarShape) },
	},
	tags: ['1.0.0'],
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Basic: Story = {
	argTypes: { expression: { table: { disable: true } } },
	render: (props) => <CharacterPreview {...props} preview={ExpressionGallery} />,
	args: {
		mainColor: '6FBBEE',
		secondaryColor: 'E6FBFF',
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
		mainColor: 'FB825C',
		secondaryColor: 'FFF1D6',
		skin: 'cheetah',
		earShape: 'quiet',
	},
};

export const Fox: Story = {
	...Basic,
	args: {
		mainColor: 'DA8E2F',
		secondaryColor: 'FCCD31',
		skin: 'fox',
		earShape: 'wild',
	},
};

export const Panda: Story = {
	...Basic,
	args: {
		mainColor: '707070',
		secondaryColor: 'FCCD31',
		skin: 'panda',
		earShape: 'mischievous',
	},
};

export const Stripes: Story = {
	...Basic,
	args: {
		mainColor: 'FFF1D6',
		secondaryColor: '707070',
		skin: 'stripes',
		earShape: 'default',
	},
};

export const Dalmation: Story = {
	...Basic,
	args: {
		mainColor: 'FFF1D6',
		secondaryColor: '4E494E',
		skin: 'dalmation',
		earShape: 'default',
	},
};

export const Lizard: Story = {
	...Basic,
	args: {
		mainColor: '43426F',
		secondaryColor: '3F97FF',
		skin: 'lizard',
		earShape: 'default',
	},
};

export const Snake: Story = {
	...Basic,
	args: {
		mainColor: 'A17E52',
		secondaryColor: 'A87C4C',
		skin: 'snake',
		earShape: 'default',
	},
};

export const WithShadow: Story = {
	args: {
		mainColor: '6FBBEE',
		secondaryColor: 'E6FBFF',
		skin: 'basic',
		earShape: 'wild',
		expression: 'bigSmile',
		shadow: true,
	},
};

export const WithLogo: Story = {
	...WithShadow,
	args: {
		mainColor: '6FBBEE',
		secondaryColor: 'E6FBFF',
		skin: 'basic',
		earShape: 'wild',
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
