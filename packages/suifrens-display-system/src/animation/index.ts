export {
	AnimationProvider,
	useAnimationController,
	useAnimationStore,
} from './AnimationContext.js';
export { AnimatedAccessory } from './AnimatedAccessory.js';
export { useAnimatedPartTransform } from './useAnimatedPartTransform.js';
export { getPresetSequence } from './presets.js';

export type { AnimationPart } from '../types/animation.type.js';

export type {
	AnimationConfig,
	AnimationDirection,
	AnimationKeyframe,
	AnimationSequence,
	AnimationTrack,
	EasingName,
	PartPose,
	PlaybackOptions,
	PlayState,
} from '../types/animation.type.js';
