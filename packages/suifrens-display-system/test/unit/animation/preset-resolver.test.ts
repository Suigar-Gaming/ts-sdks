// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0
import { afterEach, expect, test, vi } from 'vitest';

afterEach(() => {
	vi.doUnmock('../../../src/animation/presets/battle-royale.js');
	vi.resetModules();
});

test('loads the catalogue on demand and shares it across different presets', async () => {
	const catalogue = { run: { duration: 1, tracks: [] }, hit: { duration: 2, tracks: [] } };
	const load = vi.fn<() => { BATTLE_ROYALE_PRESETS: typeof catalogue }>(() => ({
		BATTLE_ROYALE_PRESETS: catalogue,
	}));
	vi.doMock('../../../src/animation/presets/battle-royale.js', load);
	const { loadDeferredPresetSequence } = await import('../../../src/animation/presets/resolver.js');
	expect(await loadDeferredPresetSequence('unknown')).toBeNull();
	expect(load).not.toHaveBeenCalled();
	expect(
		await Promise.all(['run', 'hit', 'run'].map((preset) => loadDeferredPresetSequence(preset))),
	).toEqual([catalogue.run, catalogue.hit, catalogue.run]);
	expect(load).toHaveBeenCalledOnce();
});

test('a rejected catalogue load allows the next request to retry', async () => {
	vi.doMock('../../../src/animation/presets/battle-royale.js', () => {
		throw new Error('unavailable');
	});
	const { loadDeferredPresetSequence } = await import('../../../src/animation/presets/resolver.js');
	await expect(loadDeferredPresetSequence('run')).rejects.toThrow(/mocking a module|unavailable/iu);
	const run = { duration: 1, tracks: [] };
	vi.doMock('../../../src/animation/presets/battle-royale.js', () => ({
		BATTLE_ROYALE_PRESETS: { run },
	}));
	expect(await loadDeferredPresetSequence('run')).toBe(run);
});

test('selects a catalogue by preset name and retries only the catalogue that failed', async () => {
	const { createPresetResolver } = await import('../../../src/animation/presets/resolver.js');
	const dance = { duration: 3, tracks: [] };
	const hit = { duration: 1, tracks: [] };
	const run = { duration: 2, tracks: [] };
	const combatPresets = { run, hit };
	const dancePresets = { dance };
	const combat = vi.fn<() => Promise<typeof combatPresets>>().mockResolvedValue(combatPresets);
	const dances = vi
		.fn<() => Promise<typeof dancePresets>>()
		.mockResolvedValue(dancePresets)
		.mockRejectedValueOnce(new Error('offline'));
	const resolver = createPresetResolver([
		{ names: ['hit', 'run'], load: combat },
		{ names: ['dance'], load: dances },
	]);
	expect(await resolver.loadDeferredPresetSequence('unknown')).toBeNull();
	expect(
		await Promise.all(['hit', 'run'].map((name) => resolver.loadDeferredPresetSequence(name))),
	).toEqual([hit, run]);
	expect(dances).not.toHaveBeenCalled();
	await expect(resolver.loadDeferredPresetSequence('dance')).rejects.toThrow('offline');
	expect(await resolver.loadDeferredPresetSequence('hit')).toBe(hit);
	expect(await resolver.loadDeferredPresetSequence('dance')).toBe(dance);
	expect(combat).toHaveBeenCalledOnce();
	expect(dances).toHaveBeenCalledTimes(2);
});
