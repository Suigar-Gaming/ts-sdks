// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import { EAR_GENE_TO_EAR_SHAPE, SUIFREN_SKINS } from '@suigar/suifrens-display-system/attributes';
import { COLORS } from '@suigar/suifrens-display-system/colors';
import { ALL_EXPRESSIONS } from '@suigar/suifrens-display-system/expressions';
import type { SuiFrenAttributes, SuiFrenSpecies } from '@suigar/suifrens-display-system/types';

function isColor(value: string | undefined): value is keyof typeof COLORS {
	return value != null && Object.hasOwn(COLORS, value);
}

export function parseSuiFrenAttributes(
	species: SuiFrenSpecies,
	[rawSkin, rawMainColor, rawSecondaryColor, rawExpression, trait]: ReadonlyArray<string>,
): SuiFrenAttributes {
	const mainColor = rawMainColor?.toLowerCase();
	const secondaryColor = rawSecondaryColor?.toLowerCase();
	const skin = SUIFREN_SKINS.find((value) => value === rawSkin);
	const expression = ALL_EXPRESSIONS.find((value) => value === rawExpression);
	if (!skin || !expression || !isColor(mainColor) || !isColor(secondaryColor)) {
		throw new TypeError(`Invalid ${species} appearance attributes`);
	}
	const appearance = { skin, expression, mainColor, secondaryColor };
	if (
		species === 'capy' &&
		trait != null &&
		trait !== '' &&
		Object.hasOwn(EAR_GENE_TO_EAR_SHAPE, trait)
	) {
		const earShape = EAR_GENE_TO_EAR_SHAPE[trait];
		if (earShape) {
			return { ...appearance, earShape };
		}
	}
	if (species === 'bullshark' && trait === 'classic') {
		return { ...appearance, finStyle: trait };
	}
	throw new TypeError(`Invalid ${species} trait`);
}
