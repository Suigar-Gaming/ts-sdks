import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: {
		index: 'src/index.ts',
		image: 'src/image/index.tsx',
		'image-inline': 'src/image-inline/index.tsx',
		accessories: 'src/accessories/index.ts',
		colors: 'src/colors/index.ts',
		attributes: 'src/attributes/index.ts',
		animation: 'src/animation/index.ts',
		types: 'src/types/index.ts',
	},
	format: 'esm',
	platform: 'browser',
	minify: true,
	dts: true,
	fixedExtension: true,
	inputOptions: { experimental: { resolveNewUrlToAsset: true } },
});
