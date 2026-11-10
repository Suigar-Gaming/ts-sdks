// @vitest-environment happy-dom
import { createElement, createRef } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { expect, test } from 'vitest';
import { AnimatedAccessory } from '@suigar/suifrens-display-system/animation';

test('forwards the SVG ref and clears it on unmount', () => {
	const container = document.createElement('div');
	const root = createRoot(container);
	const ref = createRef();
	try {
		flushSync(() =>
			root.render(
				createElement(
					'svg',
					null,
					createElement(AnimatedAccessory, null, createElement('g', { ref })),
				),
			),
		);
		expect(ref.current).toBeInstanceOf(SVGElement);
		expect(ref.current).toBe(container.querySelector('g'));
	} finally {
		root.unmount();
	}
	expect(ref.current).toBeNull();
});
