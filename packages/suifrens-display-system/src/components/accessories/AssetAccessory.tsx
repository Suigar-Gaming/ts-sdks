import { AnimatedAccessory } from '../../animation/AnimatedAccessory.js';
import type { AnimationPart } from '../../animation/parts.js';
import {
	ACCESSORY_ASSET_MANIFEST,
	type AccessoryAssetVariant,
	SPLIT_LIMB_ASSET_NAMES,
} from '../../generated/accessoryAssetManifest.js';
import type { AccessoryRendererProps, BodyAccessoryProps } from './AccessorySlot.js';
import { getVipCrownAssetSrc, getVipCrownAssetViewport } from './crownAssets.js';
import { SoccerTeamSwimTrunks } from './legs/SoccerTeamSwimTrunks.js';
import { RUNNER_ACCESSORY_NAMES, RunnerAccessory } from './runnerKit.js';
import {
	resolveSoccerCountryCode,
	resolveSoccerTeamSide,
	SOCCER_TEAM_ACCESSORY_NAMES,
} from './soccerTeamKit.js';
import { SvgAccessory } from './SvgAccessory.js';
import { SoccerTeamShirt } from './torso/SoccerTeamShirt.js';

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
	if (RUNNER_ACCESSORY_NAMES.has(props.accessory.name)) {
		return (
			<AnimatedAccessory fallbackPart={resolveFallbackPart(props)}>
				<RunnerAccessory {...props} />
			</AnimatedAccessory>
		);
	}

	if (SOCCER_TEAM_ACCESSORY_NAMES.has(props.accessory.name)) {
		const fallbackPart = props.accessory.renderOptions.animationPart ?? resolveFallbackPart(props);
		const country =
			props.accessory.renderOptions.teamKit ??
			resolveSoccerCountryCode(props.accessory.renderOptions.country);
		const side = resolveSoccerTeamSide(props.accessory.renderOptions.side);
		const renderedAccessory =
			props.accessory.name === 'soccer team shirt' ? (
				<SoccerTeamShirt lor={props.lor} body={props.body} country={country} side={side} />
			) : (
				<SoccerTeamSwimTrunks body={props.body} country={country} side={side} />
			);

		return <AnimatedAccessory fallbackPart={fallbackPart}>{renderedAccessory}</AnimatedAccessory>;
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
