// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { AnimationSequence } from '../types/animation.type.js';
import { getCorePresetSequence } from './core-presets.js';

const DEFERRED_PRESET_NAMES = new Set([
	'run',
	'sprint',
	'crouch',
	'crouchWalk',
	'slide',
	'ourah',
	'showing',
	'punch',
	'kick',
	'melee',
	'hit',
	'knockdown',
	'revive',
	'death',
	'death2',
	'death3',
	'victory',
	'floss',
]);

let cataloguePromise: Promise<Record<string, AnimationSequence>> | undefined;

export function resolvePresetSequenceSync(name: string): AnimationSequence | undefined {
	return getCorePresetSequence(name);
}

export function isDeferredPreset(name: string): boolean {
	return DEFERRED_PRESET_NAMES.has(name);
}

export async function loadDeferredPresetSequence(name: string): Promise<AnimationSequence | null> {
	if (!isDeferredPreset(name)) {
		return null;
	}
	cataloguePromise ??= import('./battle-royale-presets.js')
		.then(({ BATTLE_ROYALE_PRESETS }) => BATTLE_ROYALE_PRESETS)
		.catch((error: unknown) => {
			cataloguePromise = undefined;
			throw error;
		});
	const catalogue = await cataloguePromise;
	return catalogue[name] ?? null;
}
