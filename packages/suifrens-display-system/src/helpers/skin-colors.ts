// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import type { SuiFrenSkin } from '../types/appearance.type.js';
import { assertUnreachable } from '../utils/assert-unreachable.js';

export function getSkinColors(skin: SuiFrenSkin, mainColor: string, secondaryColor: string) {
	switch (skin) {
		case 'basic':
		case 'cheetah':
		case 'fox':
		case 'stripes':
		case 'dalmation':
		case 'lizard':
		case 'snake':
			return { head: mainColor, body: mainColor, patterns: secondaryColor };
		case 'panda':
			return { head: secondaryColor, body: secondaryColor, patterns: mainColor };
		default:
			return assertUnreachable(skin);
	}
}
