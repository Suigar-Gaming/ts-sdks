// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, test, vi } from 'vitest';
import { AnimationStore, composePartTransform } from '../src/animation/AnimationStore.js';
import { parseMatrix } from '../src/animation/matrix.js';
import { GothBoots } from '../src/components/accessories/feet/GothBoots.js';
import { SuiFrenImage } from '../src/components/SuiFrenImage.js';
import { SuiFrenImageAssets } from '../src/components/SuiFrenImageAssets.js';
import type { SuiFrenAttributes } from '../src/components/types.js';
import { createTestRoot } from './helpers/react-dom.js';

vi.mock('../src/animation/waapiBackend.js', () => ({
	startWaapiAnimation: () => ({ handled: false }),
}));

const attributes = {
	mainColor: '6FBBEE',
	secondaryColor: 'E6FBFF',
	skin: 'basic',
	expression: 'happy',
};
const capy = { ...attributes, earShape: 'default' } as SuiFrenAttributes;
const bullshark = { ...attributes, finStyle: 'classic' } as SuiFrenAttributes;
let view: ReturnType<typeof createTestRoot> | undefined;
afterEach(async () => {
	await view?.unmount();
	view = undefined;
});

test.each([
	['inline', SuiFrenImage],
	['assets', SuiFrenImageAssets],
] as const)('species changes rebuild animation registrations for %s', async (_name, Renderer) => {
	view = createTestRoot();
	const register = vi.spyOn(AnimationStore.prototype, 'registerElement');
	await view.render(
		<Renderer attributes={capy} animationPreset="idle" animationAutoPlay={false} />,
	);
	const capyStore = register.mock.contexts[0] as AnimationStore;
	register.mockClear();
	await view.render(
		<Renderer attributes={bullshark} animationPreset="idle" animationAutoPlay={false} />,
	);
	expect(register.mock.calls.length).toBeGreaterThan(0);
	expect(register.mock.contexts[0]).not.toBe(capyStore);
	const finTargets = (register.mock.contexts[0] as AnimationStore)
		.getAnimationTargets()
		.filter(({ part }) => part === 'fin');
	expect(finTargets.length).toBeGreaterThan(0);
	for (const { element } of finTargets) {
		expect(element?.isConnected).toBe(true);
		expect(element?.getAttribute('data-suifren-animation-part')).toBe('fin');
	}
	register.mockClear();
	await view.render(
		<Renderer attributes={capy} animationPreset="idle" animationAutoPlay={false} />,
	);
	expect(register.mock.calls.length).toBeGreaterThan(0);
	expect(
		(register.mock.contexts[0] as AnimationStore)
			.getAnimationTargets()
			.some(({ part }) => part === 'fin'),
	).toBe(false);
});

test('the fin rotates around its attachment point while inheriting head movement', () => {
	const result = parseMatrix(
		composePartTransform(
			'fin',
			undefined,
			new Map([
				['fin', { rotate: 90 }],
				['head', { translate: { x: 3, y: 4 } }],
			]),
		),
	)!;
	// A rotation leaves its pivot fixed; head translation uses four SVG units per pose unit.
	expect(result[0] * 1008 + result[2] * 1486 + result[4]).toBeCloseTo(1020);
	expect(result[1] * 1008 + result[3] * 1486 + result[5]).toBeCloseTo(1502);
});

test('individual goth boots contain only the requested geometry, without clipping', () => {
	const both = document.createElement('div');
	both.innerHTML = renderToStaticMarkup(<GothBoots />);
	const paths = [...both.querySelectorAll('path')];
	expect(paths).toHaveLength(10);
	for (const side of ['left', 'right'] as const) {
		const container = document.createElement('div');
		container.innerHTML = renderToStaticMarkup(<GothBoots side={side} />);
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
