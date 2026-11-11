// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import type { SuiFrenSkin } from '../../types/appearance.type.js';
import type { CapyTheme } from '../../types/capy.type.js';
import { getSkinColors } from './skin-colors.js';

export function getThemeFromSkin(
	skin: SuiFrenSkin,
	mainColor: string,
	secondaryColor: string,
	incognito: boolean,
): CapyTheme {
	const extremityColor = incognito ? '#ffffff' : '#4e4943';
	return {
		...getSkinColors(skin, mainColor, secondaryColor),
		legs: mainColor,
		arms: mainColor,
		outerEars: mainColor,
		innerEars: secondaryColor,
		nose: extremityColor,
		appendages: extremityColor,
	};
}
