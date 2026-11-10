// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { AnimatedAccessory } from '../../animation/AnimatedAccessory.js';
import { ARTWORK } from '../../generated/inline-artwork.js';
import { getVipCrownAssetSrc, getVipCrownAssetViewport } from '../../helpers/crown-assets.js';
import { isKitAccessory } from '../../helpers/kit-accessory.js';
import type { AccessoryMetadata, AccessoryRendererProps } from '../../types/accessory.type.js';
import type { AnimationPart } from '../../types/animation.type.js';
import { KitArtwork } from './KitArtwork.js';
import { SvgAccessory } from './SvgAccessory.js';
import { SvgArtwork } from './SvgArtwork.js';

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
	accessory: Pick<AccessoryMetadata, 'name' | 'type'>,
): AnimationPart | undefined {
	const { name, type } = accessory;
	const specific = NAME_SPECIFIC_FALLBACK[name];
	if (specific) {
		return specific;
	}
	return TYPE_FALLBACK[type];
}

function resolveAssetSrc(accessory: AccessoryMetadata): string | undefined {
	return (
		accessory.renderOptions.assetSrc ??
		(accessory.category === 'crowns' ? getVipCrownAssetSrc(accessory.name) : undefined)
	);
}

export function InlineAccessory(props: AccessoryRendererProps) {
	const name = props.accessory.name;
	const layers = Object.hasOwn(ARTWORK, name) ? ARTWORK[name] : undefined;
	const source = layers?.[props.body ? 'body' : (props.lor ?? 'default')] ?? layers?.['default'];
	const assetSrc = resolveAssetSrc(props.accessory);
	const fallbackPart =
		props.accessory.renderOptions.animationPart ?? resolveFallbackPart(props.accessory);

	if (isKitAccessory(name)) {
		return <KitArtwork {...props} fallbackPart={fallbackPart} />;
	}
	if (source) {
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
