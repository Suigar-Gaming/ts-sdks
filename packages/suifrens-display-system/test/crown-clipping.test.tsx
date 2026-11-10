// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import {
	getVipCrownAssetSrc,
	getVipCrownAssetViewport,
} from '../src/components/accessories/crownAssets.js';
import { SuiFrenImage } from '../src/components/SuiFrenImage.js';
import { SuiFrenImageAssets } from '../src/components/SuiFrenImageAssets.js';
import { vipCrownAccessories } from '../src/constants/vip-crowns.js';

const common = {
	mainColor: '6FBBEE',
	secondaryColor: 'E6FBFF',
	skin: 'basic',
	expression: 'happy',
} as const;
const species = [
	{ ...common, earShape: 'default' },
	{ ...common, finStyle: 'classic' },
] as const;

test.each(vipCrownAccessories)('$name artwork has room for its tips and ornaments', (accessory) => {
	const source = readFileSync(`src/components/accessories/head/${accessory.name}.svg`, 'utf8');
	const container = document.createElement('div');
	container.innerHTML = source;
	expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe('-200 -600 3209 3609');
	expect(container.querySelector('clipPath, [clip-path]')).toBeNull();
});

test.each([
	['inline', SuiFrenImage],
	['assets', SuiFrenImageAssets],
] as const)(
	'%s preserves avatar framing and crown scale while letting unframed crowns overflow',
	(_name, Renderer) => {
		for (const attributes of species) {
			for (const accessory of vipCrownAccessories) {
				const container = document.createElement('div');
				container.innerHTML = renderToStaticMarkup(
					<Renderer attributes={attributes} accessories={[accessory]} renderSize={64} />,
				);
				const svg = container.querySelector('svg')!;
				expect(svg.getAttribute('viewBox')).toBe('0 -200 3000 3000');
				expect(svg.getAttribute('overflow')).toBe('visible');
				expect(svg.getAttribute('width')).toBe('64');
				const image = svg.querySelector('image')!;
				const viewport = getVipCrownAssetViewport(getVipCrownAssetSrc(accessory.name))!;
				const scaleX = Number(image.getAttribute('width')) / 3209;
				const scaleY = Number(image.getAttribute('height')) / 3609;
				expect(scaleX).toBeCloseTo(3000 / 3009);
				expect(scaleY).toBeCloseTo(scaleX);
				// The old artboard origin still maps to (0, 0), so crown fit is unchanged.
				expect(Number(image.getAttribute('x')) + 200 * scaleX).toBeCloseTo(0);
				expect(Number(image.getAttribute('y')) + 600 * scaleY).toBeCloseTo(0);
				expect(Number(image.getAttribute('y'))).toBe(viewport.y);
			}
		}
	},
);

test.each([SuiFrenImage, SuiFrenImageAssets])(
	'uncrowned portraits retain their framing',
	(Renderer) => {
		const container = document.createElement('div');
		container.innerHTML = renderToStaticMarkup(<Renderer attributes={species[0]} />);
		expect(container.querySelector('svg')?.getAttribute('viewBox')).toBe('0 -200 3000 3000');
		expect(container.querySelector('svg')?.hasAttribute('overflow')).toBe(false);
	},
);

test('custom asset URLs do not inherit the built-in crown viewport', () => {
	expect(getVipCrownAssetViewport('https://example.com/custom-crown.svg')).toBeUndefined();
});

test.each([SuiFrenImage, SuiFrenImageAssets])(
	'adding a crown preserves the native body, head and facial coordinate systems',
	(Renderer) => {
		for (const attributes of species) {
			const bare = document.createElement('div');
			const crowned = document.createElement('div');
			bare.innerHTML = renderToStaticMarkup(<Renderer attributes={attributes} renderSize={64} />);
			crowned.innerHTML = renderToStaticMarkup(
				<Renderer
					attributes={attributes}
					accessories={[vipCrownAccessories.at(-1)!]}
					renderSize={64}
				/>,
			);
			for (const selector of ['svg', 'svg svg', 'path']) {
				const geometry = (container: HTMLElement) =>
					Array.from(container.querySelectorAll(selector), (element) => ({
						viewBox: element.getAttribute('viewBox'),
						d: element.getAttribute('d'),
						transform: element.getAttribute('transform'),
					}));
				expect(geometry(crowned)).toEqual(geometry(bare));
			}
		}
	},
);
