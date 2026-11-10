// @vitest-environment happy-dom
import { act, useEffect } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { SuiFrenBattleSprite } from '../src/components/battle/SuiFrenBattleSprite.js';
import { createTestRoot } from './helpers/react-dom.js';

const image = vi.hoisted(() => ({ mounted: vi.fn<() => void>(), unmounted: vi.fn<() => void>() }));
vi.mock('../src/components/SuiFrenImage.js', () => ({
	SuiFrenImage: function Image() {
		useEffect(() => {
			image.mounted();
			return () => {
				image.unmounted();
			};
		}, []);
		return <svg data-character />;
	},
}));
let view: ReturnType<typeof createTestRoot>;
beforeEach(() => {
	vi.useFakeTimers();
	image.mounted.mockClear();
	image.unmounted.mockClear();
	view = createTestRoot();
});
afterEach(async () => {
	await view.unmount();
	vi.useRealTimers();
});
const attributes = {
	mainColor: '6FBBEE',
	secondaryColor: 'E6FBFF',
	skin: 'basic',
	expression: 'happy',
	earShape: 'default',
} as const;
function renderHit(trigger?: string | number | null) {
	return view.render(
		<SuiFrenBattleSprite
			attributes={attributes}
			health={10}
			maxHealth={10}
			hitFlashTrigger={trigger}
			imageStyle={{ filter: 'blur(2px)' }}
		/>,
	);
}
function filter() {
	return view.container.querySelector('[data-character]')?.parentElement?.style.filter;
}
async function advance(ms: number) {
	await act(async () => {
		vi.advanceTimersByTime(ms);
	});
}

test('a hit flashes for exactly 160ms and preserves the base image filter', async () => {
	await renderHit();
	expect(filter()).toBe('blur(2px)');
	await renderHit(1);
	expect(filter()).toBe('blur(2px) url(#hit-flash-red)');
	await advance(159);
	expect(filter()).toContain('hit-flash-red');
	await advance(1);
	expect(filter()).toBe('blur(2px)');
	await renderHit(1);
	expect(filter()).toBe('blur(2px)');
	expect(image.mounted).toHaveBeenCalledTimes(1);
	expect(image.unmounted).not.toHaveBeenCalled();
});

test('rapid hits restart the timer without remounting; clearing the trigger lets the current flash finish', async () => {
	await renderHit('first');
	await advance(80);
	await renderHit('next');
	await advance(80);
	expect(filter()).toContain('hit-flash-red');
	await renderHit(null);
	await advance(79);
	expect(filter()).toContain('hit-flash-red');
	await advance(1);
	expect(filter()).toBe('blur(2px)');
	expect(image.mounted).toHaveBeenCalledTimes(1);
});

test('unmount cancels the pending flash timer', async () => {
	await renderHit(1);
	expect(vi.getTimerCount()).toBe(1);
	await view.render(null);
	expect(vi.getTimerCount()).toBe(0);
	expect(image.unmounted).toHaveBeenCalledTimes(1);
});
