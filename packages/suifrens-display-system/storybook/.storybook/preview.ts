// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import type { Preview } from '@storybook/react-vite';
import { createElement } from 'react';
import { ThemeDocsContainer } from '../src/components/ThemeDocsContainer.js';
import '../src/tailwind.css';

const COLOR_CONTROL_PATTERN: RegExp = /(background|color)$/iu;
const DATE_CONTROL_PATTERN: RegExp = /Date$/iu;

const preview: Preview = {
	tags: ['autodocs'],
	globalTypes: {
		theme: {
			description: 'Story appearance',
			toolbar: {
				title: 'Theme',
				icon: 'circlehollow',
				items: [
					{ value: 'system', title: 'System' },
					{ value: 'light', title: 'Light' },
					{ value: 'dark', title: 'Dark' },
				],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: { theme: 'system' },
	decorators: [
		(Story, { globals }) =>
			createElement(
				'div',
				{
					className: 'story-page',
					'data-theme': typeof globals['theme'] === 'string' ? globals['theme'] : undefined,
				},
				createElement(Story),
			),
	],
	parameters: {
		a11y: { test: 'error' },
		docs: { container: ThemeDocsContainer },
		options: {
			storySort: {
				order: [
					'Suifrens',
					[
						'Onboarding',
						'Characters',
						'Accessories',
						['Catalogue', '*', 'Kits'],
						'*',
						'Playground',
						['Sandbox'],
					],
				],
			},
		},
		controls: {
			matchers: {
				color: COLOR_CONTROL_PATTERN,
				date: DATE_CONTROL_PATTERN,
			},
		},
	},
};

export default preview;
