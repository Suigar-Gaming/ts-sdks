// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { test } from 'vitest';
import manifest from '../../package.json' with { type: 'json' };

const EXTERNAL_SVG_URL_PATTERN: RegExp = /file:.*\.svg/u;
const EXTERNAL_SVG_FRAGMENT_PATTERN: RegExp = /(?:href|xlink:href)="(file:[^"#]+\.svg)#([^"]+)"/giu;
const CLIP_PATH_PATTERN: RegExp = /clipPath|clip-path/u;
const PATH_ELEMENT_PATTERN: RegExp = /<path\b/gu;

const root = new URL('../../', import.meta.url);

test.each(Object.entries(manifest.exports))(
	'published entry %s and its declaration file resolve',
	async (entry, paths) => {
		assert.ok(existsSync(new URL(paths.types, root)), `${entry}: missing declarations`);
		const exported: unknown = await import(`${manifest.name}${entry.slice(1)}`);
		assert.equal(typeof exported, 'object');
		assert.ok(exported != null);
		assert.ok(typeof exported === 'object');
		assert.ok(
			!Object.hasOwn(exported, 'SOCCER_TEAM_SIDES'),
			`${entry}: internal soccer sides leaked`,
		);
		assert.ok(
			!Object.hasOwn(exported, 'SOCCER_TEAM_PATTERNS'),
			`${entry}: internal soccer patterns leaked`,
		);
	},
);

test('built inline and asset renderers preserve custom kits for both species and sides', async () => {
	const { ACCESSORIES: accessories } = await import('@suigar/suifrens-display-system/accessories');
	const { resolveSoccerTeamKit } = await import('@suigar/suifrens-display-system/kits');
	const kit = {
		code: 'CLUB',
		primary: '#123456',
		secondary: '#fedcba',
		accent: '#abcdef',
		pattern: 'vertical',
	} as const;
	for (const [SuiFrenImage, assertAssets] of [
		[
			(await import('@suigar/suifrens-display-system/image-inline')).SuiFrenImageInline,
			assertInlineAssets,
		],
		[(await import('@suigar/suifrens-display-system')).SuiFrenImage, assertExternalAssets],
	] as const) {
		for (const shape of [{ earShape: 'default' }, { finStyle: 'classic' }] as const) {
			for (const side of ['home', 'away'] as const) {
				const gear = accessories
					.filter((item) =>
						['soccer team shirt', 'soccer team swim trunks', 'left goth boot'].includes(item.name),
					)
					.map((item) => ({
						...item,
						renderOptions: { kit: { type: 'soccer' as const, team: kit, side } },
					}));
				const svg = renderToStaticMarkup(
					createElement(SuiFrenImage, {
						attributes: {
							mainColor: '6fbbee',
							secondaryColor: 'e6fbff',
							skin: 'basic',
							expression: 'happy',
							...shape,
						},
						accessories: gear,
					}),
				);
				assert.ok(svg.includes('shirt-body-CLUB'), 'custom team identity must survive bundling');
				assert.ok(svg.includes(kit.primary));
				assert.ok(svg.includes(kit.secondary));
				assertAssets(svg);
			}
		}
	}
	assert.equal(resolveSoccerTeamKit('FR').code, 'FR');
	assert.equal(resolveSoccerTeamKit({ code: 'BAD', primary: 'invalid' }).code, 'US');
});

test('historical root species renderers remain exported', async () => {
	const library = await import('@suigar/suifrens-display-system');
	assert.equal(typeof library.CapyImage, 'function');
	assert.equal(typeof library.BullsharkImage, 'function');
});

test('built goth boot assets contain only the selected boot without clipping', async () => {
	const { ACCESSORIES: accessories } = await import('@suigar/suifrens-display-system/accessories');
	const { SuiFrenImage } = await import('@suigar/suifrens-display-system');
	for (const side of ['left', 'right']) {
		const svg = renderToStaticMarkup(
			createElement(SuiFrenImage, {
				attributes: {
					mainColor: '6fbbee',
					secondaryColor: 'e6fbff',
					skin: 'basic',
					expression: 'happy',
					earShape: 'default',
				},
				accessories: accessories.filter((item) => item.name === `${side} goth boot`),
			}),
		);
		const references = [...svg.matchAll(EXTERNAL_SVG_FRAGMENT_PATTERN)];
		assert.ok(references.length > 0);
		for (const [, url] of references) {
			assert.ok(typeof url === 'string');
			assert.notEqual(url, '');
			const asset = readFileSync(new URL(url), 'utf8');
			assert.doesNotMatch(asset, CLIP_PATH_PATTERN);
			assert.equal(Array.from(asset.matchAll(PATH_ELEMENT_PATTERN)).length, 20);
			assert.equal(asset.split(`data-boot-side="${side}"`).length - 1, 4);
		}
	}
});

test('built runner kits preserve configurable bibs and native limbs in every renderer and species', async () => {
	const { buildRunnerAccessories } = await import('@suigar/suifrens-display-system/kits');
	for (const SuiFrenImage of [
		(await import('@suigar/suifrens-display-system/image-inline')).SuiFrenImageInline,
		(await import('@suigar/suifrens-display-system')).SuiFrenImage,
	] as const) {
		for (const shape of [{ earShape: 'default' }, { finStyle: 'classic' }] as const) {
			const svg = renderToStaticMarkup(
				createElement(SuiFrenImage, {
					attributes: {
						mainColor: '6fbbee',
						secondaryColor: 'e6fbff',
						skin: 'basic',
						expression: 'happy',
						...shape,
					},
					accessories: buildRunnerAccessories({ color: '#123456', number: 9, mirrorBib: true }),
				}),
			);
			assert.ok(svg.includes('#123456'));
			assert.ok(svg.includes('>9</text>'));
			assert.ok(svg.includes('runner-shorts-frontleg'));
			assert.ok(svg.includes('runner-shoes-backleg'));
			assert.ok(svg.includes('runner-headband-head'));
			assert.ok(svg.includes('translate(393 0) scale(-1 1)'));
		}
	}
});

test('published data catalogues use uppercase export names', async () => {
	const catalogue = await import('@suigar/suifrens-display-system/accessories');
	const palette = await import('@suigar/suifrens-display-system/colors');
	const attributes = await import('@suigar/suifrens-display-system/attributes');
	assert.ok(catalogue.ACCESSORIES.length > 0);
	assert.ok(catalogue.VIP_CROWN_ACCESSORIES.length > 0);
	assert.equal(palette.COLORS.ffffff, 'White');
	assert.equal(attributes.EAR_GENE_TO_EAR_SHAPE['ear1'], 'default');
	assert.ok(!('accessories' in catalogue));
	assert.ok(!('vipCrownAccessories' in catalogue));
	assert.ok(!('colors' in palette));
	assert.ok(!('earGeneToEarShape' in attributes));
});

function assertInlineAssets(svg: string): void {
	assert.doesNotMatch(svg, EXTERNAL_SVG_URL_PATTERN);
}

function assertExternalAssets(svg: string): void {
	const references = [...svg.matchAll(EXTERNAL_SVG_FRAGMENT_PATTERN)];
	assert.ok(references.length > 0, 'asset renderer must reference emitted SVGs');
	for (const [, url] of references) {
		assert.ok(typeof url === 'string');
		assert.notEqual(url, '');
		assert.ok(existsSync(new URL(url)), `missing asset ${url}`);
	}
}
