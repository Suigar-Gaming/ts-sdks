// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import type { COLORS } from '../colors/index.js';
import type { ALL_EXPRESSIONS } from '../constants/expressions.js';
import type { SUIFREN_SKINS } from '../constants/skins.js';

export type SuiFrenSkin = (typeof SUIFREN_SKINS)[number];
export type SuiFrenExpression = (typeof ALL_EXPRESSIONS)[number];

export type SuiFrenAppearance = {
	mainColor: keyof typeof COLORS;
	secondaryColor: keyof typeof COLORS;
	skin: SuiFrenSkin;
	expression: SuiFrenExpression;
};
