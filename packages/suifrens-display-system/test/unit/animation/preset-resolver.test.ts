// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0
import { afterEach, expect, test, vi } from 'vitest';

afterEach(() => {
	vi.doUnmock('../../../src/animation/battle-royale-presets.js');
	vi.resetModules();
});

test('loads the catalogue on demand and shares it across different presets', async () => {
	const catalogue = { run: { duration: 1, tracks: [] }, hit: { duration: 2, tracks: [] } };
	const load = vi.fn<() => { BATTLE_ROYALE_PRESETS: typeof catalogue }>(() => ({
		BATTLE_ROYALE_PRESETS: catalogue,
	}));
	vi.doMock('../../../src/animation/battle-royale-presets.js', load);
	const { loadDeferredPresetSequence } = await import('../../../src/animation/preset-resolver.js');
	expect(await loadDeferredPresetSequence('unknown')).toBeNull();
	expect(load).not.toHaveBeenCalled();
	expect(await Promise.all(['run', 'hit', 'run'].map(loadDeferredPresetSequence))).toEqual([
		catalogue.run,
		catalogue.hit,
		catalogue.run,
	]);
	expect(load).toHaveBeenCalledOnce();
});

test('a rejected catalogue load allows the next request to retry', async () => {
	vi.doMock('../../../src/animation/battle-royale-presets.js', () => {
		throw new Error('unavailable');
	});
	const { loadDeferredPresetSequence } = await import('../../../src/animation/preset-resolver.js');
	await expect(loadDeferredPresetSequence('run')).rejects.toThrow(/mocking a module|unavailable/i);
	const run = { duration: 1, tracks: [] };
	vi.doMock('../../../src/animation/battle-royale-presets.js', () => ({
		BATTLE_ROYALE_PRESETS: { run },
	}));
	expect(await loadDeferredPresetSequence('run')).toBe(run);
});
