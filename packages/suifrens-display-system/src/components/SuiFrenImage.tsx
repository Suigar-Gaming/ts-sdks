import type { SuiFrenImageProps } from '../types/suifren.type.js';
import { AssetAccessory } from './accessories/AssetAccessory.js';
import { SuiFrenImageView } from './SuiFrenImageView.js';

export function SuiFrenImage(props: SuiFrenImageProps) {
	return <SuiFrenImageView {...props} accessoryRenderer={AssetAccessory} />;
}
