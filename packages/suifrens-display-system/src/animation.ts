export {
	AnimationProvider,
	useAnimationController,
	useAnimationStore,
} from './animation/AnimationContext.js';
export { AnimatedAccessory } from './animation/AnimatedAccessory.js';
export { useAnimatedPartTransform } from './animation/useAnimatedPartTransform.js';
export { getPresetSequence } from './animation/presets.js';

export type { AnimationPart } from './types/animation.type.js';

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
} from './types/animation.type.js';
