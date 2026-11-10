import { defineConfig } from 'vitest/config';

export default defineConfig({
	// Vite serves plain SVG imports as URLs. Match Rolldown's text imports for artwork.
	resolve: { alias: [{ find: /^(\.\.\/accessories\/artwork\/.+\.svg)$/, replacement: '$1?raw' }] },
	test: {
		environment: 'node',
		include: ['test/**/*.test.{ts,tsx}'],
		restoreMocks: true,
	},
});
