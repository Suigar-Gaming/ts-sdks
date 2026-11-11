// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { optimize, type XastElement } from 'svgo';

const SVG_EXTENSION_PATTERN: RegExp = /\.svg$/;
const ARTWORK_NOTICE =
	'<!-- Adapted by Suigar from the SuiFrens Display System by Mysten Labs. -->';
const GENERATED_HEADER = '// Copyright (c) Suigar\n// SPDX-License-Identifier: Apache-2.0\n\n';
const GENERATED_DIR = 'src/generated';
const OUTPUT_DIR = join(GENERATED_DIR, 'accessory-assets');
const MANIFEST_PATH = join(GENERATED_DIR, 'accessory-asset-manifest.ts');

function renderSymbol(markup: string, prefix: string, part: string, role?: string) {
	const roles = new Set<string>();
	let selectedGroup: XastElement | undefined;
	const { data } = optimize(markup, {
		floatPrecision: 2,
		// Preserve group boundaries until the symbol's animated part is selected.
		plugins: [
			'removeDoctype',
			'removeXMLProcInst',
			{ name: 'removeComments', params: { preservePatterns: false } },
			'cleanupAttrs',
			'cleanupNumericValues',
			{ name: 'convertPathData', params: { applyTransforms: false } },
			{ name: 'removeAttrs', params: { attrs: 'data-reactroot' } },
			'removeXlink',
			{
				name: 'collect-limb-groups',
				fn: () => ({
					element: {
						enter: (node) => {
							if (node.name !== 'g') {
								return;
							}
							for (const candidate of ['body', 'backleg', 'frontleg']) {
								if (node.attributes['id']?.includes(candidate)) {
									roles.add(candidate);
								}
							}
							if (role && !selectedGroup && node.attributes['id']?.includes(role)) {
								selectedGroup = node;
							}
						},
					},
				}),
			},
			{
				name: 'prefixIds',
				params: { prefix: `${prefix}-${part}`, delim: '-' },
			},
			{
				name: 'create-accessory-symbol',
				fn: () => ({
					root: {
						exit: (root) => {
							const svg = root.children.find(
								(node) => node.type === 'element' && node.name === 'svg',
							);
							if (!svg || svg.type !== 'element') {
								throw new Error('Expected an SVG root element');
							}
							if (role) {
								if (!selectedGroup) {
									throw new Error(`Missing ${role} group for ${prefix}`);
								}
								svg.children = [selectedGroup];
							}
							svg.name = 'symbol';
							svg.attributes = { id: part, viewBox: '0 0 3000 3000' };
							root.children = [svg];
						},
					},
				}),
			},
		],
	});
	return { svg: data, roles };
}

await rm(OUTPUT_DIR, { recursive: true, force: true });
await mkdir(OUTPUT_DIR, { recursive: true });
await mkdir(GENERATED_DIR, { recursive: true });

const MANIFEST_IMPORTS: Array<string> = [];
const MANIFEST_ENTRIES: Array<string> = [];
const SPLIT_LIMB_ASSET_NAMES: Array<string> = [];

// Inline imports stay separate so external-SVG consumers only bundle kit templates.
const SOURCE_DIR = 'src/accessories';
const INLINE_IMPORTS: Array<string> = [];
const KIT_IMPORTS: Array<string> = [];
const INLINE_ENTRIES: Array<string> = [];
const KIT_ENTRIES: Array<string> = [];

async function readLayers(
	source: string,
	imports: Array<string>,
	entries: Array<string>,
): Promise<Record<string, string>> {
	const layers: Record<string, string> = {};
	const fields: Array<string> = [];
	const singleFile = SVG_EXTENSION_PATTERN.test(source);
	const files = singleFile ? [source] : (await readdir(join(SOURCE_DIR, source))).sort();
	for (const file of files) {
		const relativePath = singleFile ? file : source + '/' + file;
		const layer = singleFile ? 'default' : file.replace(SVG_EXTENSION_PATTERN, '');
		const id = 'layer' + imports.length;
		imports.push(`import ${id} from '../accessories/${relativePath}';`);
		fields.push(`${JSON.stringify(layer)}: ${id}`);
		layers[layer] = await readFile(join(SOURCE_DIR, relativePath), 'utf8');
	}
	entries.push(
		`${JSON.stringify(source.replace(SVG_EXTENSION_PATTERN, '').replaceAll('-', ' '))}: { ${fields.join(', ')} }`,
	);
	return layers;
}

