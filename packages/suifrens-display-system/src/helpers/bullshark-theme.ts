// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { SuiFrenSkin } from '../types/appearance.type.js';
import type { BullsharkTheme } from '../types/bullshark.type.js';
import { assertUnreachable } from '../utils/assert-unreachable.js';

export function getThemeFromSkin(
	skin: SuiFrenSkin,
	mainColor: string,
	secondaryColor: string,
): BullsharkTheme {
	switch (skin) {
		case 'basic':
		case 'cheetah':
		case 'fox':
		case 'stripes':
		case 'dalmation':
		case 'lizard':
		case 'snake':
			return {
				head: mainColor,
				body: mainColor,
				legs: mainColor,
				hands: mainColor,
				fin: mainColor,
				tail: mainColor,
				patterns: secondaryColor,
			};
		case 'panda':
			return {
				head: secondaryColor,
				body: secondaryColor,
				legs: mainColor,
				hands: mainColor,
				fin: mainColor,
				tail: mainColor,
				patterns: mainColor,
			};
		default:
			assertUnreachable(skin);
	}
}
