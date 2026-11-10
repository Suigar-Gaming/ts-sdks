// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { battle, accessories as catalogue, expressions, inline, kits, root } from './entries.mts';
import { EXTERNAL_SVG_FRAGMENT_PATTERN, EXTERNAL_SVG_URL_PATTERN } from './svg-patterns.ts';

test('loads the runtime API from the installed entry points', () => {
	expect(Object.keys(root).sort()).toEqual(['BullsharkImage', 'CapyImage', 'SuiFrenImage']);
	expect(typeof battle.useDuelScript).toBe('function');
	expect(expressions.ALL_CAPY_EXPRESSIONS.length).toBeGreaterThan(0);
	expect(typeof kits.buildRunnerAccessories).toBe('function');
	expect(catalogue).not.toHaveProperty('buildRunnerAccessories');
});

test.each(['capy', 'bullshark'])(
	'renders %s inline and resolves each external SVG fragment',
	async (kind) => {
		const props = {
			attributes: {
				mainColor: '6FBBEE',
				secondaryColor: 'E6FBFF',
				skin: 'basic',
				expression: 'happy',
				...(kind === 'capy' ? { earShape: 'default' } : { finStyle: 'classic' }),
			},
			accessories: catalogue.accessories.filter((item) => item.name === 'left goth boot'),
		};
		const markup = renderToStaticMarkup(createElement(inline.SuiFrenImageInline, props));
		expect(markup).toContain('<svg');
		expect(markup).not.toMatch(EXTERNAL_SVG_URL_PATTERN);
		const external = renderToStaticMarkup(createElement(root.SuiFrenImage, props));
		const refs = [...external.matchAll(EXTERNAL_SVG_FRAGMENT_PATTERN)];
		expect(refs.length).toBeGreaterThan(0);
		for (const [, file, id] of refs) {
			const svg = await readFile(new URL(file), 'utf8');
			expect(svg).toContain(`id="${id}"`);
		}
	},
);
