// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import { readFileSync } from 'node:fs';
import type { StorybookConfig } from '@storybook/react-vite';
import { withReleaseFilters } from './release-tags.js';

// The first three releases predate the package changelog.
const changelog = readFileSync(new URL('../../CHANGELOG.md', import.meta.url), 'utf8');
const releases = [
	'1.0.0',
	'1.0.1',
	'1.0.2',
	...Array.from(
		changelog.matchAll(/^## (\d+\.\d+\.\d+)$/gm),
		([, version]) => version!,
	).toReversed(),
];

const config: StorybookConfig = {
	staticDirs: ['../public'],
	stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	experimental_indexers: (indexers = []) =>
		indexers.map((indexer) => ({
			...indexer,
			async createIndex(file, options) {
				const entries = await indexer.createIndex(file, options);
				return entries.map((entry) => ({
					...entry,
					tags: withReleaseFilters(entry.tags ?? [], releases),
				}));
			},
		})),
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-docs',
		'@storybook/addon-vitest',
		'@storybook/addon-a11y',
		'storybook-addon-tag-badges',
	],
	framework: '@storybook/react-vite',
};

export default config;
