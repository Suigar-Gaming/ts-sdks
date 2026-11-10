// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

// @vitest-environment happy-dom
import { afterEach, expect, test, vi } from 'vitest';
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
