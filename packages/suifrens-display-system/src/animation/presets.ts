import { BATTLE_ROYALE_PRESETS } from './battleRoyalePresets.js';
import { CORE_PRESET_SEQUENCES } from './corePresets.js';
import type { AnimationSequence } from './types.js';

const PRESETS: Record<string, AnimationSequence> = {
	...CORE_PRESET_SEQUENCES,
	victory: CORE_PRESET_SEQUENCES['celebrate'],
	...BATTLE_ROYALE_PRESETS,
};

export function getPresetSequence(name: string): AnimationSequence | undefined {
	return PRESETS[name];
}
