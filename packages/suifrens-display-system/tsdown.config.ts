// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { defineConfig } from 'tsdown';

const URL_QUERY_SUFFIX = '?url';

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
	unbundle: true,
	dts: true,
	loader: { '.svg': 'text' },
	plugins: [
		{
			name: 'external-svg-urls',
			async load(id) {
				if (!id.endsWith(`.svg${URL_QUERY_SUFFIX}`)) {
					return;
				}
				const path = id.slice(0, -URL_QUERY_SUFFIX.length);
				const ref = this.emitFile({
					type: 'asset',
					name: basename(path),
					source: await readFile(path),
				});
				return `export default import.meta.ROLLDOWN_FILE_URL_${ref};`;
			},
		},
	],
});
