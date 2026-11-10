// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
	BETWEEN_TAGS_WHITESPACE_PATTERN,
	SVG_WRAPPER_PATTERN,
	WHITESPACE_PATTERN,
} from '../src/constants/svg-patterns.ts';

const DECIMAL_NUMBER_PATTERN: RegExp = /-?\d+\.\d+/g;
const EMPTY_REACT_ROOT_PATTERN: RegExp = /\s?data-reactroot=""/g;
const ZERO_FRACTION_PATTERN: RegExp = /\.0+$/;
const TRAILING_FRACTION_ZEROS_PATTERN: RegExp = /(\.\d*?)0+$/;
const NEGATIVE_ZERO_PATTERN: RegExp = /^-0$/;
const NEGATIVE_FRACTION_PREFIX_PATTERN: RegExp = /^-0\./;
const FRACTION_PREFIX_PATTERN: RegExp = /^0\./;
const SVG_ID_PATTERN: RegExp = /id="([^"]+)"/g;
const SVG_URL_REFERENCE_PATTERN: RegExp = /url\(#([^)]+)\)/g;
const SVG_HREF_REFERENCE_PATTERN: RegExp = /(href|xlink:href)="#([^"]+)"/g;
const GROUP_TAG_PATTERN: RegExp = /<\/?g\b[^>]*>/g;
const SVG_EXTENSION_PATTERN: RegExp = /\.svg$/;
const ARTWORK_NOTICE =
	'<!-- Adapted by Suigar from the SuiFrens Display System by Mysten Labs. -->';
const GENERATED_HEADER = '// Copyright (c) Suigar\n// SPDX-License-Identifier: Apache-2.0\n\n';
const GENERATED_DIR = 'src/generated';
const OUTPUT_DIR = join(GENERATED_DIR, 'accessory-assets');
const MANIFEST_PATH = join(GENERATED_DIR, 'accessory-asset-manifest.ts');

function minifySvg(markup: string): string {
	let svg = markup
		.replace(ARTWORK_NOTICE, '')
		.replace(WHITESPACE_PATTERN, ' ')
		.replace(BETWEEN_TAGS_WHITESPACE_PATTERN, '><')
		.replace(DECIMAL_NUMBER_PATTERN, (match) => formatSvgNumber(Number(match)))
		.replace(EMPTY_REACT_ROOT_PATTERN, '')
		.trim();

	if (svg.startsWith('<svg') && !svg.includes('xmlns=')) {
		svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
	}

	return svg;
}

function formatSvgNumber(value: number): string {
	if (!Number.isFinite(value)) {
		return String(value);
	}

	const rounded = value.toFixed(2);
	return rounded
		.replace(ZERO_FRACTION_PATTERN, '')
		.replace(TRAILING_FRACTION_ZEROS_PATTERN, '$1')
		.replace(NEGATIVE_ZERO_PATTERN, '0')
		.replace(NEGATIVE_FRACTION_PREFIX_PATTERN, '-.')
		.replace(FRACTION_PREFIX_PATTERN, '.');
}

function extractSvgContent(markup: string): string {
	return markup.replace(SVG_WRAPPER_PATTERN, '');
}

function scopeSvgReferences(markup: string, prefix: string): string {
	return markup
		.replace(SVG_ID_PATTERN, `id="${prefix}-$1"`)
		.replace(SVG_URL_REFERENCE_PATTERN, `url(#${prefix}-$1)`)
		.replace(SVG_HREF_REFERENCE_PATTERN, `$1="#${prefix}-$2"`);
}

function extractGroupByRole(markup: string, role: string): string | undefined {
	const idMatch = markup.matchAll(SVG_ID_PATTERN).find((match) => match[1]?.includes(role));
	if (!idMatch) {
		return undefined;
	}

	const start = markup.lastIndexOf('<g', idMatch.index);
	if (start === -1) {
		return undefined;
	}

	const tagMatcher = new RegExp(GROUP_TAG_PATTERN);
	tagMatcher.lastIndex = start;
	let depth = 0;
	for (let match = tagMatcher.exec(markup); match; match = tagMatcher.exec(markup)) {
		if (match[0].startsWith('</')) {
			depth -= 1;
			if (depth === 0) {
				return markup.slice(start, tagMatcher.lastIndex);
			}
		} else {
			depth += 1;
		}
	}

	return undefined;
}

await rm(OUTPUT_DIR, { recursive: true, force: true });
await mkdir(OUTPUT_DIR, { recursive: true });
await mkdir(GENERATED_DIR, { recursive: true });

const MANIFEST_IMPORTS: Array<string> = [];
const MANIFEST_ENTRIES: Array<string> = [];
const SPLIT_LIMB_ASSET_NAMES: Array<string> = [];

// Inline imports stay separate so external-SVG consumers only bundle kit templates.
const SOURCE_DIR = 'src/accessories/artwork';
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
	const singleFile = source.endsWith('.svg');
	const files = singleFile ? [source] : (await readdir(join(SOURCE_DIR, source))).sort();
	for (const file of files) {
		const relativePath = singleFile ? file : source + '/' + file;
		const layer = singleFile ? 'default' : file.replace(SVG_EXTENSION_PATTERN, '');
		const id = 'layer' + imports.length;
		imports.push(`import ${id} from '../accessories/artwork/${relativePath}';`);
		fields.push(`${JSON.stringify(layer)}: ${id}`);
		layers[layer] = await readFile(join(SOURCE_DIR, relativePath), 'utf8');
	}
	entries.push(
		`${JSON.stringify(source.replace(SVG_EXTENSION_PATTERN, '').replaceAll('-', ' '))}: { ${fields.join(', ')} }`,
	);
	return layers;
}

for (const source of (await readdir(SOURCE_DIR)).sort()) {
	const dir = source.replace(SVG_EXTENSION_PATTERN, '');
	if (dir === 'crowns') {
		const entries: Array<string> = [];
		for (const file of (await readdir(join(SOURCE_DIR, dir)))
			.filter((name) => name.endsWith('.svg'))
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
	const baseContent = extractSvgContent(minifySvg(baseLayer));
	const bodyGroup = extractGroupByRole(baseContent, 'body');
	const rightLegGroup = extractGroupByRole(baseContent, 'backleg');
	const leftLegGroup = extractGroupByRole(baseContent, 'frontleg');
	const canSplitLegs = bodyGroup && rightLegGroup && leftLegGroup;
	const canSplitFeet = !bodyGroup && rightLegGroup && leftLegGroup;

	if (canSplitLegs || canSplitFeet) {
		SPLIT_LIMB_ASSET_NAMES.push(name);
		const parts = canSplitLegs
			? ([
					['body', bodyGroup],
					['rightLeg', rightLegGroup],
					['leftLeg', leftLegGroup],
				] as const)
			: ([
					['rightLeg', rightLegGroup],
					['leftLeg', leftLegGroup],
				] as const);
		for (const [part, group] of parts) {
			symbols.push(
				`<symbol id="${part}" viewBox="0 0 3000 3000">${scopeSvgReferences(
					group,
					`${dir}-${part}`,
				)}</symbol>`,
			);
		}
	} else {
		for (const key of ['default', 'body', 'left', 'right']) {
			const svg = minifySvg(layers[key] ?? baseLayer);
			const content = scopeSvgReferences(extractSvgContent(svg), `${dir}-${key}`);
			symbols.push(`<symbol id="${key}" viewBox="0 0 3000 3000">${content}</symbol>`);
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
