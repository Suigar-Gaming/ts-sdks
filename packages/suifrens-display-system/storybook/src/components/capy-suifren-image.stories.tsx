// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useEffect, useState } from 'react';
import { ALL_EXPRESSIONS } from '@suigar/suifrens-display-system/expressions';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import type { CapyAttributes, SuiFrenExpression } from '@suigar/suifrens-display-system/types';
import { SuiLogo } from './logos/SuiLogo.js';

const meta = {
	title: 'SuiFrenImageInline/Capy',
	component: SuiFrenImageInline,
	tags: ['autodocs'],
} satisfies Meta<typeof SuiFrenImageInline>;

export default meta;

type Story = StoryObj<typeof SuiFrenImageInline>;

type StoryPropsWithAllExpressions = Omit<
	ComponentProps<typeof SuiFrenImageInline>,
	'attributes'
> & {
	attributes: Omit<CapyAttributes, 'expression'>;
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
			earShape: 'default',
		},
	},
};

export const CapyTransition: StoryWithAllExpressions = {
	// Change periodically expression and rerender the image every 2 seconds
	render: ({ attributes, ...props }) => {
		const [expression, setExpression] = useState<SuiFrenExpression>('happy');
		useEffect(() => {
			const interval = setInterval(() => {
				const randomExpression =
					ALL_EXPRESSIONS[Math.floor(Math.random() * ALL_EXPRESSIONS.length)];
				if (randomExpression) {
					setExpression(randomExpression);
				}
			}, 500);
			return () => clearInterval(interval);
		}, []);
		return (
			<div className="flex flex-wrap gap-2">
				<div className="h-60 w-60 shrink-0">
					<SuiFrenImageInline
						attributes={{
							...attributes,
							expression,
						}}
						{...props}
					/>
				</div>
			</div>
		);
	},
	args: {
		attributes: {
			mainColor: '6FBBEE',
			secondaryColor: 'E6FBFF',
			skin: 'basic',
			earShape: 'default',
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

export const ThumbsDown: Story = {
	...WithShadow,
	args: { ...WithShadow.args, gesture: 'thumbs_down' },
};

export const Point: Story = { ...WithShadow, args: { ...WithShadow.args, gesture: 'point' } };
