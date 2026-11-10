// @vitest-environment happy-dom
import { act } from 'react';
import { expect, test, vi } from 'vitest';
import { AnimatedAccessory } from '../src/animation/AnimatedAccessory.js';
import { AnimationStore } from '../src/animation/AnimationStore.js';
import { parseMatrix } from '../src/animation/matrix.js';
import { AccessoryRendererProvider } from '../src/components/accessories/AccessorySlot.js';
import { BullsharkImage } from '../src/components/bullshark-image/BullsharkImage.js';
import { CapyImage } from '../src/components/capy-image/CapyImage.js';
import type { AccessoryMetadata } from '../src/utils/accessoryUtils.js';
import { createTestRoot } from './helpers/react-dom.js';
const context = vi.hoisted(() => ({ store: null as AnimationStore | null }));
vi.mock('../src/animation/AnimationContext.js', () => ({ useAnimationStore: () => context.store }));
const cup: AccessoryMetadata = {
	type: 'object',
	name: 'cup',
	category: 'award',
	collection: 'race',
	description: '',
	price: 0,
	quantity: null,
	renderOptions: { animationPart: 'leftArm', foreground: true },
};
const attributes = {
	mainColor: 'A87C4C' as const,
	secondaryColor: 'D5CBB1' as const,
	skin: 'basic' as const,
	expression: 'happy' as const,
};
function HeldCup() {
	return (
		<AnimatedAccessory fallbackPart="leftArm">
			<g data-cup="true" />
		</AnimatedAccessory>
	);
}
function point(element: Element, x: number, y: number) {
	const [a, b, c, d, e, f] = parseMatrix(element.getAttribute('transform'))!;
	return { x: a * x + c * y + e, y: b * x + d * y + f };
}
test.each(['capy', 'bullshark'] as const)(
	'%s re-registers its foreground gripping hand when victory replaces the resting arm',
	async (species) => {
		const view = createTestRoot();
		const store = new AnimationStore();
		context.store = store;
		const render = (foreground: boolean) =>
			view.render(
				<svg>
					<AccessoryRendererProvider renderer={HeldCup}>
						{species === 'capy' ? (
							<CapyImage
								attributes={{ ...attributes, earShape: 'default' }}
								accessoriesByType={{ object: cup }}
								renderMicrophoneArmInForeground={foreground}
							/>
						) : (
							<BullsharkImage
								attributes={{ ...attributes, finStyle: 'classic' }}
								accessoriesByType={{ object: cup }}
								renderMicrophoneArmInForeground={foreground}
							/>
						)}
					</AccessoryRendererProvider>
				</svg>,
			);
		try {
			await render(false);
			await render(true);
			const arm = view.container
				.querySelectorAll('[data-suifren-animation-part="leftArm"]')[1]
				.querySelector('g[transform]')!;
			const object = view.container.querySelector('[data-cup]')!;
			expect(arm).not.toBeNull();
			const base = arm.getAttribute('transform');
			for (const rotate of [35, 70, 50, 75, 55, 60]) {
				act(() => store.setPose('leftArm', { rotate }));
				expect(arm.getAttribute('transform')).not.toBe(base);
				const palm = point(arm, 34, 137),
					grip = point(object, 1100, 2120);
				expect(Math.hypot(palm.x - grip.x, palm.y - grip.y)).toBeLessThan(3);
			}
			await render(false);
			const detached = arm.getAttribute('transform');
			act(() => store.setPose('leftArm', { rotate: 0 }));
			expect(arm.getAttribute('transform')).toBe(detached);
		} finally {
			await view.unmount();
			context.store = null;
		}
	},
);
