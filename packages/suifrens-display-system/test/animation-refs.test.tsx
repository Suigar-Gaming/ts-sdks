// @vitest-environment happy-dom
import { act, createRef, forwardRef, type ReactElement, type Ref } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { AnimatedAccessory } from '../src/animation/AnimatedAccessory.js';
import { AnimationStore } from '../src/animation/AnimationStore.js';
import { useAnimatedPartTransform } from '../src/animation/useAnimatedPartTransform.js';
import { createTestRoot } from './helpers/react-dom.js';

const context = vi.hoisted(() => ({ store: null as AnimationStore | null }));
vi.mock('../src/animation/AnimationContext.js', () => ({ useAnimationStore: () => context.store }));
let view: ReturnType<typeof createTestRoot>;
beforeEach(() => {
	view = createTestRoot();
	context.store = null;
});
afterEach(async () => {
	await view.unmount();
});

function Part({ base }: { base: string }) {
	const transform = useAnimatedPartTransform('head', base);
	return <g data-part transform={transform} />;
}

test('base transforms update without a provider and after leaving a legacy animation store', async () => {
	const store = new AnimationStore();
	Object.defineProperty(store, 'usesDirectDomTransforms', { value: false });
	await view.render(
		<svg>
			<Part base="matrix(1,0,0,1,10,20)" />
		</svg>,
	);
	expect(view.container.querySelector('[data-part]')?.getAttribute('transform')).toBe(
		'matrix(1,0,0,1,10,20)',
	);
	context.store = store;
	await view.render(
		<svg>
			<Part base="matrix(1,0,0,1,10,20)" />
		</svg>,
	);
	await act(async () => {
		store.setPose('head', { translate: { x: 1, y: 2 } });
	});
	const animated = view.container.querySelector('[data-part]')?.getAttribute('transform');
	expect(animated).not.toBe('matrix(1,0,0,1,10,20)');
	await view.render(
		<svg>
			<Part base="matrix(1,0,0,1,30,40)" />
		</svg>,
	);
	expect(view.container.querySelector('[data-part]')?.getAttribute('transform')).not.toBe(animated);
	context.store = null;
	await view.render(
		<svg>
			<Part base="matrix(1,0,0,1,50,60)" />
		</svg>,
	);
	expect(view.container.querySelector('[data-part]')?.getAttribute('transform')).toBe(
		'matrix(1,0,0,1,50,60)',
	);
	await act(async () => {
		store.setPose('head', { rotate: 90 });
	});
	expect(view.container.querySelector('[data-part]')?.getAttribute('transform')).toBe(
		'matrix(1,0,0,1,50,60)',
	);
});

test('direct DOM mode returns the current base transform', async () => {
	context.store = new AnimationStore();
	await view.render(
		<svg>
			<Part base="translate(10,20)" />
		</svg>,
	);
	await view.render(
		<svg>
			<Part base="translate(30,40)" />
		</svg>,
	);
	expect(view.container.querySelector('[data-part]')?.getAttribute('transform')).toBe(
		'translate(30,40)',
	);
});

test('React 19 callback refs are preserved on rerender and cleared on detach', async () => {
	const ref = vi.fn<(element: SVGGElement | null) => void>();
	const errors = vi.spyOn(console, 'error');
	await view.render(
		<svg>
			<AnimatedAccessory fallbackPart="head">
				<g ref={ref} data-accessory />
			</AnimatedAccessory>
		</svg>,
	);
	const element = view.container.querySelector('[data-accessory]');
	expect(ref).toHaveBeenCalledExactlyOnceWith(element);
	await view.render(
		<svg>
			<AnimatedAccessory fallbackPart="head">
				<g ref={ref} data-accessory />
			</AnimatedAccessory>
		</svg>,
	);
	expect(ref).toHaveBeenLastCalledWith(element);
	expect(view.container.querySelector('[data-accessory]')).toBe(element);
	await view.render(null);
	expect(ref).toHaveBeenLastCalledWith(null);
	expect(errors).not.toHaveBeenCalled();
});

