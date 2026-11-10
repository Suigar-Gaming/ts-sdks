// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { resolve } from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const chromium = () => ({
	enabled: true,
	headless: true,
	provider: playwright(),
	instances: [{ browser: 'chromium' as const }],
});

export default defineConfig({
	test: {
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{ts,tsx}'],
			exclude: ['**/*.stories.tsx'],
			reporter: ['text', 'html', 'lcov'],
		},
		projects: [
			{
				test: {
					name: 'unit',
					environment: 'node',
					include: ['test/unit/**/*.test.{ts,tsx}'],
					restoreMocks: true,
				},
			},
			{
				plugins: [storybookTest({ configDir: '.storybook' })],
				test: {
					name: 'storybook',
					browser: chromium(),
				},
			},
			{
				test: {
					name: 'visual',
					include: ['test/visual/**/*.test.tsx'],
					browser: {
						...chromium(),
						expect: {
							toMatchScreenshot: {
								resolveScreenshotPath: ({ root, testFileDirectory, arg, ext }) =>
									resolve(root, testFileDirectory, '__screenshots__', arg + ext),
							},
						},
					},
				},
			},
		],
	},
});
