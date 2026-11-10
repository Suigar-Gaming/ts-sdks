// Copyright (c) Suigar
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
	...Array.from(changelog.matchAll(/^## (\d+\.\d+\.\d+)$/gm), ([, version]) => version!).reverse(),
];

const config: StorybookConfig = {
	staticDirs: [{ from: '../../../../playground/public/logo', to: '/brand' }],
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
		'storybook-addon-tag-badges',
		'@chromatic-com/storybook',
	],
	framework: '@storybook/react-vite',
};

export default config;
