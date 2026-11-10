// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { buildRunnerAccessories } from '@suigar/suifrens-display-system/kits';
import { CataloguePreview } from './CataloguePreview.js';

const meta = {
	title: 'Suifrens/Onboarding',
	component: Onboarding,
	tags: ['!autodocs'],
} satisfies Meta<typeof Onboarding>;

export default meta;

const steps = [
	{
		title: 'Meet the Suifrens',
		description:
			'Capy and Bullshark share the same expressions. Compare their smiles here, then explore the expression catalogue.',
		preview: <CataloguePreview title="Big Smile" expression="bigSmile" />,
		link: 'Explore expressions',
		story: 'suifrens-characters-expressions--big-smile',
	},
	{
		title: 'Find an animation',
		description:
			'Open the sidebar search with ⌘K on Mac or Ctrl+K on Windows and Linux. Search for “Goalkeeper Crab” or “goalkeeperCrab” to open this animation.',
		preview: (
			<CataloguePreview
				title="Goalkeeper Crab"
				animation={{ preset: 'goalkeeperCrab', playback: { iterations: 'infinite' } }}
			/>
		),
		link: 'Open Goalkeeper Crab',
		story: 'suifrens-animations-presets--goalkeeper-crab',
	},
	{
		title: 'Explore a release',
		description:
			'Choose v1.1.0 in the sidebar tag filter to see features available by that release, including the Runner Kit. Each story’s version badge shows when its feature first appeared.',
		preview: (
			<CataloguePreview
				title="Runner Kit"
				accessories={buildRunnerAccessories({ color: '#73d4be', number: 8 })}
			/>
		),
		link: 'Open Runner Kit',
		story: 'suifrens-accessories-kits-runner-kit--runners',
	},
];

function Onboarding() {
	const [index, setIndex] = useState(0);
	const step = steps[index]!;
	return (
		<main className="mx-auto grid max-w-2xl gap-4">
			<h1 className="text-2xl font-semibold">Getting started with Suifrens</h1>
			<section className="story-panel grid gap-4" aria-live="polite">
				<p className="text-sm text-slate-600 dark:text-slate-300">
					Step {index + 1} of {steps.length}
				</p>
				<h2 className="story-heading">{step.title}</h2>
				<p>{step.description}</p>
				{step.preview}
				<a
					className="story-button justify-self-start"
					href={`./?path=/story/${step.story}`}
					target="_top"
				>
					{step.link} <span aria-hidden="true">→</span>
				</a>
			</section>
			<nav aria-label="Guide steps" className="flex justify-between gap-3">
				<button
					type="button"
					className="story-button disabled:opacity-50"
					disabled={index === 0}
					onClick={() => setIndex(index - 1)}
				>
					Back
				</button>
				{index + 1 < steps.length ? (
					<button type="button" className="story-button" onClick={() => setIndex(index + 1)}>
						Next
					</button>
				) : (
					<a
						className="story-button"
						href="./?path=/story/suifrens-playground-sandbox--control-pad-playground"
						target="_top"
					>
						Try the playground <span aria-hidden="true">→</span>
					</a>
				)}
			</nav>
		</main>
	);
}

export const GettingStarted: StoryObj<typeof meta> = { render: () => <Onboarding /> };
