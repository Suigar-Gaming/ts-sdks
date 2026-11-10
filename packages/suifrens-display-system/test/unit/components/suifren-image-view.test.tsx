// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

// @vitest-environment happy-dom
import { afterEach, expect, test, vi } from 'vitest';
import { accessories, getAccessoriesByType } from '../../../src/accessories/index.js';
import { AnimationStore } from '../../../src/animation/animation-store.js';
import { SuiFrenImageInline } from '../../../src/image-inline/index.js';
import { SuiFrenImage } from '../../../src/index.js';
import type { SuiFrenAttributes } from '../../../src/types/suifren.type.js';
import { createTestRoot } from '../../helpers/react-dom.js';

vi.mock('../../../src/animation/waapi-backend.js', () => ({
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
	['inline', SuiFrenImageInline],
	['assets', SuiFrenImage],
] as const)('species changes rebuild animation registrations for %s', async (_name, Renderer) => {
	view = createTestRoot();
	const register = vi.spyOn(AnimationStore.prototype, 'registerElement');
	await view.render(
		<Renderer attributes={capy} animation={{ preset: 'idle', playState: 'idle' }} />,
	);
	const capyStore = register.mock.contexts[0] as AnimationStore;
	register.mockClear();
	await view.render(
		<Renderer attributes={bullshark} animation={{ preset: 'idle', playState: 'idle' }} />,
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
		<Renderer attributes={capy} animation={{ preset: 'idle', playState: 'idle' }} />,
	);
	expect(register.mock.calls.length).toBeGreaterThan(0);
	expect(
		(register.mock.contexts[0] as AnimationStore)
			.getAnimationTargets()
			.some(({ part }) => part === 'fin'),
	).toBe(false);
});

test.each([
	['inline', SuiFrenImageInline],
	['assets', SuiFrenImage],
] as const)('%s uses an explicit SVG instead of the catalogue cap', async (_name, Renderer) => {
	const cap = accessories.find((item) => item.name === 'baseball cap');
	expect.assert(cap);
	const assetSrc = '/custom-cap.svg';
	view = createTestRoot();
	await view.render(
		<Renderer
			attributes={capy}
			accessories={[{ ...cap, renderOptions: { ...cap.renderOptions, assetSrc } }]}
		/>,
	);
	expect(view.container.querySelector('image')?.getAttribute('href')).toBe(assetSrc);
});

test.each([SuiFrenImage, SuiFrenImageInline])(
	'renders a custom accessory with only visual fields',
	async (Renderer) => {
		const hat = {
			name: 'custom hat',
			type: 'head',
			category: 'hats',
			renderOptions: { assetSrc: '/custom.svg' },
		};
		view = createTestRoot();
		await view.render(<Renderer attributes={capy} accessories={[hat]} />);
		expect(view.container.querySelector('image')?.getAttribute('href')).toBe('/custom.svg');
	},
);

test('slot lookup preserves catalogue metadata and returns undefined for empty slots', () => {
	const slots = getAccessoriesByType(accessories.filter((item) => item.name === 'baseball cap'));
	expect(slots['head']?.price).toBe(2000000000);
	expect(slots['feet']).toBeUndefined();
	expect(slots['constructor']).toBeUndefined();
});
