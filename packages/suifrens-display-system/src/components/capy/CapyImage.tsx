// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { AnimatedAccessory } from '../../animation/AnimatedAccessory.js';
import { getAccessoryLayers } from '../../helpers/accessory-layers.js';
import { getThemeFromSkin } from '../../helpers/capy-theme.js';
import type { CapyImageProps } from '../../types/capy.type.js';
import { AccessorySlot } from '../accessories/AccessorySlot.js';
import { GestureArm } from '../shared/arms/left/GestureArm.js';
import { LeftArm } from './arms/left/LeftArm.js';
import { LeftArmPattern } from './arms/left/LeftArmPattern.js';
import { RightArm } from './arms/right/RightArm.js';
import { RightArmPattern } from './arms/right/RightArmPattern.js';
import { Body } from './body/Body.js';
import { BodyPattern } from './body/BodyPattern.js';
import { LeftEar } from './ears/LeftEar.js';
import { RightEar } from './ears/RightEar.js';
import { Expression } from './Expression.js';
import { Head } from './head/Head.js';
import { HeadPattern } from './head/HeadPattern.js';
import { LeftLeg } from './legs/left/LeftLeg.js';
import { LeftLegPattern } from './legs/left/LeftLegPattern.js';
import { RightLeg } from './legs/right/RightLeg.js';
import { RightLegPattern } from './legs/right/RightLegPattern.js';
import { Nostrils } from './Nostrils.js';

function CapyHead({
	attributes,
	accessoriesByType = {},
	incognito = false,
	colorTheme,
}: Pick<CapyImageProps, 'attributes' | 'accessoriesByType' | 'incognito'> & {
	colorTheme: ReturnType<typeof getThemeFromSkin>;
}) {
	const { skin, earShape, expression } = attributes;
	const headAccessory = accessoriesByType['head'];
	const runnerHeadband = headAccessory?.name === 'runner headband';
	const showEars = !headAccessory || headAccessory.renderOptions.showEars;

	return (
		<>
			{showEars && !runnerHeadband && (
				<RightEar
					earShape={earShape}
					outerEarProps={{ fill: colorTheme.outerEars }}
					innerEarProps={{ fill: colorTheme.innerEars }}
					fill={colorTheme.outerEars}
				/>
			)}

			<Head fill={colorTheme.head} />
			<HeadPattern skin={skin} fill={colorTheme.patterns} noseProps={{ fill: colorTheme.nose }} />
			{!incognito && <Nostrils />}

			{runnerHeadband && showEars && (
				<RightEar
					earShape={earShape}
					outerEarProps={{ fill: colorTheme.outerEars }}
					innerEarProps={{ fill: colorTheme.innerEars }}
					fill={colorTheme.outerEars}
				/>
			)}

			{showEars && (
				<LeftEar
					earShape={earShape}
					outerEarProps={{ fill: colorTheme.outerEars }}
					innerEarProps={{ fill: colorTheme.innerEars }}
					fill={colorTheme.outerEars}
				/>
			)}

			{runnerHeadband && headAccessory && (
				<AccessorySlot accessory={headAccessory} species="capy" />
			)}

			{!incognito && <Expression expression={expression} />}
			{accessoriesByType['head'] && !runnerHeadband && (
				<AccessorySlot accessory={accessoriesByType['head']} species="capy" />
			)}
			<AccessorySlot accessory={accessoriesByType['eyes']} species="capy" />
		</>
	);
}

export function CapyImage({
	attributes,
	gesture,
	accessoriesByType = {},
	detail = 'full',
	incognito = false,
	renderMicrophoneArmInForeground = false,
}: CapyImageProps) {
	const { mainColor, secondaryColor, skin } = attributes;
	const colorTheme = getThemeFromSkin(skin, `#${mainColor}`, `#${secondaryColor}`, incognito);
	const layers = getAccessoryLayers(accessoriesByType);

	// Held objects retain their native grip and take precedence over a free-hand gesture.
	const freeHandGesture = accessoriesByType['object'] ? undefined : gesture;
	const head = (
		<CapyHead
			attributes={attributes}
			accessoriesByType={accessoriesByType}
			incognito={incognito}
			colorTheme={colorTheme}
		/>
	);
	if (detail === 'head') {
		return head;
	}

	const leftArm = (
		<>
			<LeftArm fill={colorTheme.arms} handProps={{ fill: colorTheme.appendages }} />
			{!incognito && <LeftArmPattern skin={skin} fill={colorTheme.patterns} />}
		</>
	);

	return (
		<>
			<AccessorySlot accessory={layers.wings} species="capy" layer="left" />

			<RightArm fill={colorTheme.arms} handProps={{ fill: colorTheme.appendages }} />
			{!incognito && <RightArmPattern skin={skin} fill={colorTheme.patterns} />}
			<AccessorySlot accessory={layers.wings} species="capy" layer="right" />
			<AccessorySlot accessory={accessoriesByType['torso']} species="capy" layer="left" />
			<AccessorySlot accessory={accessoriesByType['body']} species="capy" layer="left" />

			<RightLeg fill={colorTheme.legs} footProps={{ fill: colorTheme.appendages }} />
			{!incognito && <RightLegPattern skin={skin} fill={colorTheme.patterns} />}

			<Body fill={colorTheme.body} />
			{!incognito && skin && <BodyPattern skin={skin} fill={colorTheme.patterns} />}
			<AccessorySlot accessory={layers.back} species="capy" />
			<AccessorySlot accessory={accessoriesByType['legs']} species="capy" layer="body" />
			<AccessorySlot accessory={accessoriesByType['torso']} species="capy" layer="body" />

			<LeftLeg fill={colorTheme.legs} footProps={{ fill: colorTheme.appendages }} />
			{!incognito && <LeftLegPattern skin={skin} fill={colorTheme.patterns} />}

			<AccessorySlot accessory={accessoriesByType['rightFeet']} species="capy" />
			<AccessorySlot accessory={accessoriesByType['leftFeet']} species="capy" />
			<AccessorySlot accessory={layers.feet} species="capy" />
			<AccessorySlot accessory={accessoriesByType['legs']} species="capy" />
			<AccessorySlot accessory={accessoriesByType['body']} species="capy" layer="body" />
			{!renderMicrophoneArmInForeground && (
				<AccessorySlot accessory={accessoriesByType['object']} species="capy" />
			)}

			{!renderMicrophoneArmInForeground && !freeHandGesture && leftArm}

			<AccessorySlot accessory={accessoriesByType['torso']} species="capy" layer="right" />

			<AccessorySlot accessory={accessoriesByType['body']} species="capy" layer="right" />

			{head}

			{freeHandGesture && (
				<GestureArm
					gesture={freeHandGesture}
					armColor={colorTheme.arms}
					handColor={colorTheme.appendages}
				/>
			)}

			{renderMicrophoneArmInForeground && (
				<>
					<AccessorySlot accessory={accessoriesByType['object']} species="capy" />
					<AnimatedAccessory fallbackPart="leftArm">
						<g>{leftArm}</g>
					</AnimatedAccessory>
				</>
			)}
		</>
	);
}