test('object refs and forwarded refs still reach the SVG element', async () => {
	const ref = createRef<SVGGElement>();
	const Shape = forwardRef<SVGGElement>((_props, forwardedRef) => (
		<g ref={forwardedRef} data-forwarded />
	));
	await view.render(
		<svg>
			<AnimatedAccessory>
				<Shape ref={ref} />
			</AnimatedAccessory>
		</svg>,
	);
	expect(ref.current).toBe(view.container.querySelector('[data-forwarded]'));
	await view.render(null);
	expect(ref.current).toBeNull();
});

test('React 18 element-shaped refs remain supported without accessing a deprecated getter', async () => {
	const ref = vi.fn<(element: SVGElement | null) => void>();
	const child = <g data-legacy />;
	const legacyChild = { ...child, ref } as ReactElement & { ref: Ref<SVGElement> };
	await view.render(
		<svg>
			<AnimatedAccessory>{legacyChild}</AnimatedAccessory>
		</svg>,
	);
	expect(ref).toHaveBeenCalledExactlyOnceWith(view.container.querySelector('[data-legacy]'));
	await view.render(null);
	expect(ref).toHaveBeenLastCalledWith(null);
});

test('an unchanged object ref follows replacement of the child key', async () => {
	const ref = createRef<SVGGElement>();
	await view.render(
		<svg>
			<AnimatedAccessory>
				<g ref={ref} key="first" data-first />
			</AnimatedAccessory>
		</svg>,
	);
	const first = ref.current;
	await view.render(
		<svg>
			<AnimatedAccessory>
				<g ref={ref} key="second" data-second />
			</AnimatedAccessory>
		</svg>,
	);
	expect(ref.current).toBe(view.container.querySelector('[data-second]'));
	expect(ref.current).not.toBe(first);
	await view.render(null);
	expect(ref.current).toBeNull();
});

test('a function component receiving a React 19 ref prop keeps its own ref target', async () => {
	const ref = createRef<SVGGElement>();
	function Shape({ ref: elementRef }: { ref: Ref<SVGGElement> }) {
		return <g ref={elementRef} data-inner />;
	}
	await view.render(
		<svg>
			<AnimatedAccessory fallbackPart="head">
				<Shape ref={ref} />
			</AnimatedAccessory>
		</svg>,
	);
	expect(ref.current).toBe(view.container.querySelector('[data-inner]'));
	expect(ref.current?.parentElement?.getAttribute('data-suifren-animation-part')).toBe('head');
	await view.render(null);
	expect(ref.current).toBeNull();
});

test('a transformed accessory root is detected without falling back to the wrong part', async () => {
	const store = new AnimationStore();
	context.store = store;
	await view.render(
		<svg>
			<AnimatedAccessory fallbackPart="head">
				<g
					data-fin
					transform="matrix(2.9166107177734375, 0, 0, 2.9166107177734375, 1181.8,460.1)"
				/>
			</AnimatedAccessory>
		</svg>,
	);
	const targets = store.getAnimationTargets();
	expect(targets).toHaveLength(1);
	expect(targets[0].part).toBe('fin');
	expect(targets[0].element).toBe(view.container.querySelector('[data-fin]'));
	await view.render(null);
	expect(store.getAnimationTargets()).toHaveLength(0);
});

test('fallback accessory registrations share the original base transform and clean up independently', async () => {
	const store = new AnimationStore();
	context.store = store;
	await view.render(
		<svg>
			<AnimatedAccessory fallbackPart="head">
				<g data-fallback transform="matrix(1, 0, 0, 1, 10, 20)" />
			</AnimatedAccessory>
		</svg>,
	);
	const element = view.container.querySelector<SVGGraphicsElement>('[data-fallback]')!;
	store.setPose('head', { translate: { x: 5, y: 0 } });
	const cleanup = store.registerElement('head', element);
	expect(store.getAnimationTargets()).toHaveLength(1);
	store.clear();
	expect(element.getAttribute('transform')).toBe('matrix(1, 0, 0, 1, 10, 20)');
	cleanup();
	expect(store.getAnimationTargets()).toHaveLength(1);
	await view.render(null);
	expect(store.getAnimationTargets()).toHaveLength(0);
});
