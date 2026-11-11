// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import type { SuiFrenSkin } from '../../types/appearance.type.js';
import type { BullsharkTheme } from '../../types/bullshark.type.js';
import { getSkinColors } from './skin-colors.js';

export function getThemeFromSkin(
	skin: SuiFrenSkin,
	mainColor: string,
	secondaryColor: string,
): BullsharkTheme {
	return {
		...getSkinColors(skin, mainColor, secondaryColor),
		legs: mainColor,
		hands: mainColor,
		fin: mainColor,
		tail: mainColor,
	};
}
