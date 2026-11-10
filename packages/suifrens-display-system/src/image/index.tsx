import { AssetAccessory } from '../components/accessories/AssetAccessory.js';
import { SuiFrenImageView } from '../components/SuiFrenImageView.js';
import type { SuiFrenImageProps } from '../types/suifren.type.js';

export function SuiFrenImage(props: SuiFrenImageProps) {
	return <SuiFrenImageView {...props} accessoryRenderer={AssetAccessory} />;
}

export type { SuiFrenImageProps } from '../types/suifren.type.js';

export type { SuiFrenRenderSize } from '../types/suifren.type.js';

export { BullsharkImage } from '../components/bullshark/BullsharkImage.js';

export type { BullsharkImageProps } from '../types/bullshark.type.js';

export { CapyImage } from '../components/capy/CapyImage.js';

export type { CapyImageProps } from '../types/capy.type.js';

export type { SuiFrenAttributes, SuiFrenType } from '../types/suifren.type.js';

export type {
	BullsharkAttributes,
	BullsharkExpression,
	BullsharkFinStyle,
	BullsharkSkin,
} from '../types/bullshark.type.js';

export type { CapyAttributes, CapyEarShape, CapyExpression, CapySkin } from '../types/capy.type.js';
