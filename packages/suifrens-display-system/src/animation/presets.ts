import type { AnimationSequence } from '../types/animation.type.js';
import { BATTLE_ROYALE_PRESETS } from './battle-royale-presets.js';
import { CORE_PRESET_SEQUENCES } from './core-presets.js';

const PRESETS: Record<string, AnimationSequence> = {
	...CORE_PRESET_SEQUENCES,
	...BATTLE_ROYALE_PRESETS,
};

export function getPresetSequence(name: string): AnimationSequence | undefined {
	return PRESETS[name];
}
