// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { AccessoryMetadata } from '../types/accessory.type.js';

function getAccessorySlotKey(accessory: AccessoryMetadata) {
	if (accessory.type === 'feet') {
		if (accessory.renderOptions.animationPart === 'leftLeg') {
			return 'leftFeet';
		}
		if (accessory.renderOptions.animationPart === 'rightLeg') {
			return 'rightFeet';
		}
	}

	return accessory.type;
}

export function getAccessoriesByType(accessories: Array<AccessoryMetadata>) {
	return accessories.reduce<Record<string, AccessoryMetadata>>((accumulator, accessory) => {
		accumulator[getAccessorySlotKey(accessory)] = accessory;
		return accumulator;
	}, {});
}
