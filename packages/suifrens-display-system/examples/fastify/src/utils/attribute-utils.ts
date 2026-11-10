// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import { earGeneToEarShape, SUIFREN_SKINS } from '@suigar/suifrens-display-system/attributes';
import { colors } from '@suigar/suifrens-display-system/colors';
import { ALL_EXPRESSIONS } from '@suigar/suifrens-display-system/expressions';
import type { SuiFrenAttributes, SuiFrenSpecies } from '@suigar/suifrens-display-system/types';

function isColor(value: string | undefined): value is keyof typeof colors {
	return value !== undefined && Object.hasOwn(colors, value);
}

export function parseSuiFrenAttributes(
	species: SuiFrenSpecies,
	[rawSkin, mainColor, secondaryColor, rawExpression, trait]: ReadonlyArray<string>,
): SuiFrenAttributes {
	const skin = SUIFREN_SKINS.find((value) => value === rawSkin);
	const expression = ALL_EXPRESSIONS.find((value) => value === rawExpression);
	if (!skin || !expression || !isColor(mainColor) || !isColor(secondaryColor)) {
		throw new TypeError(`Invalid ${species} appearance attributes`);
	}
	const appearance = { skin, expression, mainColor, secondaryColor };
	if (species === 'capy' && trait && Object.hasOwn(earGeneToEarShape, trait)) {
		const earShape = earGeneToEarShape[trait];
		if (earShape) {
			return { ...appearance, earShape };
		}
	}
	if (species === 'bullshark' && trait === 'classic') {
		return { ...appearance, finStyle: trait };
	}
	throw new TypeError(`Invalid ${species} trait`);
}
