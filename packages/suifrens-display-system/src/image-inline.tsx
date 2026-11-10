import { InlineAccessory } from './components/accessories/index.js';
import { SuiFrenImageView } from './components/SuiFrenImageView.js';
import type { SuiFrenImageProps } from './types/suifren.type.js';

export function SuiFrenImage(props: SuiFrenImageProps) {
	return <SuiFrenImageView {...props} accessoryRenderer={InlineAccessory} />;
}

export type { SuiFrenImageProps, SuiFrenRenderSize } from './types/suifren.type.js';