const sources = (await readdir(SOURCE_DIR, { withFileTypes: true }))
	.filter(
		(entry) => entry.isDirectory() || (entry.isFile() && SVG_EXTENSION_PATTERN.test(entry.name)),
	)
	.map((entry) => entry.name)
	.sort();

for (const source of sources) {
	const dir = source.replace(SVG_EXTENSION_PATTERN, '');
	if (dir === 'crowns') {
		const entries: Array<string> = [];
		for (const file of (await readdir(join(SOURCE_DIR, dir)))
			.filter((name) => SVG_EXTENSION_PATTERN.test(name))
			.sort()) {
			const svg = await readFile(join(SOURCE_DIR, dir, file));
			const key = JSON.stringify(file.replace(SVG_EXTENSION_PATTERN, ''));
			entries.push(`${key}: "data:image/svg+xml;base64,${svg.toString('base64')}"`);
		}
		await writeFile(
			join(GENERATED_DIR, 'inline-crowns.ts'),
			`${GENERATED_HEADER}export const INLINE_CROWNS: Readonly<Record<string, string>> = {
${entries.join(',\n')}
};
`,
		);
		continue;
	}
	if (dir === 'patterns') {
		for (const pattern of (await readdir(join(SOURCE_DIR, dir))).sort()) {
			await readLayers('patterns/' + pattern, KIT_IMPORTS, KIT_ENTRIES);
		}
		continue;
	}
	const name = dir.replaceAll('-', ' ');
	if (dir.startsWith('runner-') || dir.startsWith('soccer-team-')) {
		await readLayers(source, KIT_IMPORTS, KIT_ENTRIES);
		continue;
	}
	const layers = await readLayers(source, INLINE_IMPORTS, INLINE_ENTRIES);
	const symbols: Array<string> = [];
	const baseLayer = layers['default'];
	if (!baseLayer) {
		throw new Error(`Missing default SVG layer for ${name}`);
	}
	const notice = Object.values(layers).some((layer) => layer.includes(ARTWORK_NOTICE))
		? ARTWORK_NOTICE
		: '';
	const base = renderSymbol(baseLayer, dir, 'default');
	const canSplitLegs =
		base.roles.has('body') && base.roles.has('backleg') && base.roles.has('frontleg');
	const canSplitFeet =
		!base.roles.has('body') && base.roles.has('backleg') && base.roles.has('frontleg');

	if (canSplitLegs || canSplitFeet) {
		SPLIT_LIMB_ASSET_NAMES.push(name);
		const parts = canSplitLegs
			? ([
					['body', 'body'],
					['rightLeg', 'backleg'],
					['leftLeg', 'frontleg'],
				] as const)
			: ([
					['rightLeg', 'backleg'],
					['leftLeg', 'frontleg'],
				] as const);
		for (const [part, role] of parts) {
			symbols.push(renderSymbol(baseLayer, dir, part, role).svg);
		}
	} else {
		for (const key of ['default', 'body', 'left', 'right']) {
			symbols.push(
				key === 'default' ? base.svg : renderSymbol(layers[key] ?? baseLayer, dir, key).svg,
			);
		}
	}

	const filename = `${dir}.svg`;
	await writeFile(
		join(OUTPUT_DIR, filename),
		`<svg xmlns="http://www.w3.org/2000/svg">${notice}${symbols.join('')}</svg>`,
	);
	const assetId = dir.replaceAll('-', '_').replace(/^([0-9])/, '_$1');
	MANIFEST_IMPORTS.push(`import ${assetId} from './accessory-assets/${filename}?url';`);
	MANIFEST_ENTRIES.push(`${JSON.stringify(name)}: ${assetId}`);
}

const MANIFEST = `${MANIFEST_IMPORTS.join('\n')}

export const SPLIT_LIMB_ASSET_NAMES = new Set<string>(${JSON.stringify(
	SPLIT_LIMB_ASSET_NAMES,
)} as const);

export const ACCESSORY_ASSET_MANIFEST = {
  ${MANIFEST_ENTRIES.join(',\n  ')}
} as const satisfies Record<string, string>;
`;

await writeFile(MANIFEST_PATH, GENERATED_HEADER + MANIFEST);

for (const [file, imports, entries] of [
	['inline-artwork', INLINE_IMPORTS, INLINE_ENTRIES],
	['kit-artwork', KIT_IMPORTS, KIT_ENTRIES],
] as const) {
	await writeFile(
		join(GENERATED_DIR, `${file}.ts`),
		`${GENERATED_HEADER}${imports.join('\n')}\nexport const ARTWORK: Readonly<Record<string, Readonly<Record<string,string>>>> = {\n${entries.join(',\n')}\n};\n`,
	);
}
