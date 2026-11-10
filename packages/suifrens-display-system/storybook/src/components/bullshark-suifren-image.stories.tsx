// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { ALL_EXPRESSIONS } from '@suigar/suifrens-display-system/expressions';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import type { BullsharkAttributes } from '@suigar/suifrens-display-system/types';
import { SuiLogo } from './logos/SuiLogo.js';

const meta = {
	title: 'SuiFrenImageInline/Bullshark',
	component: SuiFrenImageInline,
	tags: ['autodocs'],
} satisfies Meta<typeof SuiFrenImageInline>;

export default meta;

type Story = StoryObj<typeof SuiFrenImageInline>;

type StoryPropsWithAllExpressions = Omit<
	ComponentProps<typeof SuiFrenImageInline>,
	'attributes'
> & {
	attributes: Omit<BullsharkAttributes, 'expression'>;
};
type StoryWithAllExpressions = StoryObj<StoryPropsWithAllExpressions>;

export const Basic: StoryWithAllExpressions = {
	render: ({ attributes, ...props }) => (
		<div className="flex flex-wrap gap-2">
			{ALL_EXPRESSIONS.map((expression) => (
				<div className="h-60 w-60 shrink-0" key={expression}>
					<SuiFrenImageInline
						attributes={{
							...attributes,
							expression,
						}}
						{...props}
					/>
				</div>
			))}
		</div>
	),
	args: {
		attributes: {
			mainColor: '6FBBEE',
			secondaryColor: 'E6FBFF',
			skin: 'basic',
			finStyle: 'classic',
		},
	},
};

export const Cheetah: StoryWithAllExpressions = {
	...Basic,
	args: {
		attributes: {
			mainColor: 'FB825C',
			secondaryColor: 'FFF1D6',
			skin: 'cheetah',
			finStyle: 'classic',
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
			finStyle: 'classic',
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
			finStyle: 'classic',
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
			finStyle: 'classic',
		},
	},
};

export const Dalmation: StoryWithAllExpressions = {
	...Basic,
	args: {
		attributes: {
			mainColor: 'FFF1D6',
			secondaryColor: 'EAB244',
			skin: 'dalmation',
			finStyle: 'classic',
		},
	},
};

export const Lizard: StoryWithAllExpressions = {
	...Basic,
	args: {
		attributes: {
			mainColor: 'E991AB',
			secondaryColor: 'FF5C00',
			skin: 'lizard',
			finStyle: 'classic',
		},
	},
};

export const Snake: StoryWithAllExpressions = {
	...Basic,
	args: {
		attributes: {
			mainColor: '066011',
			secondaryColor: '469DFD',
			skin: 'snake',
			finStyle: 'classic',
		},
	},
};

export const WithShadow: Story = {
	decorators: [
		(Story) => (
			<div className="h-60 w-60">
				<Story />
			</div>
		),
	],
	args: {
		attributes: {
			mainColor: '6FBBEE',
			secondaryColor: 'E6FBFF',
			skin: 'basic',
			finStyle: 'classic',
			expression: 'grimace',
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
			finStyle: 'classic',
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
			finStyle: 'classic',
			expression: 'happy',
		},
		incognito: true,
	},
};

export const ThumbsUp: Story = {
	...WithShadow,
	args: {
		...WithShadow.args,
		gesture: 'thumbs_up',
	},
};

export const ThumbsDown: Story = {
	...WithShadow,
	args: { ...WithShadow.args, gesture: 'thumbs_down' },
};

export const Point: Story = { ...WithShadow, args: { ...WithShadow.args, gesture: 'point' } };
