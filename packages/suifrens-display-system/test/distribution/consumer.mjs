import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { accessories } from '@suigar/suifrens-display-system/accessories';
import { SuiFrenImage as Assets } from '@suigar/suifrens-display-system/image';
import { SuiFrenImage as Inline } from '@suigar/suifrens-display-system/image-inline';

for (const kind of ['capy', 'bullshark']) {
	const props = {
		attributes: {
			mainColor: '6FBBEE',
			secondaryColor: 'E6FBFF',
			skin: 'basic',
			expression: 'happy',
			...(kind === 'capy' ? { earShape: 'default' } : { finStyle: 'classic' }),
		},
		accessories: accessories.filter((item) => item.name === 'left goth boot'),
	};
	const inline = renderToStaticMarkup(createElement(Inline, props));
	assert.match(inline, /<svg/);
	assert.doesNotMatch(inline, /file:.*\.svg/);
	const external = renderToStaticMarkup(createElement(Assets, props));
	const refs = [...external.matchAll(/href="(file:[^"#]+\.svg)#([^"]+)"/gi)];
	assert.ok(refs.length, 'expected an external SVG reference');
	for (const [, file, id] of refs) {
		const svg = await readFile(new URL(file), 'utf8');
		assert.ok(svg.includes(`id="${id}"`), `missing fragment ${id} in ${file}`);
	}
}
