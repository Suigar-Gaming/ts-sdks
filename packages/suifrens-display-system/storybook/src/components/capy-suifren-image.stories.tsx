// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import type { CapyAttributes, SuiFrenImageProps } from '@suigar/suifrens-display-system/types';
import { ExpressionCard, ExpressionGallery, ExpressionTransition } from './ExpressionCard.js';
import { SuiLogo } from './logos/SuiLogo.js';

const meta = {
	id: 'suifrenimageinline-capy',
	title: 'Suifrens/Characters/Capy',
	component: SuiFrenImageInline,
	tags: ['autodocs'],
} satisfies Meta<typeof SuiFrenImageInline>;

export default meta;

type Story = StoryObj<typeof SuiFrenImageInline>;

type StoryPropsWithAllExpressions = Omit<SuiFrenImageProps, 'attributes'> & {
	attributes: Omit<CapyAttributes, 'expression'>;
};
type StoryWithAllExpressions = StoryObj<StoryPropsWithAllExpressions>;

export const Basic: StoryWithAllExpressions = {
	render: (props) => <ExpressionGallery {...props} />,
	args: {
		attributes: {
			mainColor: '6FBBEE',
			secondaryColor: 'E6FBFF',
			skin: 'basic',
			earShape: 'default',
		},
	},
};

export const CapyTransition: StoryWithAllExpressions = {
	...Basic,
	name: 'Expression Transition',
	render: (props) => <ExpressionTransition {...props} />,
};

export const Cheetah: StoryWithAllExpressions = {
	...Basic,
	args: {
		attributes: {
			mainColor: 'FB825C',
			secondaryColor: 'FFF1D6',
			skin: 'cheetah',
			earShape: 'quiet',
		},
	},
};

export const Fox: StoryWithAllExpressions = {
	...Basic,
	args: {
		attributes: {
			mainColor: 'DA8E2F',
			secondaryColor: 'FCCD31',
			skin: 'fox',
			earShape: 'wild',
		},
	},
};

export const Panda: StoryWithAllExpressions = {
	...Basic,
	args: {
		attributes: {
			mainColor: '707070',
			secondaryColor: 'FCCD31',
			skin: 'panda',
			earShape: 'mischievous',
		},
	},
};

export const Stripes: StoryWithAllExpressions = {
	...Basic,
	args: {
		attributes: {
			mainColor: 'FFF1D6',
			secondaryColor: '707070',
			skin: 'stripes',
			earShape: 'default',
		},
	},
};

export const Dalmation: StoryWithAllExpressions = {
	...Basic,
	args: {
		attributes: {
			mainColor: 'FFF1D6',
			secondaryColor: '4E494E',
			skin: 'dalmation',
			earShape: 'default',
		},
	},
};

export const Lizard: StoryWithAllExpressions = {
	...Basic,
	args: {
		attributes: {
			mainColor: '43426F',
			secondaryColor: '3F97FF',
			skin: 'lizard',
			earShape: 'default',
		},
	},
};

export const Snake: StoryWithAllExpressions = {
	...Basic,
	args: {
		attributes: {
			mainColor: 'A17E52',
			secondaryColor: 'A87C4C',
			skin: 'snake',
			earShape: 'default',
		},
	},
};

export const WithShadow: Story = {
	render: (props) => <ExpressionCard {...props} />,
	args: {
		attributes: {
			mainColor: '6FBBEE',
			secondaryColor: 'E6FBFF',
			skin: 'basic',
			earShape: 'wild',
			expression: 'bigSmile',
		},
		shadow: true,
	},
};

export const WithLogo: Story = {
	...WithShadow,
	args: {
		attributes: {
			mainColor: '6FBBEE',
			secondaryColor: 'E6FBFF',
			skin: 'basic',
			earShape: 'wild',
			expression: 'bigSmile',
		},
		logo: <SuiLogo />,
	},
};

export const Incognito: Story = {
	...WithShadow,
	args: {
		attributes: {
			mainColor: 'FFFFFF',
			secondaryColor: 'FFFFFF',
			skin: 'basic',
			earShape: 'wild',
			expression: 'happy',
		},
		incognito: true,
	},
};

export const ThumbsUp: Story = {
	...WithShadow,
	tags: ['since-1.2.0'],
	args: { ...WithShadow.args, gesture: 'thumbs_up' },
};

export const ThumbsDown: Story = {
	...WithShadow,
	tags: ['unreleased'],
	args: { ...WithShadow.args, gesture: 'thumbs_down' },
};

export const Point: Story = {
	...WithShadow,
	tags: ['unreleased'],
	args: { ...WithShadow.args, gesture: 'point' },
};
