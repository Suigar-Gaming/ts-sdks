// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { AccessoryMetadata } from '../types/accessory.type.js';
import type { AnimationConfig } from '../types/animation.type.js';

export function shouldRenderMicrophoneArmInForeground(
	animation: AnimationConfig | null,
	accessoriesByType?: Record<string, AccessoryMetadata>,
): boolean {
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
