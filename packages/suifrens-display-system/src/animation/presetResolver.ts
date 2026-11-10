import { getCorePresetSequence } from './corePresets.js';
import type { AnimationSequence } from './types.js';

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

const deferredPresetCache = new Map<string, AnimationSequence | null>();
const deferredPresetPromiseCache = new Map<string, Promise<AnimationSequence | null>>();

export function resolvePresetSequenceSync(name: string) {
	return getCorePresetSequence(name);
}

export function isDeferredPreset(name: string) {
	return DEFERRED_PRESET_NAMES.has(name);
}

export function loadDeferredPresetSequence(name: string) {
	const cached = deferredPresetCache.get(name);
	if (cached !== undefined) {
		return Promise.resolve(cached);
	}

	const inFlight = deferredPresetPromiseCache.get(name);
	if (inFlight) {
		return inFlight;
	}

	const promise = import('./battleRoyalePresets.js')
		.then(({ BATTLE_ROYALE_PRESETS }) => {
			const sequence = BATTLE_ROYALE_PRESETS[name] ?? null;
			deferredPresetCache.set(name, sequence);
			deferredPresetPromiseCache.delete(name);
			return sequence;
		})
		.catch((error) => {
			deferredPresetPromiseCache.delete(name);
			throw error;
		});

	deferredPresetPromiseCache.set(name, promise);
	return promise;
}
