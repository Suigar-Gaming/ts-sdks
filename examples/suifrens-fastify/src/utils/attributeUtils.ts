import { earGeneToEarShape } from '@suigar/suifrens-display-system/attributes';
import type { BullsharkAttributes } from '@suigar/suifrens-display-system/types';
import type { CapyAttributes } from '@suigar/suifrens-display-system/types';
import { type SuiFrenAttributes } from '@suigar/suifrens-display-system/types';

export function parseSuiFrenAttributes(
	suiFrenType: 'CAPY' | 'BULLSHARK',
	[skin, mainColor, secondaryColor, expression, ...otherAttributes]: Array<string>,
): SuiFrenAttributes {
	if (suiFrenType === 'CAPY') {
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
