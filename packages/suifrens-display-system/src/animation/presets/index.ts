// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { DEFERRED_PRESETS } from '../../generated/preset-catalogues.js';
import type { AnimationSequence, PlaybackOptions } from '../../types/animation.type.js';
import { normalizePlayback } from '../sequence-player.js';
import { CORE_PRESET_SEQUENCES } from './core.js';

const PRESETS: Record<string, AnimationSequence> = {
	...CORE_PRESET_SEQUENCES,
	...DEFERRED_PRESETS,
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
