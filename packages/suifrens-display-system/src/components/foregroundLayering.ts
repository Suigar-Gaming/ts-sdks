import type { AnimationConfig } from '../animation/types.js';
import type { AccessoryMetadata } from '../utils/accessoryUtils.js';

export function shouldRenderMicrophoneArmInForeground(
	animation: AnimationConfig | null,
	accessoriesByType?: Record<string, AccessoryMetadata>,
) {
	const objectAccessory = accessoriesByType?.['object'];
	if (
		objectAccessory?.renderOptions.foreground === true &&
		objectAccessory.renderOptions.animationPart === 'leftArm'
	) {
		return true;
	}
	if (objectAccessory?.name !== 'microphone' || !animation) {
		return false;
	}

	if ('preset' in animation) {
		return animation.preset === 'talkMicrophone';
	}

	return animation.sequence.name === 'talkMicrophone';
}
