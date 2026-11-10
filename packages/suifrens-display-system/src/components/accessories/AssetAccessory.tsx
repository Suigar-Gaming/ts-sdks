// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { AnimatedAccessory } from '../../animation/AnimatedAccessory.js';
import {
	ACCESSORY_ASSET_MANIFEST,
	SPLIT_LIMB_ASSET_NAMES,
} from '../../generated/accessory-asset-manifest.js';
import { resolveAccessoryAnimationPart } from '../../helpers/accessory-animation-part.js';
import { getVipCrownAssetSrc, getVipCrownAssetViewport } from '../../helpers/crown-assets.js';
import { isKitAccessory } from '../../helpers/kit-accessory.js';
import type { AccessoryAssetVariant, AccessoryRendererProps } from '../../types/accessory.type.js';
import { KitArtwork } from './KitArtwork.js';
import { SvgAccessory } from './SvgAccessory.js';

function resolveAssetSrc(
	props: AccessoryRendererProps,
): { assetSrc: string; symbolId?: AccessoryAssetVariant } | undefined {
	const explicitAsset =
		props.accessory.renderOptions.assetSrc ??
		(props.accessory.category === 'crowns' ? getVipCrownAssetSrc(props.accessory.name) : undefined);
	if (explicitAsset) {
		return { assetSrc: explicitAsset };
	}

	const assetSrc =
		ACCESSORY_ASSET_MANIFEST[props.accessory.name as keyof typeof ACCESSORY_ASSET_MANIFEST];
	return assetSrc ? { assetSrc, symbolId: props.layer ?? 'default' } : undefined;
}

export function AssetAccessory(props: AccessoryRendererProps) {
	if (isKitAccessory(props.accessory.name)) {
		return <KitArtwork {...props} fallbackPart={resolveAccessoryAnimationPart(props)} />;
	}

	const asset = resolveAssetSrc(props);
	if (!asset) {
		return null;
	}

	if (
		asset.symbolId &&
		SPLIT_LIMB_ASSET_NAMES.has(props.accessory.name) &&
		(props.accessory.type === 'feet' || (props.accessory.type === 'legs' && props.layer !== 'body'))
	) {
		return (
			<>
				<AnimatedAccessory fallbackPart="rightLeg">
					<SvgAccessory
						assetSrc={asset.assetSrc}
						symbolId="rightLeg"
						species={props.species}
						placement={props.accessory.renderOptions.placement}
					/>
				</AnimatedAccessory>
				<AnimatedAccessory fallbackPart="leftLeg">
					<SvgAccessory
						assetSrc={asset.assetSrc}
						symbolId="leftLeg"
						species={props.species}
						placement={props.accessory.renderOptions.placement}
					/>
				</AnimatedAccessory>
			</>
		);
	}

	const fallbackPart = resolveAccessoryAnimationPart(props);

	return (
		<AnimatedAccessory fallbackPart={fallbackPart}>
			<SvgAccessory
				assetSrc={asset.assetSrc}
				symbolId={asset.symbolId}
				viewport={getVipCrownAssetViewport(asset.assetSrc)}
				species={props.species}
				placement={props.accessory.renderOptions.placement}
			/>
		</AnimatedAccessory>
	);
}
