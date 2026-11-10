// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { AnimatedAccessory } from '../../animation/AnimatedAccessory.js';
import {
	ACCESSORY_ASSET_MANIFEST,
	SPLIT_LIMB_ASSET_NAMES,
} from '../../generated/accessory-asset-manifest.js';
import { getVipCrownAssetSrc, getVipCrownAssetViewport } from '../../helpers/crown-assets.js';
import { isKitAccessory } from '../../helpers/kit-accessory.js';
import type {
	AccessoryAssetVariant,
	AccessoryRendererProps,
	BodyAccessoryProps,
} from '../../types/accessory.type.js';
import type { AnimationPart } from '../../types/animation.type.js';
import { KitArtwork } from './KitArtwork.js';
import { SvgAccessory } from './SvgAccessory.js';

const TYPE_FALLBACK: Partial<Record<string, AnimationPart>> = {
	head: 'head',
	eyes: 'head',
	body: 'body',
	torso: 'body',
	back: 'body',
	object: 'leftArm',
	legs: 'body',
	feet: 'rightLeg',
};

const NAME_SPECIFIC_FALLBACK: Partial<Record<string, AnimationPart>> = {
	wings: 'body',
	'superhero cape': 'body',
};

function resolveFallbackPart(
	props: Pick<AccessoryRendererProps, 'accessory' | 'body' | 'lor'>,
): AnimationPart | undefined {
	const { name, type } = props.accessory;
	const nameSpecificPart = NAME_SPECIFIC_FALLBACK[name];
	if (nameSpecificPart) {
		return nameSpecificPart;
	}

	if ((type === 'body' || type === 'torso') && props.lor === 'left') {
		return 'rightArm';
	}
	if ((type === 'body' || type === 'torso') && props.lor === 'right') {
		return 'leftArm';
	}
	if (props.body) {
		return 'body';
	}

	return TYPE_FALLBACK[type];
}

function resolveVariant(props: BodyAccessoryProps): AccessoryAssetVariant {
	if (props.body) {
		return 'body';
	}
	return props.lor ?? 'default';
}

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
	return assetSrc ? { assetSrc, symbolId: resolveVariant(props) } : undefined;
}

export function AssetAccessory(props: AccessoryRendererProps) {
	if (isKitAccessory(props.accessory.name)) {
		return (
			<KitArtwork
				{...props}
				fallbackPart={props.accessory.renderOptions.animationPart ?? resolveFallbackPart(props)}
			/>
		);
	}

	const asset = resolveAssetSrc(props);
	if (!asset) {
		return null;
	}

	if (
		asset.symbolId &&
		SPLIT_LIMB_ASSET_NAMES.has(props.accessory.name) &&
		(props.accessory.type === 'feet' || (props.accessory.type === 'legs' && !props.body))
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

	const fallbackPart = props.accessory.renderOptions.animationPart ?? resolveFallbackPart(props);

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
