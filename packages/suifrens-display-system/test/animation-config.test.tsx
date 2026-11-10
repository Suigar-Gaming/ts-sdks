// @vitest-environment happy-dom
import { act } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { AnimationProvider } from '../src/animation/AnimationContext.js';
import { AnimationController } from '../src/animation/AnimationController.js';
import type { AnimationSequence } from '../src/animation/types.js';
import { createTestRoot } from './helpers/react-dom.js';

const resolver = vi.hoisted(() => ({
	load: vi.fn<(name: string) => Promise<AnimationSequence | null>>(),
	walk: { name: 'walk', duration: 100, tracks: [] },
}));
vi.mock('../src/animation/presetResolver.js', () => ({
	isDeferredPreset: (name: string) => ['run', 'hit', 'death'].includes(name),
	resolvePresetSequenceSync: (name: string) => (name === 'walk' ? resolver.walk : undefined),
	loadDeferredPresetSequence: resolver.load,
}));
vi.mock('../src/animation/waapiBackend.js', () => ({
	startWaapiAnimation: () => ({ handled: false }),
}));

let view: ReturnType<typeof createTestRoot>;
beforeEach(() => {
	view = createTestRoot();
	resolver.load.mockReset();
});
afterEach(async () => {
	await view.unmount();
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
			<AnimationProvider animation={{ preset: 'run', autoPlay: false }}>{null}</AnimationProvider>
		</svg>,
	);
	expect(applied.mock.lastCall?.[0]).toBeNull();
	await act(async () => {
		run.resolve(runSequence);
	});
	expect(applied.mock.lastCall?.[0]).toMatchObject({ sequence: runSequence, autoPlay: false });
	await view.render(
		<svg>
			<AnimationProvider animation={{ preset: 'hit', autoPlay: false }}>{null}</AnimationProvider>
		</svg>,
	);
	expect(applied.mock.lastCall?.[0]).toBeNull();
	await view.render(
		<svg>
			<AnimationProvider animation={{ preset: 'death', autoPlay: false }}>{null}</AnimationProvider>
		</svg>,
	);
	await act(async () => {
		hit.resolve(hitSequence);
	});
	expect(applied.mock.lastCall?.[0]).toBeNull();
	await act(async () => {
		death.resolve(deathSequence);
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
			<AnimationProvider animation={{ preset: 'run', autoPlay: false }}>{null}</AnimationProvider>
		</svg>,
	);
	await view.render(
		<svg>
			<AnimationProvider animation={{ preset: 'walk', autoPlay: false }}>{null}</AnimationProvider>
		</svg>,
	);
	expect(applied.mock.lastCall?.[0]).toMatchObject({ sequence: resolver.walk });
	await act(async () => {
		pending.reject(new Error('load failed'));
	});
	expect(applied.mock.lastCall?.[0]).toMatchObject({ sequence: resolver.walk });
	const sequence = { name: 'custom', duration: 200, tracks: [] };
	await view.render(
		<svg>
			<AnimationProvider animation={{ sequence, autoPlay: false }}>{null}</AnimationProvider>
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
			<AnimationProvider animation={{ preset: 'run', autoPlay: false }}>{null}</AnimationProvider>
		</svg>,
	);
	await act(async () => {
		pending.reject(new Error('load failed'));
	});
	expect(applied.mock.lastCall?.[0]).toBeNull();
});
