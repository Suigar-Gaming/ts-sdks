// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { AnimationSequence, PlaybackOptions } from '../types/animation.type.js';
import { BATTLE_ROYALE_PRESETS } from './battle-royale-presets.js';
import { CORE_PRESET_SEQUENCES } from './core-presets.js';
import { normalizePlayback } from './sequence-player.js';

const PRESETS: Record<string, AnimationSequence> = {
	...CORE_PRESET_SEQUENCES,
	...BATTLE_ROYALE_PRESETS,
};

export function getPresetSequence(name: string): AnimationSequence | undefined {
	return PRESETS[name];
}

export function getPresetDurationMs(preset: string, playback?: PlaybackOptions): number | null {
	const sequence = getPresetSequence(preset);
	if (!sequence) {
		return null;
	}
	const { iterations, speed } = normalizePlayback(playback);
	if (!Number.isFinite(iterations)) {
		return null;
	}
	return (sequence.duration / speed) * iterations;
}
