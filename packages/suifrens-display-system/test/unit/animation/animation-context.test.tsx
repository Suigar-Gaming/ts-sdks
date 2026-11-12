// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

// @vitest-environment happy-dom
import { act } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { AnimationController } from '../../../src/animation/animation-controller.js';
import { AnimationProvider } from '../../../src/animation/AnimationContext.js';
import { startWaapiAnimation } from '../../../src/animation/waapi-backend.js';
import type { AnimationSequence } from '../../../src/types/animation.type.js';
import { createTestRoot } from '../../helpers/react-dom.js';

const resolver = vi.hoisted(() => ({
	load: vi.fn<(name: string) => Promise<AnimationSequence | null>>(),
	walk: { name: 'walk', duration: 100, tracks: [] },
}));
vi.mock('../../../src/animation/presets/core.js', () => ({
	getCorePresetSequence: (name: string) => (name === 'walk' ? resolver.walk : undefined),
}));

vi.mock('../../../src/animation/presets/resolver.js', () => ({
	isDeferredPreset: (name: string) => ['run', 'hit', 'death'].includes(name),
	loadDeferredPresetSequence: resolver.load,
}));
vi.mock('../../../src/animation/waapi-backend.js', () => ({
	startWaapiAnimation: vi.fn<typeof startWaapiAnimation>(() => ({ handled: false })),
}));

let view: ReturnType<typeof createTestRoot>;
beforeEach(() => {
	view = createTestRoot();
	resolver.load.mockReset();
});
afterEach(async () => {
	await view.unmount();
	vi.unstubAllGlobals();
});

function pendingSequence() {
	let resolve!: (sequence: AnimationSequence | null) => void;
	let reject!: (reason: Error) => void;
	const promise = new Promise<AnimationSequence | null>((done, fail) => {
		resolve = done;
		reject = fail;
	});
	return { promise, resolve, reject };
}

test('switching deferred presets never plays the previous sequence and ignores obsolete loads', async () => {
	const applied = vi.spyOn(AnimationController.prototype, 'applyConfig');
	const run = pendingSequence();
	const hit = pendingSequence();
	const death = pendingSequence();
	resolver.load
		.mockReturnValueOnce(run.promise)
		.mockReturnValueOnce(hit.promise)
		.mockReturnValueOnce(death.promise);
	const runSequence = { name: 'run', duration: 100, tracks: [] };
	const hitSequence = { name: 'hit', duration: 100, tracks: [] };
	const deathSequence = { name: 'death', duration: 100, tracks: [] };
	await view.render(
		<svg>
			<AnimationProvider animation={{ preset: 'run', playState: 'idle' }}>{null}</AnimationProvider>
		</svg>,
	);
	expect(applied.mock.lastCall?.[0]).toBeNull();
	await act(async () => {
		run.resolve(runSequence);

		await Promise.resolve();
	});
	expect(applied.mock.lastCall?.[0]).toMatchObject({ sequence: runSequence, playState: 'idle' });
	await view.render(
		<svg>
			<AnimationProvider animation={{ preset: 'hit', playState: 'idle' }}>{null}</AnimationProvider>
		</svg>,
	);
	expect(applied.mock.lastCall?.[0]).toBeNull();
	await view.render(
		<svg>
			<AnimationProvider animation={{ preset: 'death', playState: 'idle' }}>
				{null}
			</AnimationProvider>
		</svg>,
	);
	await act(async () => {
		hit.resolve(hitSequence);

		await Promise.resolve();
	});
	expect(applied.mock.lastCall?.[0]).toBeNull();
	await act(async () => {
		death.resolve(deathSequence);

		await Promise.resolve();
	});
	expect(applied.mock.lastCall?.[0]).toMatchObject({ sequence: deathSequence });
	await view.render(
		<svg>
			<AnimationProvider animation={null}>{null}</AnimationProvider>
		</svg>,
	);
	expect(applied.mock.lastCall?.[0]).toBeNull();
	await view.render(
		<svg>
			<AnimationProvider animation={{ preset: 'unknown' }}>{null}</AnimationProvider>
		</svg>,
	);
	expect(applied.mock.lastCall?.[0]).toBeNull();
});

