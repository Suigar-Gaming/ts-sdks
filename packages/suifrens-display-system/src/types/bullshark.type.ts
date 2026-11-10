// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { AccessorySlots } from './accessory.type.js';
import type { SuiFrenAppearance } from './appearance.type.js';
import type { SuiFrenGestureProps } from './gesture.type.js';

export type BullsharkImageProps = SuiFrenGestureProps & {
	attributes: BullsharkAttributes;
	accessoriesByType?: AccessorySlots;
	detail?: 'full' | 'head';
	incognito?: boolean;
	renderMicrophoneArmInForeground?: boolean;
};

export type BullsharkFinStyle = 'classic';

export type BullsharkAttributes = SuiFrenAppearance & {
	finStyle: BullsharkFinStyle;
};

export type BullsharkTheme = {
	head: string;
	body: string;
	legs: string;
	hands: string;
	fin: string;
	tail: string;
	patterns: string;
};
