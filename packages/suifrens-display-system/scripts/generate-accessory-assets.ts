import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const OUTPUT_DIR = 'src/generated/accessory-assets';
const MANIFEST_PATH = 'src/generated/accessoryAssetManifest.ts';

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

await rm(OUTPUT_DIR, { recursive: true, force: true });
await mkdir(OUTPUT_DIR, { recursive: true });
await mkdir('src/generated', { recursive: true });

const manifestEntries: Array<string> = [];
const splitLimbAssetNames: Array<string> = [];

// Inline imports stay separate so external-SVG consumers only bundle kit templates.
const sourceDir = 'src/assets/accessories';
const inlineImports: Array<string> = [];
const kitImports: Array<string> = [];
const inlineEntries: Array<string> = [];
const kitEntries: Array<string> = [];

async function readLayers(source: string, imports: Array<string>, entries: Array<string>) {
	const layers: Record<string, string> = {};
	const fields: Array<string> = [];
	const singleFile = source.endsWith('.svg');
	const files = singleFile ? [source] : (await readdir(join(sourceDir, source))).sort();
	for (const file of files) {
		const relativePath = singleFile ? file : source + '/' + file;
		const layer = singleFile ? 'default' : file.replace(/\.svg$/, '');
		const id = 'layer' + imports.length;
		imports.push(`import ${id} from '../assets/accessories/${relativePath}';`);
		fields.push(`${JSON.stringify(layer)}: ${id}`);
		layers[layer] = await readFile(join(sourceDir, relativePath), 'utf8');
	}
	entries.push(
		`${JSON.stringify(source.replace(/\.svg$/, '').replaceAll('-', ' '))}: { ${fields.join(', ')} }`,
	);
	return layers;
}

for (const source of (await readdir(sourceDir)).sort()) {
	const dir = source.replace(/\.svg$/, '');
	if (dir === 'crowns') continue;
	if (dir === 'patterns') {
		for (const pattern of (await readdir(join(sourceDir, dir))).sort()) {
			await readLayers('patterns/' + pattern, kitImports, kitEntries);
		}
		continue;
	}
	const name = dir.replaceAll('-', ' ');
	if (dir.startsWith('runner-') || dir.startsWith('soccer-team-')) {
		await readLayers(source, kitImports, kitEntries);
		continue;
	}
	const layers = await readLayers(source, inlineImports, inlineEntries);
	const symbols: Array<string> = [];
	const baseContent = extractSvgContent(minifySvg(layers['default']));
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
					`${dir}-${part}`,
				)}</symbol>`,
			);
		}
	} else {
		for (const key of ['default', 'body', 'left', 'right']) {
			const svg = minifySvg(layers[key] ?? layers['default']);
			const content = scopeSvgReferences(extractSvgContent(svg), `${dir}-${key}`);
			symbols.push(`<symbol id="${key}" viewBox="0 0 3000 3000">${content}</symbol>`);
		}
	}

	const filename = `${dir}.svg`;
	await writeFile(
		join(OUTPUT_DIR, filename),
		`<svg xmlns="http://www.w3.org/2000/svg">${symbols.join('')}</svg>`,
	);
	manifestEntries.push(
		`${JSON.stringify(name)}: new URL("./accessory-assets/${filename}", import.meta.url).href`,
	);
}

const manifest = `export const SPLIT_LIMB_ASSET_NAMES = new Set<string>(${JSON.stringify(
	splitLimbAssetNames,
)} as const);

export const ACCESSORY_ASSET_MANIFEST = {
  ${manifestEntries.join(',\n  ')}
} as const satisfies Record<string, string>;
`;

await writeFile(MANIFEST_PATH, manifest);

for (const [file, imports, entries] of [
	['inlineArtwork', inlineImports, inlineEntries],
	['kitArtwork', kitImports, kitEntries],
] as const) {
	await writeFile(
		`src/generated/${file}.ts`,
		`${imports.join('\n')}\nexport const artwork: Readonly<Record<string, Readonly<Record<string,string>>>> = {\n${entries.join(',\n')}\n};\n`,
	);
}
