import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as root from '@suigar/suifrens-display-system';
import { SuiFrenImage as Assets } from '@suigar/suifrens-display-system';
import { accessories } from '@suigar/suifrens-display-system/accessories';
import * as catalogue from '@suigar/suifrens-display-system/accessories';
import * as battle from '@suigar/suifrens-display-system/battle';
import * as expressions from '@suigar/suifrens-display-system/expressions';
import { SuiFrenImageInline as Inline } from '@suigar/suifrens-display-system/image-inline';
import * as kits from '@suigar/suifrens-display-system/kits';

assert.deepEqual(Object.keys(root).sort(), ['BullsharkImage', 'CapyImage', 'SuiFrenImage']);
assert.equal(typeof battle.useDuelScript, 'function');
assert.ok(expressions.ALL_CAPY_EXPRESSIONS.length);
assert.equal(typeof kits.buildRunnerAccessories, 'function');
assert.ok(!('buildRunnerAccessories' in catalogue));

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
