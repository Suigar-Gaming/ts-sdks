// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Preview } from '@storybook/react-vite';
import { createElement } from 'react';
import '../src/tailwind.css';

const COLOR_CONTROL_PATTERN: RegExp = /(background|color)$/i;
const DATE_CONTROL_PATTERN: RegExp = /Date$/i;

const preview: Preview = {
	tags: ['autodocs'],
	decorators: [(Story) => createElement('div', { className: 'story-page' }, createElement(Story))],
	parameters: {
		controls: {
			matchers: {
				color: COLOR_CONTROL_PATTERN,
				date: DATE_CONTROL_PATTERN,
			},
		},
	},
};

export default preview;
