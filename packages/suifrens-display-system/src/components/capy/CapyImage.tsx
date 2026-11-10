import { AnimatedAccessory } from '../../animation/AnimatedAccessory.js';
import { getThemeFromSkin } from '../../helpers/capy-theme.js';
import type { CapyImageProps } from '../../types/capy.type.js';
import { AccessorySlot } from '../accessories/AccessorySlot.js';
import { LeftArm } from './arms/left/LeftArm.js';
import { LeftArmPattern } from './arms/left/LeftArmPattern.js';
import { ThumbsUpArm } from './arms/left/ThumbsUpArm.js';
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

export function CapyImage({
	attributes,
	gesture,
	accessoriesByType,
	detail = 'full',
	incognito = false,
	renderMicrophoneArmInForeground = false,
}: CapyImageProps) {
	const { mainColor, secondaryColor, skin, earShape, expression } = attributes;
	const colorTheme = getThemeFromSkin(skin, `#${mainColor}`, `#${secondaryColor}`, incognito);
	const headAccessory = accessoriesByType?.['head'];
	// Held objects retain their native grip and take precedence over a free-hand gesture.
	const thumbsUp = gesture === 'thumbs_up' && !accessoriesByType?.['object'];
	const runnerHeadband = headAccessory?.name === 'runner headband';
	const showEars = !headAccessory || headAccessory.renderOptions.showEars;

	if (detail === 'head') {
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
				{accessoriesByType?.['head'] && !runnerHeadband && (
					<AccessorySlot accessory={accessoriesByType['head']} species="capy" />
				)}
				{accessoriesByType?.['eyes'] && (
					<AccessorySlot accessory={accessoriesByType['eyes']} species="capy" />
				)}
			</>
		);
	}

	return (
		<>
			{accessoriesByType?.['back']?.category === 'wings' && (
				<AccessorySlot accessory={accessoriesByType['back']} species="capy" lor="left" />
			)}

			<RightArm fill={colorTheme.arms} handProps={{ fill: colorTheme.appendages }} />
			{!incognito && <RightArmPattern skin={skin} fill={colorTheme.patterns} />}
			{accessoriesByType?.['back']?.category === 'wings' && (
				<AccessorySlot accessory={accessoriesByType['back']} species="capy" lor="right" />
			)}
			{accessoriesByType?.['torso'] && (
				<AccessorySlot accessory={accessoriesByType['torso']} species="capy" lor="left" />
			)}
			{accessoriesByType?.['body'] && (
				<AccessorySlot accessory={accessoriesByType['body']} species="capy" lor="left" />
			)}

			<RightLeg fill={colorTheme.legs} footProps={{ fill: colorTheme.appendages }} />
			{!incognito && <RightLegPattern skin={skin} fill={colorTheme.patterns} />}

			<Body fill={colorTheme.body} />
			{!incognito && skin && <BodyPattern skin={skin} fill={colorTheme.patterns} />}
			{accessoriesByType?.['back'] && accessoriesByType?.['back']?.category !== 'wings' && (
				<AccessorySlot accessory={accessoriesByType['back']} species="capy" />
			)}
			{accessoriesByType?.['legs'] && (
				<AccessorySlot accessory={accessoriesByType['legs']} species="capy" body />
			)}
			{accessoriesByType?.['torso'] && (
				<AccessorySlot accessory={accessoriesByType['torso']} species="capy" body />
			)}

			<LeftLeg fill={colorTheme.legs} footProps={{ fill: colorTheme.appendages }} />
			{!incognito && <LeftLegPattern skin={skin} fill={colorTheme.patterns} />}

			{accessoriesByType?.['rightFeet'] && (
				<AccessorySlot accessory={accessoriesByType['rightFeet']} species="capy" />
			)}
			{accessoriesByType?.['leftFeet'] && (
				<AccessorySlot accessory={accessoriesByType['leftFeet']} species="capy" />
			)}
			{!accessoriesByType?.['rightFeet'] &&
				!accessoriesByType?.['leftFeet'] &&
				accessoriesByType?.['feet'] && (
					<AccessorySlot accessory={accessoriesByType['feet']} species="capy" />
				)}
			{accessoriesByType?.['legs'] && (
				<AccessorySlot accessory={accessoriesByType['legs']} species="capy" />
			)}
			{accessoriesByType?.['body'] && (
				<AccessorySlot accessory={accessoriesByType['body']} species="capy" body />
			)}
			{accessoriesByType?.['object'] && !renderMicrophoneArmInForeground && (
				<AccessorySlot accessory={accessoriesByType['object']} species="capy" />
			)}

			{!renderMicrophoneArmInForeground && !thumbsUp && (
				<>
					<LeftArm fill={colorTheme.arms} handProps={{ fill: colorTheme.appendages }} />
					{!incognito && <LeftArmPattern skin={skin} fill={colorTheme.patterns} />}
				</>
			)}

			{accessoriesByType?.['torso'] && (
				<AccessorySlot accessory={accessoriesByType['torso']} species="capy" lor="right" />
			)}

			{accessoriesByType?.['body'] && (
				<AccessorySlot accessory={accessoriesByType['body']} species="capy" lor="right" />
			)}

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
				<AccessorySlot accessory={accessoriesByType['head']} species="capy" />
			)}

			{!incognito && <Expression expression={expression} />}
			{accessoriesByType?.['head'] && !runnerHeadband && (
				<AccessorySlot accessory={accessoriesByType['head']} species="capy" />
			)}
			{accessoriesByType?.['eyes'] && (
				<AccessorySlot accessory={accessoriesByType['eyes']} species="capy" />
			)}

			{thumbsUp && <ThumbsUpArm armColor={colorTheme.arms} handColor={colorTheme.appendages} />}

			{renderMicrophoneArmInForeground && (
				<>
					{accessoriesByType?.['object'] && (
						<AccessorySlot accessory={accessoriesByType['object']} species="capy" />
					)}
					<AnimatedAccessory fallbackPart="leftArm">
						<g>
							<LeftArm fill={colorTheme.arms} handProps={{ fill: colorTheme.appendages }} />
							{!incognito && <LeftArmPattern skin={skin} fill={colorTheme.patterns} />}
						</g>
					</AnimatedAccessory>
				</>
			)}
		</>
	);
}
