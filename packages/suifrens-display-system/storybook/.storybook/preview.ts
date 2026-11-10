// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Preview } from '@storybook/react-vite';
import { createElement } from 'react';
import '../src/tailwind.css';

const COLOR_CONTROL_PATTERN: RegExp = /(background|color)$/i;
const DATE_CONTROL_PATTERN: RegExp = /Date$/i;

const preview: Preview = {
	tags: ['autodocs'],
	globalTypes: {
		theme: {
			description: 'Story appearance',
			toolbar: {
				title: 'Theme',
				icon: 'circlehollow',
				items: [
					{ value: 'light', title: 'Light' },
					{ value: 'dark', title: 'Dark' },
				],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: { theme: 'light' },
	decorators: [
		(Story, { globals }) =>
			createElement(
				'div',
				{ className: 'story-page', 'data-theme': globals['theme'] },
				createElement(Story),
			),
	],
	parameters: {
		options: {
			storySort: { order: ['Suifrens', ['Onboarding', 'Characters', 'Accessories', 'Kits', '*']] },
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
