// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { expect, test } from 'vitest';
import { shouldRenderMicrophoneArmInForeground } from '../../../src/helpers/accessories/foreground-layering.js';
import type { AccessoryMetadata } from '../../../src/types/accessory.type.js';

const cup: AccessoryMetadata = {
	type: 'object',
	name: 'sprint cup',
	category: 'award',
	collection: 'race',
	description: '',
	price: 0,
	quantity: null,
	renderOptions: { animationPart: 'leftArm', foreground: true },
};
test('foreground left-hand objects retain the gripping arm layer, including static held poses', () => {
	expect(shouldRenderMicrophoneArmInForeground(null, { object: cup })).toBe(true);
	expect(
		shouldRenderMicrophoneArmInForeground(null, {
			object: { ...cup, renderOptions: { animationPart: 'leftArm' } },
		}),
	).toBe(false);
	expect(
		shouldRenderMicrophoneArmInForeground(null, {
			object: { ...cup, renderOptions: { animationPart: 'rightArm', foreground: true } },
		}),
	).toBe(false);
	expect(shouldRenderMicrophoneArmInForeground(null)).toBe(false);
});
