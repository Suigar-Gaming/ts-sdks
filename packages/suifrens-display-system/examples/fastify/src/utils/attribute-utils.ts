import { earGeneToEarShape } from '@suigar/suifrens-display-system/attributes';
import type {
	BullsharkAttributes,
	CapyAttributes,
	SuiFrenAttributes,
	SuiFrenSpecies,
} from '@suigar/suifrens-display-system/types';

export function parseSuiFrenAttributes(
	species: SuiFrenSpecies,
	[skin, mainColor, secondaryColor, expression, ...otherAttributes]: Array<string>,
): SuiFrenAttributes {
	if (species === 'capy') {
		return {
			skin,
			mainColor,
			secondaryColor,
			expression,
			earShape: earGeneToEarShape[otherAttributes[0]],
		} as CapyAttributes;
	}
	return {
		skin,
		mainColor,
		secondaryColor,
		expression,
		finStyle: otherAttributes[0],
	} as BullsharkAttributes;
}
