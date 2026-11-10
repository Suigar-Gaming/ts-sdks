// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from 'vitest/config';

const ACCESSORY_SVG_IMPORT_PATTERN: RegExp = /^(\.\.\/accessories\/artwork\/.+\.svg)$/;

export default defineConfig({
	// Vite serves plain SVG imports as URLs. Match Rolldown's text imports for artwork.
	resolve: { alias: [{ find: ACCESSORY_SVG_IMPORT_PATTERN, replacement: '$1?raw' }] },
	test: {
		environment: 'node',
		include: ['test/**/*.test.{ts,tsx}'],
		restoreMocks: true,
	},
});
