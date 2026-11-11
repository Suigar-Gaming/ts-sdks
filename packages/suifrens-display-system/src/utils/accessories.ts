// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import type { AccessorySlots, SuiFrenAccessory } from '../types/accessory.type.js';

function getAccessorySlotKey(accessory: SuiFrenAccessory): string {
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

export function getAccessoriesByType<T extends SuiFrenAccessory>(
	accessories: ReadonlyArray<T>,
): AccessorySlots<T> {
	return accessories.reduce<AccessorySlots<T>>((accumulator, accessory) => {
		accumulator[getAccessorySlotKey(accessory)] = accessory;
		return accumulator;
	}, Object.create(null));
}
