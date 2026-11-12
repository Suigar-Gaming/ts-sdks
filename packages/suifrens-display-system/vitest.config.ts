// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const ACCESSORY_SVG_IMPORT_PATTERN: RegExp = /^((?:\.\.\/)+accessories\/.+\.svg)$/u;

export default defineConfig({
	// Vite serves plain SVG imports as URLs. Match Rolldown's text imports for artwork.
	resolve: { alias: [{ find: ACCESSORY_SVG_IMPORT_PATTERN, replacement: '$1?raw' }] },
	test: {
		// Threads reduce worker startup cost while retaining per-file isolation.
		pool: 'threads',
		include: ['test/**/*.test.{ts,tsx}'],
		restoreMocks: true,
		// Exercise compiled exports through Node, without re-transforming dist in Vite.
		deps: {
			moduleDirectories: ['node_modules', fileURLToPath(new URL('./dist', import.meta.url))],
		},
	},
});
