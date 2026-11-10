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

const DEFERRED_PRESET_CACHE = new Map<string, AnimationSequence | null>();
const DEFERRED_PRESET_PROMISE_CACHE = new Map<string, Promise<AnimationSequence | null>>();

export function resolvePresetSequenceSync(name: string): AnimationSequence | undefined {
	return getCorePresetSequence(name);
}

export function isDeferredPreset(name: string): boolean {
	return DEFERRED_PRESET_NAMES.has(name);
}

export function loadDeferredPresetSequence(name: string): Promise<AnimationSequence | null> {
	const cached = DEFERRED_PRESET_CACHE.get(name);
	if (cached !== undefined) {
		return Promise.resolve(cached);
	}

	const inFlight = DEFERRED_PRESET_PROMISE_CACHE.get(name);
	if (inFlight) {
		return inFlight;
	}

	const promise = import('./battle-royale-presets.js')
		.then(({ BATTLE_ROYALE_PRESETS }) => {
			const sequence = BATTLE_ROYALE_PRESETS[name] ?? null;
			DEFERRED_PRESET_CACHE.set(name, sequence);
			DEFERRED_PRESET_PROMISE_CACHE.delete(name);
			return sequence;
		})
		.catch((error) => {
			DEFERRED_PRESET_PROMISE_CACHE.delete(name);
			throw error;
		});

	DEFERRED_PRESET_PROMISE_CACHE.set(name, promise);
	return promise;
}
