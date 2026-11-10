// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { SuiFrenImage } from '@suigar/suifrens-display-system';
import { vipCrownAccessories } from '@suigar/suifrens-display-system/accessories';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';

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
	title: 'SuiFrenImageInline/VIP Crowns',
	component: SuiFrenImageInline,
	tags: ['autodocs'],
} satisfies Meta<typeof SuiFrenImageInline>;

export default meta;

type Story = StoryObj<typeof SuiFrenImageInline>;

export const ClippingCheck: Story = {
	render: () => (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
				gap: 24,
			}}
		>
			{vipCrownAccessories.map((accessory) => (
				<section key={accessory.name}>
					<h2>{accessory.name}</h2>
					{RENDERERS.map(({ label, Renderer }) => (
						<div key={label} style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
							{[STATIC_VARIANTS[0], STATIC_VARIANTS[2]].map((variant) => (
								<div key={variant.label}>
									<div
										style={{
											width: 128,
											height: 128,
											paddingTop: 32,
											outline: '1px solid #cbd5e1',
										}}
									>
										<Renderer
											attributes={variant.attributes}
											accessories={[accessory]}
											renderSize={128}
											shadow
										/>
									</div>
									<div
										style={{
											width: 64,
											height: 64,
											overflow: 'hidden',
											borderRadius: '50%',
											transform: 'scaleX(-1)',
											marginTop: 12,
										}}
									>
										<Renderer
											attributes={variant.attributes}
											accessories={[accessory]}
											renderSize={64}
											shadow
										/>
									</div>
									<small>
										{label} · {variant.label}
									</small>
								</div>
							))}
						</div>
					))}
				</section>
			))}
		</div>
	),
};

export const Gallery: Story = {
	render: () => (
		<div className="flex flex-col gap-10">
			{vipCrownAccessories.map((accessory) => (
				<section
					key={accessory.name}
					className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs"
				>
					<div className="flex flex-wrap items-baseline justify-between gap-3">
						<div>
							<h2 className="text-base font-semibold text-slate-900">{accessory.name}</h2>
							<p className="text-sm text-slate-500">
								Static crown fit across capy and bullshark declinations.
							</p>
						</div>
						<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-slate-600 uppercase">
							Head-bound crown
						</span>
					</div>
					<div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
						{STATIC_VARIANTS.map((variant) => (
							<article
								key={variant.label}
								className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4"
							>
								<div className="mx-auto h-44 w-44">
									<SuiFrenImageInline
										attributes={variant.attributes}
										accessories={[accessory]}
										shadow
										style={{ width: '100%', height: '100%' }}
									/>
								</div>
								<div className="mt-3 text-center text-xs font-semibold text-slate-600">
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
				<section
					key={accessory.name}
					className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs"
				>
					<div className="flex flex-wrap items-baseline justify-between gap-3">
						<div>
							<h2 className="text-base font-semibold text-slate-900">{accessory.name}</h2>
							<p className="text-sm text-slate-500">
								Motion preview to verify the crown stays bonded to the head.
							</p>
						</div>
						<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-emerald-700 uppercase">
							Animated
						</span>
					</div>
					<div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
						{MOTION_VARIANTS.map((variant) => (
							<article
								key={variant.label}
								className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4"
							>
								<div className="mx-auto h-52 w-52">
									<SuiFrenImageInline
										attributes={variant.attributes}
										accessories={[accessory]}
										shadow
										style={{ width: '100%', height: '100%' }}
										animation={variant.animation}
									/>
								</div>
								<div className="mt-3 text-center text-xs font-semibold text-slate-600">
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
