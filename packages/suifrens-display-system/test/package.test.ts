import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { test } from 'vitest';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));

test('all published entry points and declaration files resolve', async () => {
	for (const [entry, paths] of Object.entries(manifest.exports) as Array<
		[string, { import: string; types: string }]
	>) {
		assert.ok(existsSync(new URL(paths.types, root)), `${entry}: missing declarations`);
		await import(`${manifest.name}${entry === '.' ? '' : entry.slice(1)}`);
	}
});

test('built inline and asset renderers preserve custom kits for both species and sides', async () => {
	const { accessories, resolveSoccerTeamKit } = await import(manifest.name + '/accessories');
	const kit = {
		code: 'CLUB',
		primary: '#123456',
		secondary: '#FEDCBA',
		accent: '#ABCDEF',
		pattern: 'vertical',
	};
	for (const entry of ['/image-inline', '/image', '/image-assets']) {
		const { SuiFrenImage } = await import(manifest.name + entry);
		for (const species of ['capy', 'bullshark']) {
			for (const side of ['home', 'away']) {
				const gear = accessories
					.filter((item: { name: string }) =>
						['soccer team shirt', 'soccer team swim trunks', 'left goth boot'].includes(item.name),
					)
					.map((item: object) => ({ ...item, renderOptions: { teamKit: kit, side } }));
				const svg = renderToStaticMarkup(
					createElement(SuiFrenImage, {
						attributes: {
							mainColor: '6FBBEE',
							secondaryColor: 'E6FBFF',
							skin: 'basic',
							expression: 'happy',
							...(species === 'capy' ? { earShape: 'default' } : { finStyle: 'classic' }),
						},
						accessories: gear,
					}),
				);
				assert.ok(svg.includes('shirt-body-CLUB'), 'custom team identity must survive bundling');
				assert.ok(svg.includes(kit.primary));
				assert.ok(svg.includes(kit.secondary));
				if (entry !== '/image-inline') {
					const references = [...svg.matchAll(/(?:href|xlink:href)="(file:[^"]+\.svg)#[^"]+"/g)];
					assert.ok(references.length > 0, 'asset renderer must reference emitted SVGs');
					for (const [, url] of references) {
						assert.ok(existsSync(new URL(url)), `missing asset ${url}`);
					}
				} else {
					assert.doesNotMatch(svg, /file:.*\.svg/);
				}
			}
		}
	}
	assert.equal(resolveSoccerTeamKit('FR').code, 'FR');
	assert.equal(resolveSoccerTeamKit({ code: 'BAD', primary: 'invalid' }).code, 'US');
});

test('historical root species renderers remain exported', async () => {
	const library = await import(manifest.name);
	assert.equal(typeof library.CapyImage, 'function');
	assert.equal(typeof library.BullsharkImage, 'function');
});

test('built goth boot assets contain only the selected boot without clipping', async () => {
	const { accessories } = await import(manifest.name + '/accessories');
	for (const side of ['left', 'right']) {
		for (const entry of ['/image', '/image-assets']) {
			const { SuiFrenImage } = await import(manifest.name + entry);
			const svg = renderToStaticMarkup(
				createElement(SuiFrenImage, {
					attributes: {
						mainColor: '6FBBEE',
						secondaryColor: 'E6FBFF',
						skin: 'basic',
						expression: 'happy',
						earShape: 'default',
					},
					accessories: accessories.filter(
						(item: { name: string }) => item.name === `${side} goth boot`,
					),
				}),
			);
			const references = [...svg.matchAll(/(?:href|xlink:href)="(file:[^"]+\.svg)#[^"]+"/g)];
			assert.ok(references.length > 0);
			for (const [, url] of references) {
				const asset = readFileSync(new URL(url), 'utf8');
				assert.doesNotMatch(asset, /clipPath|clip-path/);
				assert.equal((asset.match(/<path\b/g) ?? []).length, 20);
				assert.equal((asset.match(new RegExp(`data-boot-side="${side}"`, 'g')) ?? []).length, 4);
			}
		}
	}
});

test('built runner kits preserve configurable bibs and native limbs in every renderer and species', async () => {
	const { buildRunnerAccessories } = await import(manifest.name + '/accessories');
	for (const entry of ['/image-inline', '/image', '/image-assets']) {
		const { SuiFrenImage } = await import(manifest.name + entry);
		for (const species of ['capy', 'bullshark']) {
			const svg = renderToStaticMarkup(
				createElement(SuiFrenImage, {
					attributes: {
						mainColor: '6FBBEE',
						secondaryColor: 'E6FBFF',
						skin: 'basic',
						expression: 'happy',
						...(species === 'capy' ? { earShape: 'default' } : { finStyle: 'classic' }),
					},
					accessories: buildRunnerAccessories({ color: '#123456', number: 9, mirrorBib: true }),
				}),
			);
			assert.ok(svg.includes('#123456'));
			assert.match(svg, />9<\/text>/);
			assert.ok(svg.includes('runner-shorts-frontleg'));
			assert.ok(svg.includes('runner-shoes-backleg'));
			assert.ok(svg.includes('runner-headband-head'));
			assert.ok(svg.includes('translate(393 0) scale(-1 1)'));
		}
	}
});
