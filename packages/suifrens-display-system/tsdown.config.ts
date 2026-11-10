import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: {
		index: 'src/index.ts',
		'image-inline': 'src/image-inline/index.tsx',
		accessories: 'src/accessories/index.ts',
		colors: 'src/colors/index.ts',
		attributes: 'src/attributes/index.ts',
		animation: 'src/animation/index.ts',
		battle: 'src/battle/index.ts',
		expressions: 'src/expressions/index.ts',
		kits: 'src/kits/index.ts',
		types: 'src/types/index.ts',
	},
	format: 'esm',
	platform: 'browser',
	minify: true,
	dts: true,
	fixedExtension: true,
	loader: { '.svg': 'text' },
	inputOptions: { experimental: { resolveNewUrlToAsset: true } },
});
