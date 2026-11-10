// Original character renderer by Mysten Labs. Suigar adapted it and added gesture support.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import { AnimatedAccessory } from '../../animation/AnimatedAccessory.js';
import { getAccessoryLayers } from '../../helpers/accessory-layers.js';
import { getThemeFromSkin } from '../../helpers/bullshark-theme.js';
import type { BullsharkImageProps } from '../../types/bullshark.type.js';
import { AccessorySlot } from '../accessories/AccessorySlot.js';
import { GestureArm } from '../shared/arms/left/GestureArm.js';
import { LeftArm } from './arms/left/LeftArm.js';
import { LeftArmPattern } from './arms/left/LeftArmPattern.js';
import { RightArm } from './arms/right/RightArm.js';
import { RightArmPattern } from './arms/right/RightArmPattern.js';
import { Body } from './body/Body.js';
import { BodyPattern } from './body/BodyPattern.js';
import { Expression } from './Expression.js';
import { Fin } from './fin/Fin.js';
import { FinPattern } from './fin/FinPattern.js';
import { Head } from './head/Head.js';
import { HeadPattern } from './head/HeadPattern.js';
import { LeftLeg } from './legs/left/LeftLeg.js';
import { LeftLegPattern } from './legs/left/LeftLegPattern.js';
import { RightLeg } from './legs/right/RightLeg.js';
import { RightLegPattern } from './legs/right/RightLegPattern.js';
import { Tail } from './tail/Tail.js';
import { TailPattern } from './tail/TailPattern.js';

function BullsharkHead({
	attributes,
	accessoriesByType = {},
	incognito = false,
	colorTheme,
}: Pick<BullsharkImageProps, 'attributes' | 'accessoriesByType' | 'incognito'> & {
	colorTheme: ReturnType<typeof getThemeFromSkin>;
}) {
	const { skin, expression } = attributes;
	return (
		<>
			<Head fill={colorTheme.head} />
			{!incognito && <HeadPattern skin={skin} fill={colorTheme.patterns} />}
			{!incognito && <Expression expression={expression} />}
			<AccessorySlot accessory={accessoriesByType['head']} species="bullshark" />
			<AccessorySlot accessory={accessoriesByType['eyes']} species="bullshark" />
		</>
	);
}

function BullsharkFin({
	attributes,
	accessoriesByType = {},
	incognito = false,
	colorTheme,
}: Pick<BullsharkImageProps, 'attributes' | 'accessoriesByType' | 'incognito'> & {
	colorTheme: ReturnType<typeof getThemeFromSkin>;
}) {
	const headAccessory = accessoriesByType['head'];
	if (headAccessory && !headAccessory.renderOptions.showFin) {
		return null;
	}
	return (
		<>
			<Fin fill={colorTheme.fin} />
			{!incognito && <FinPattern skin={attributes.skin} fill={colorTheme.patterns} />}
		</>
	);
}

export function BullsharkImage({
	attributes,
	gesture,
	accessoriesByType = {},
	detail = 'full',
	incognito = false,
	renderMicrophoneArmInForeground = false,
}: BullsharkImageProps) {
	const { mainColor, secondaryColor, skin } = attributes;
	const colorTheme = getThemeFromSkin(skin, `#${mainColor}`, `#${secondaryColor}`);
	const layers = getAccessoryLayers(accessoriesByType);
	// Held objects retain their native grip and take precedence over a free-hand gesture.
	const freeHandGesture = accessoriesByType['object'] ? undefined : gesture;

	const head = (
		<BullsharkHead
			attributes={attributes}
			accessoriesByType={accessoriesByType}
			incognito={incognito}
			colorTheme={colorTheme}
		/>
	);
	const fin = (
		<BullsharkFin
			attributes={attributes}
			accessoriesByType={accessoriesByType}
			incognito={incognito}
			colorTheme={colorTheme}
		/>
	);
	if (detail === 'head') {
		return (
			<>
				{fin}
				{head}
			</>
		);
	}

	const leftArm = (
		<>
			<LeftArm fill={colorTheme.hands} />
			{!incognito && <LeftArmPattern skin={skin} fill={colorTheme.patterns} />}
		</>
	);

	return (
		<>
			<AccessorySlot accessory={layers.wings} species="bullshark" layer="left" />
			<RightArm fill={colorTheme.hands} />
			{!incognito && <RightArmPattern skin={skin} fill={colorTheme.patterns} />}
			<AccessorySlot accessory={accessoriesByType['torso']} species="bullshark" layer="left" />
			<AccessorySlot accessory={accessoriesByType['body']} species="bullshark" layer="left" />
			<Tail fill={colorTheme.tail} />
			{!incognito && <TailPattern skin={skin} fill={colorTheme.patterns} />}
			<RightLeg fill={colorTheme.legs} />
			{!incognito && <RightLegPattern skin={skin} fill={colorTheme.patterns} />}
			{fin}
			<AccessorySlot accessory={layers.wings} species="bullshark" layer="right" />
			<Body fill={colorTheme.body} />
			{!incognito && <BodyPattern skin={skin} fill={colorTheme.patterns} />}
			<AccessorySlot accessory={accessoriesByType['legs']} species="bullshark" layer="body" />
			<AccessorySlot accessory={accessoriesByType['torso']} species="bullshark" layer="body" />
			<LeftLeg fill={colorTheme.legs} />
			{!incognito && <LeftLegPattern skin={skin} fill={colorTheme.patterns} />}
			<AccessorySlot accessory={layers.back} species="bullshark" />
			<AccessorySlot accessory={accessoriesByType['rightFeet']} species="bullshark" />
			<AccessorySlot accessory={accessoriesByType['leftFeet']} species="bullshark" />
			<AccessorySlot accessory={layers.feet} species="bullshark" />
			<AccessorySlot accessory={accessoriesByType['legs']} species="bullshark" />
			<AccessorySlot accessory={accessoriesByType['body']} species="bullshark" layer="body" />
			{!renderMicrophoneArmInForeground && (
				<AccessorySlot accessory={accessoriesByType['object']} species="bullshark" />
			)}
			{!renderMicrophoneArmInForeground && !freeHandGesture && leftArm}
			<AccessorySlot accessory={accessoriesByType['torso']} species="bullshark" layer="right" />
			<AccessorySlot accessory={accessoriesByType['body']} species="bullshark" layer="right" />
			{head}
			{freeHandGesture && <GestureArm gesture={freeHandGesture} armColor={colorTheme.hands} />}
			{renderMicrophoneArmInForeground && (
				<>
					<AccessorySlot accessory={accessoriesByType['object']} species="bullshark" />
					<AnimatedAccessory fallbackPart="leftArm">
						<g>{leftArm}</g>
					</AnimatedAccessory>
				</>
			)}
		</>
	);
}
