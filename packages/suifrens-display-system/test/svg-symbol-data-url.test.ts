// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest';
import { resolveEmbeddedSvgSymbolSource } from '../src/components/accessories/svgSymbolDataUrl.js';

const SPRITE_MARKUP = [
	'<svg xmlns="http://www.w3.org/2000/svg">',
	'<defs><linearGradient id="paint"><stop offset="0" stop-color="red" /></linearGradient></defs>',
	'<symbol id="leftLeg" viewBox="0 0 3000 3000"><path data-symbol="left" fill="url(#paint)" /></symbol>',
	'<symbol id="rightLeg" viewBox="0 0 3000 3000"><path data-symbol="right" /></symbol>',
	'</svg>',
].join('');

const toEncodedDataUrl = (markup: string) => `data:image/svg+xml,${encodeURIComponent(markup)}`;

const parseResolvedSvg = (source: string) => {
	const commaIndex = source.indexOf(',');
	return new DOMParser().parseFromString(
		decodeURIComponent(source.slice(commaIndex + 1)),
		'image/svg+xml',
	);
};

describe('resolveEmbeddedSvgSymbolSource', () => {
	it('extracts only the requested symbol into a standalone SVG image', () => {
		const resolved = resolveEmbeddedSvgSymbolSource(toEncodedDataUrl(SPRITE_MARKUP), 'leftLeg');

		expect(resolved).toMatch(/^data:image\/svg\+xml,/);
		const document = parseResolvedSvg(resolved!);
		expect(document.documentElement.tagName).toBe('svg');
		expect(document.documentElement.getAttribute('viewBox')).toBe('0 0 3000 3000');
		expect(document.querySelector('[data-symbol="left"]')).not.toBeNull();
		expect(document.querySelector('[data-symbol="right"]')).toBeNull();
		expect(document.querySelector('#paint')).not.toBeNull();
		expect(document.querySelector('symbol')).toBeNull();
	});

	it('supports base64-encoded SVG sprites', () => {
		const base64Source = `data:image/svg+xml;base64,${btoa(SPRITE_MARKUP)}`;
		const resolved = resolveEmbeddedSvgSymbolSource(base64Source, 'rightLeg');

		expect(parseResolvedSvg(resolved!).querySelector('[data-symbol="right"]')).not.toBeNull();
	});

	it('keeps normal file URLs on the existing fragment path', () => {
		expect(resolveEmbeddedSvgSymbolSource('/assets/dress-shoes.svg', 'rightLeg')).toBeUndefined();
	});

	it('fails closed for malformed sprites and missing symbols', () => {
		expect(resolveEmbeddedSvgSymbolSource('data:image/svg+xml,not-svg', 'rightLeg')).toBeNull();
		expect(resolveEmbeddedSvgSymbolSource(toEncodedDataUrl(SPRITE_MARKUP), 'missing')).toBeNull();
	});
});
