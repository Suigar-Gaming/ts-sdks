// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { AnimatedAccessory } from '../../animation/AnimatedAccessory.js';
import { ARTWORK } from '../../generated/inline-artwork.js';
import { resolveAccessoryAnimationPart } from '../../helpers/accessory-animation-part.js';
import { resolveAccessoryAssetOverride } from '../../helpers/accessory-asset-override.js';
import { getVipCrownAssetViewport } from '../../helpers/crown-assets.js';
import { isKitAccessory } from '../../helpers/kit-accessory.js';
import type { AccessoryRendererProps } from '../../types/accessory.type.js';
import { KitArtwork } from './KitArtwork.js';
import { SvgAccessory } from './SvgAccessory.js';
import { SvgArtwork } from './SvgArtwork.js';

export function InlineAccessory(props: AccessoryRendererProps) {
	const name = props.accessory.name;
	const layers = Object.hasOwn(ARTWORK, name) ? ARTWORK[name] : undefined;
	const source = layers?.[props.layer ?? 'default'] ?? layers?.['default'];
	const assetSrc = resolveAccessoryAssetOverride(props.accessory);
	const fallbackPart = resolveAccessoryAnimationPart(props);

	if (isKitAccessory(name)) {
		return <KitArtwork {...props} fallbackPart={fallbackPart} />;
	}
	if (!assetSrc && source) {
		return <SvgArtwork source={source} fallbackPart={fallbackPart} />;
	}
	if (!assetSrc) {
		return null;
	}
	return (
		<AnimatedAccessory fallbackPart={fallbackPart}>
			<SvgAccessory
				assetSrc={assetSrc}
				viewport={getVipCrownAssetViewport(assetSrc)}
				species={props.species}
				placement={props.accessory.renderOptions.placement}
			/>
		</AnimatedAccessory>
	);
}
