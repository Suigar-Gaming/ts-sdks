import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: Object.fromEntries(
		[
			'index',
			'image',
			'image-inline',
			'image-assets',
			'accessories',
			'colors',
			'attributes',
			'expressions',
			'vip-crowns',
			'animation',
			'battle',
			'types',
		].map((name) => [name, `src/${name}.ts`]),
	),
	format: 'esm',
	platform: 'browser',
	target: 'es2020',
	minify: true,
	dts: true,
	deps: { neverBundle: [/^react(?:-dom)?(?:\/.*)?$/] },
	outExtensions: () => ({ js: '.mjs' }),
	outputOptions: {
		chunkFileNames: 'chunks/[name]-[hash].mjs',
		assetFileNames: 'assets/[name]-[hash][extname]',
	},
	plugins: [
		{
			name: 'svg-assets',
			async load(id) {
				if (!id.endsWith('.svg')) {
					return;
				}
				const source = (await readFile(id, 'utf8'))
					.replace(/\s+/g, ' ')
					.replace(/>\s+</g, '><')
					.replace(/-?\d+\.\d+/g, (value) => Number(Number(value).toFixed(2)).toString())
					.trim();
				const ref = this.emitFile({ type: 'asset', name: basename(id), source });
				return `export default import.meta.ROLLUP_FILE_URL_${ref};`;
			},
			resolveFileUrl({ relativePath }) {
				// Consumers (including Vite) resolve the URL relative to the emitted chunk.
				return `new URL(${JSON.stringify(relativePath)}, import.meta.url).href`;
			},
		},
	],
});