test('explicit and synchronous sequences remain immediate; rejected loads cannot replace them', async () => {
	const applied = vi.spyOn(AnimationController.prototype, 'applyConfig');
	const pending = pendingSequence();
	resolver.load.mockReturnValue(pending.promise);
	await view.render(
		<svg>
			<AnimationProvider animation={{ preset: 'run', playState: 'idle' }}>{null}</AnimationProvider>
		</svg>,
	);
	await view.render(
		<svg>
			<AnimationProvider animation={{ preset: 'walk', playState: 'idle' }}>
				{null}
			</AnimationProvider>
		</svg>,
	);
	expect(applied.mock.lastCall?.[0]).toMatchObject({ sequence: resolver.walk });
	await act(async () => {
		pending.reject(new Error('load failed'));

		await Promise.resolve();
	});
	expect(applied.mock.lastCall?.[0]).toMatchObject({ sequence: resolver.walk });
	const sequence = { name: 'custom', duration: 200, tracks: [] };
	await view.render(
		<svg>
			<AnimationProvider animation={{ sequence, playState: 'idle' }}>{null}</AnimationProvider>
		</svg>,
	);
	expect(applied.mock.lastCall?.[0]).toMatchObject({ sequence });
});

test('a failed current deferred load leaves animation disabled', async () => {
	const applied = vi.spyOn(AnimationController.prototype, 'applyConfig');
	const pending = pendingSequence();
	resolver.load.mockReturnValue(pending.promise);
	await view.render(
		<svg>
			<AnimationProvider animation={{ preset: 'run', playState: 'idle' }}>{null}</AnimationProvider>
		</svg>,
	);
	await act(async () => {
		pending.reject(new Error('load failed'));

		await Promise.resolve();
	});
	expect(applied.mock.lastCall?.[0]).toBeNull();
});

test.each([
	['waapi', []],
	['javascript', [[16]]],
] as const)('%s respects visibility from mount through resume', async (engine, expectedUpdates) => {
	const disconnect = vi.fn<() => void>();
	let intersect!: (entries: Array<{ isIntersecting: boolean }>) => void;
	vi.stubGlobal(
		'IntersectionObserver',
		class {
			constructor(callback: typeof intersect) {
				intersect = callback;
			}
			observe() {}
			disconnect = disconnect;
		},
	);
	vi.spyOn(SVGElement.prototype, 'getBoundingClientRect').mockReturnValue(
		new DOMRect(0, window.innerHeight + 200, 10, 10),
	);
	const media = window.matchMedia('(prefers-reduced-motion: reduce)');
	vi.spyOn(window, 'matchMedia').mockReturnValue(media);
	const reduced = vi.spyOn(media, 'matches', 'get').mockReturnValue(false);
	const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
	const play = vi.fn<() => void>();
	const pause = vi.fn<() => void>();
	const cleanup = vi.fn<() => void>();
	const backends = {
		waapi: { handled: true, play, pause, cleanup },
		javascript: { handled: false },
	} as const;
	vi.mocked(startWaapiAnimation).mockReturnValueOnce(backends[engine]);
	const frame = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(0);
	const cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
	vi.spyOn(AnimationController.prototype, 'needsAnimationFrame').mockReturnValue(true);
	const update = vi.spyOn(AnimationController.prototype, 'update').mockReturnValue(false);
	const clock = vi.spyOn(performance, 'now').mockReturnValue(100);
	await view.render(
		<svg>
			<AnimationProvider animation={{ preset: 'walk' }}>{null}</AnimationProvider>
		</svg>,
	);
	const start = { waapi: play, javascript: frame }[engine];
	expect(start).not.toHaveBeenCalled();
	visibility.mockReturnValue('hidden');
	intersect([{ isIntersecting: true }]);
	expect(start).not.toHaveBeenCalled();
	visibility.mockReturnValue('visible');
	document.dispatchEvent(new Event('visibilitychange'));
	expect(start).toHaveBeenCalledTimes(1);
	reduced.mockReturnValue(true);
	media.dispatchEvent(new Event('change'));
	const stalled = { waapi: pause, javascript: cancel }[engine];
	expect(stalled).toHaveBeenCalled();
	clock.mockReturnValue(10000);
	reduced.mockReturnValue(false);
	media.dispatchEvent(new Event('change'));
	expect(start).toHaveBeenCalledTimes(2);
	frame.mock.lastCall?.[0](10016);
	expect(update.mock.calls).toEqual(expectedUpdates);
	await view.render(null);
	expect(disconnect).toHaveBeenCalledOnce();
	document.dispatchEvent(new Event('visibilitychange'));
	media.dispatchEvent(new Event('change'));
	expect(start).toHaveBeenCalledTimes(2);
});
