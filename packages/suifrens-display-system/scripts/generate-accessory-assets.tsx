import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import type { AccessoryRendererProps } from '../src/components/accessories/AccessorySlot.js';
import { ACCESSORY_RENDERERS } from '../src/components/accessories/inlineRegistry.js';
import type { AccessoryMetadata } from '../src/utils/accessoryUtils.js';

const OUTPUT_DIR = 'src/generated/accessory-assets';
const MANIFEST_PATH = 'src/generated/accessoryAssetManifest.ts';

const VARIANTS = [
	{ key: 'default', props: {} },
	{ key: 'body', props: { body: true } },
	{ key: 'left', props: { lor: 'left' as const } },
	{ key: 'right', props: { lor: 'right' as const } },
];

function slugify(value: string) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

function minifySvg(markup: string) {
	let svg = markup
		.replace(/\s+/g, ' ')
		.replace(/>\s+</g, '><')
		.replace(/-?\d+\.\d+/g, (match) => formatSvgNumber(Number(match)))
		.replace(/\s?data-reactroot=""/g, '')
		.trim();

	if (svg.startsWith('<svg') && !svg.includes('xmlns=')) {
		svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
	}

	return svg;
}

function formatSvgNumber(value: number) {
	if (!Number.isFinite(value)) {
		return String(value);
	}

	const rounded = value.toFixed(2);
	return rounded
		.replace(/\.0+$/, '')
		.replace(/(\.\d*?)0+$/, '$1')
		.replace(/^-0$/, '0')
		.replace(/^-0\./, '-.')
		.replace(/^0\./, '.');
}

function importName(accessoryName: string) {
	const parts = accessoryName
		.replace(/[^a-zA-Z0-9]+/g, ' ')
		.trim()
		.split(/\s+/);
	const name = parts
		.map((part, index) =>
			index === 0
				? part.charAt(0).toLowerCase() + part.slice(1)
				: part.charAt(0).toUpperCase() + part.slice(1),
		)
		.join('');
	return /^[0-9]/.test(name) ? `asset${name}` : name;
}

function extractSvgContent(markup: string) {
	return markup.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
}

function scopeSvgReferences(markup: string, prefix: string) {
	return markup
		.replace(/id="([^"]+)"/g, `id="${prefix}-$1"`)
		.replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`)
		.replace(/(href|xlink:href)="#([^"]+)"/g, `$1="#${prefix}-$2"`);
}

function extractGroupByRole(markup: string, role: string) {
	const idMatch = new RegExp(`id="[^"]*${role}[^"]*"`).exec(markup);
	if (!idMatch) {
		return undefined;
	}

	const start = markup.lastIndexOf('<g', idMatch.index);
	if (start === -1) {
		return undefined;
	}

	const tagMatcher = /<\/?g\b[^>]*>/g;
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

function makeAccessory(name: string): AccessoryMetadata {
	return {
		name,
		type: 'generated',
		category: 'generated',
		renderOptions: {},
		price: 0,
		quantity: null,
		description: '',
		collection: '',
	};
}

await rm(OUTPUT_DIR, { recursive: true, force: true });
await mkdir(OUTPUT_DIR, { recursive: true });
await mkdir('src/generated', { recursive: true });

const imports: Array<string> = [];
const manifestEntries: Array<string> = [];
const splitLimbAssetNames: Array<string> = [];

for (const [name, renderer] of Object.entries(ACCESSORY_RENDERERS).sort(([left], [right]) =>
	left.localeCompare(right),
)) {
	const symbols: Array<string> = [];
	const baseProps: AccessoryRendererProps = {
		accessory: makeAccessory(name),
		species: 'capy',
	};
	const baseContent = extractSvgContent(minifySvg(renderToStaticMarkup(renderer(baseProps))));
	const bodyGroup = extractGroupByRole(baseContent, 'body');
	const rightLegGroup = extractGroupByRole(baseContent, 'backleg');
	const leftLegGroup = extractGroupByRole(baseContent, 'frontleg');
	const canSplitLegs = bodyGroup && rightLegGroup && leftLegGroup;
	const canSplitFeet = !bodyGroup && rightLegGroup && leftLegGroup;

	if (canSplitLegs || canSplitFeet) {
		splitLimbAssetNames.push(name);
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
					`${slugify(name)}-${part}`,
				)}</symbol>`,
			);
		}
	} else {
		for (const variant of VARIANTS) {
			const props: AccessoryRendererProps = {
				accessory: makeAccessory(name),
				species: 'capy',
				...variant.props,
			};
			const svg = minifySvg(renderToStaticMarkup(renderer(props)));
			const content = scopeSvgReferences(extractSvgContent(svg), `${slugify(name)}-${variant.key}`);
			symbols.push(`<symbol id="${variant.key}" viewBox="0 0 3000 3000">${content}</symbol>`);
		}
	}

	const filename = `${slugify(name)}.svg`;
	const importId = importName(name);
	await writeFile(
		join(OUTPUT_DIR, filename),
		`<svg xmlns="http://www.w3.org/2000/svg">${symbols.join('')}</svg>`,
	);
	imports.push(`import ${importId} from "./accessory-assets/${filename}";`);
	manifestEntries.push(`${JSON.stringify(name)}: new URL(${importId}, import.meta.url).href`);
}

const manifest = `${imports.join('\n')}

export type AccessoryAssetVariant = "default" | "body" | "left" | "right" | "leftLeg" | "rightLeg";

export const SPLIT_LIMB_ASSET_NAMES = new Set<string>(${JSON.stringify(
	splitLimbAssetNames,
)} as const);

export const ACCESSORY_ASSET_MANIFEST = {
  ${manifestEntries.join(',\n  ')}
} as const satisfies Record<string, string>;
`;

await writeFile(MANIFEST_PATH, manifest);
