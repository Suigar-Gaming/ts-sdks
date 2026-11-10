// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { accessories } from '../../../../src/accessories/index.js';
import { InlineAccessory } from '../../../../src/components/accessories/index.js';

test('individual goth boots contain only the requested geometry, without clipping', () => {
	const both = document.createElement('div');
	both.innerHTML = renderToStaticMarkup(
		<InlineAccessory
			species="capy"
			accessory={accessories.find((item) => item.name === 'goth boots')!}
		/>,
	);
	const paths = [...both.querySelectorAll('path')];
	expect(paths).toHaveLength(10);
	for (const side of ['left', 'right'] as const) {
		const container = document.createElement('div');
		container.innerHTML = renderToStaticMarkup(
			<InlineAccessory
				species="capy"
				accessory={accessories.find((item) => item.name === side + ' goth boot')!}
			/>,
		);
		expect(container.querySelector('clipPath')).toBeNull();
		expect(container.querySelectorAll(`[data-boot-side="${side}"] path`)).toHaveLength(5);
		const expected = paths.slice(side === 'right' ? 0 : 5, side === 'right' ? 5 : 10);
		expect([...container.querySelectorAll('path')].map((path) => path.outerHTML)).toEqual(
			expected.map((path) => path.outerHTML),
		);
	}
});

test.each(['left', 'right'])('generated %s goth boot symbols exclude the opposite boot', (side) => {
	const svg = readFileSync(`src/generated/accessory-assets/${side}-goth-boot.svg`, 'utf8');
	const container = document.createElement('div');
	container.innerHTML = svg;
	for (const symbol of container.querySelectorAll('symbol')) {
		expect(symbol.querySelector('clipPath')).toBeNull();
		expect(symbol.querySelectorAll(`[data-boot-side="${side}"] path`)).toHaveLength(5);
		expect(symbol.querySelectorAll('path')).toHaveLength(5);
	}
});
