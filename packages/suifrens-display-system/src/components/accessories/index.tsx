// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { AnimatedAccessory } from '../../animation/AnimatedAccessory.js';
import { VIP_CROWN_IMAGE_VIEWPORT } from '../../constants/crown-viewport.js';
import { INLINE_CROWNS } from '../../generated/accessory-assets/crown-data-urls.js';
import { INLINE_ACCESSORY_LAYERS } from '../../generated/accessory-assets/inline-layers.js';
import { getVipCrownAssetViewport } from '../../helpers/accessories/crown-assets.js';
import { resolveAccessoryAnimationPart } from '../../helpers/animation/accessory-animation-part.js';
import { isKitAccessory } from '../../helpers/kits/kit-accessory.js';
import type { AccessoryRendererProps } from '../../types/accessory.type.js';
import { KitArtwork } from './KitArtwork.js';
import { SvgAccessory } from './SvgAccessory.js';
import { SvgArtwork } from './SvgArtwork.js';

export function InlineAccessory(props: AccessoryRendererProps) {
	const name = props.accessory.name;
	const layers = Object.hasOwn(INLINE_ACCESSORY_LAYERS, name)
		? INLINE_ACCESSORY_LAYERS[name]
		: undefined;
	const source = layers?.[props.layer ?? 'default'] ?? layers?.['default'];
	const inlineCrown =
		props.accessory.category === 'crowns' && Object.hasOwn(INLINE_CROWNS, name)
			? INLINE_CROWNS[name]
			: undefined;
	const assetSrc = props.accessory.renderOptions.assetSrc ?? inlineCrown;
	const fallbackPart = resolveAccessoryAnimationPart(props);

	if (isKitAccessory(name)) {
		return <KitArtwork {...props} fallbackPart={fallbackPart} />;
	}
	if ((assetSrc == null || assetSrc === '') && source != null && source !== '') {
		return <SvgArtwork source={source} fallbackPart={fallbackPart} />;
	}
	if (assetSrc == null || assetSrc === '') {
		return null;
	}
	return (
		<AnimatedAccessory fallbackPart={fallbackPart}>
			<SvgAccessory
				assetSrc={assetSrc}
				viewport={
					assetSrc === inlineCrown ? VIP_CROWN_IMAGE_VIEWPORT : getVipCrownAssetViewport(assetSrc)
				}
				species={props.species}
				placement={props.accessory.renderOptions.placement}
			/>
		</AnimatedAccessory>
	);
}
