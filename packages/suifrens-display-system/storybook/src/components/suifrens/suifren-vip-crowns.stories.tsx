// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { SuiFrenImage } from '@suigar/suifrens-display-system';
import { vipCrownAccessories } from '@suigar/suifrens-display-system/accessories';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import { accessoryLabel } from '../../utils/accessory-label.js';

const LOOP = { iterations: 'infinite' as const };

const RENDERERS = [
	{ label: 'Inline', Renderer: SuiFrenImageInline },
	{ label: 'Assets', Renderer: SuiFrenImage },
] as const;

const STATIC_VARIANTS = [
	{
		label: 'Capy · Soft',
		attributes: {
			mainColor: '6FBBEE',
			secondaryColor: 'E6FBFF',
			skin: 'basic',
			earShape: 'default',
			expression: 'happy',
		} as const,
	},
	{
		label: 'Capy · Wild',
		attributes: {
			mainColor: 'FB825C',
			secondaryColor: 'FFF1D6',
			skin: 'cheetah',
			earShape: 'wild',
			expression: 'bigSmile',
		} as const,
	},
	{
		label: 'Bullshark · Classic',
		attributes: {
			mainColor: '6FBBEE',
			secondaryColor: 'E6FBFF',
			skin: 'basic',
			finStyle: 'classic',
			expression: 'happy',
		} as const,
	},
	{
		label: 'Bullshark · Alt',
		attributes: {
			mainColor: 'DA8E2F',
			secondaryColor: 'FCCD31',
			skin: 'fox',
			finStyle: 'classic',
			expression: 'goofy',
		} as const,
	},
] as const;

const MOTION_VARIANTS = [
	{
		label: 'Capy · Celebrate',
		attributes: {
			mainColor: 'E991AB',
			secondaryColor: 'FF5C00',
			skin: 'lizard',
			earShape: 'quiet',
			expression: 'laughing',
		} as const,
		animation: { preset: 'celebrate', playback: { ...LOOP, alternate: true } },
	},
	{
		label: 'Bullshark · Walk',
		attributes: {
			mainColor: 'FFF1D6',
			secondaryColor: '707070',
			skin: 'stripes',
			finStyle: 'classic',
			expression: 'wink',
		} as const,
		animation: { preset: 'walk', playback: { ...LOOP, alternate: true } },
	},
] as const;

const meta = {
	title: 'Suifrens/Accessories/VIP Crowns',
	component: SuiFrenImageInline,
	tags: ['1.0.3'],
} satisfies Meta<typeof SuiFrenImageInline>;

export default meta;

type Story = StoryObj<typeof SuiFrenImageInline>;

export const ClippingCheck: Story = {
	tags: ['!1.0.3', '1.0.6'],
	render: () => (
		<div className="flex flex-col gap-10">
			{vipCrownAccessories.map((accessory) => (
				<section key={accessory.name} className="story-panel">
					<h2 className="story-heading">{accessoryLabel(accessory)}</h2>
					<div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,10rem),1fr))] gap-4">
						{RENDERERS.flatMap(({ label, Renderer }) =>
							[STATIC_VARIANTS[0], STATIC_VARIANTS[2]].map((variant) => (
								<figure
									key={`${label}-${variant.label}`}
									className="story-tile grid justify-items-center gap-3 p-4"
								>
									<div className="grid size-32 place-items-center">
										<Renderer
											attributes={variant.attributes}
											accessories={[accessory]}
											renderSize={128}
											shadow
										/>
									</div>
									<div className="size-16 -scale-x-100 overflow-hidden rounded-full bg-white outline outline-slate-300 dark:bg-slate-900 dark:outline-slate-600">
										<Renderer
											attributes={variant.attributes}
											accessories={[accessory]}
											renderSize={64}
											shadow
										/>
									</div>
									<figcaption className="text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
										{label} · {variant.label}
									</figcaption>
								</figure>
							)),
						)}
					</div>
				</section>
			))}
		</div>
	),
};

export const Gallery: Story = {
	render: () => (
		<div className="flex flex-col gap-10">
			{vipCrownAccessories.map((accessory) => (
				<section key={accessory.name} className="story-panel">
					<div className="flex flex-wrap items-baseline justify-between gap-3">
						<div>
							<h2 className="story-heading">{accessoryLabel(accessory)}</h2>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Static crown fit across capy and bullshark declinations.
							</p>
						</div>
						<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-slate-600 uppercase dark:bg-slate-700 dark:text-slate-300">
							Head-bound crown
						</span>
					</div>
					<div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
						{STATIC_VARIANTS.map((variant) => (
							<article key={variant.label} className="story-tile p-4">
								<div className="mx-auto aspect-square w-full max-w-44">
									<SuiFrenImageInline
										attributes={variant.attributes}
										accessories={[accessory]}
										shadow
										style={{ width: '100%', height: '100%' }}
									/>
								</div>
								<div className="mt-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
									{variant.label}
								</div>
							</article>
						))}
					</div>
				</section>
			))}
		</div>
	),
};

export const MotionCheck: Story = {
	render: () => (
		<div className="flex flex-col gap-10">
			{vipCrownAccessories.map((accessory) => (
				<section key={accessory.name} className="story-panel">
					<div className="flex flex-wrap items-baseline justify-between gap-3">
						<div>
							<h2 className="story-heading">{accessoryLabel(accessory)}</h2>
							<p className="text-sm text-slate-500 dark:text-slate-400">
								Motion preview to verify the crown stays bonded to the head.
							</p>
						</div>
						<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-emerald-700 uppercase dark:bg-emerald-950 dark:text-emerald-200">
							Animated
						</span>
					</div>
					<div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
						{MOTION_VARIANTS.map((variant) => (
							<article key={variant.label} className="story-tile p-4">
								<div className="mx-auto aspect-square w-full max-w-52">
									<SuiFrenImageInline
										attributes={variant.attributes}
										accessories={[accessory]}
										shadow
										style={{ width: '100%', height: '100%' }}
										animation={variant.animation}
									/>
								</div>
								<div className="mt-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
									{variant.label}
								</div>
							</article>
						))}
					</div>
				</section>
			))}
		</div>
	),
};
