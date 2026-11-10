import { AnimatedAccessory } from '../../animation/AnimatedAccessory.js';
import { getThemeFromSkin } from '../../helpers/bullshark-theme.js';
import type { BullsharkImageProps } from '../../types/bullshark.type.js';
import { AccessorySlot } from '../accessories/AccessorySlot.js';
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

export function BullsharkImage({
	attributes,
	accessoriesByType,
	detail = 'full',
	incognito = false,
	renderMicrophoneArmInForeground = false,
}: BullsharkImageProps) {
	const { mainColor, secondaryColor, skin, expression } = attributes;
	const colorTheme = getThemeFromSkin(skin, `#${mainColor}`, `#${secondaryColor}`);
	const headAccessory = accessoriesByType?.['head'];
	const showFin = !headAccessory || headAccessory.renderOptions.showFin;

	if (detail === 'head') {
		return (
			<>
				{showFin && (
					<>
						<Fin fill={colorTheme.fin} />
						{!incognito && <FinPattern skin={skin} fill={colorTheme.patterns} />}
					</>
				)}
				<Head fill={colorTheme.head} />
				{!incognito && <HeadPattern skin={skin} fill={colorTheme.patterns} />}
				{!incognito && <Expression expression={expression} />}
				{headAccessory && <AccessorySlot accessory={headAccessory} species="bullshark" />}
				{accessoriesByType?.['eyes'] && (
					<AccessorySlot accessory={accessoriesByType['eyes']} species="bullshark" />
				)}
			</>
		);
	}

	return (
		<>
			{accessoriesByType?.['back']?.category === 'wings' && (
				<AccessorySlot accessory={accessoriesByType['back']} species="bullshark" lor="left" />
			)}
			<RightArm fill={colorTheme.hands} />
			{!incognito && <RightArmPattern skin={skin} fill={colorTheme.patterns} />}
			{accessoriesByType?.['torso'] && (
				<AccessorySlot accessory={accessoriesByType['torso']} species="bullshark" lor="left" />
			)}
			{accessoriesByType?.['body'] && (
				<AccessorySlot accessory={accessoriesByType['body']} species="bullshark" lor="left" />
			)}
			<Tail fill={colorTheme.tail} />
			{!incognito && <TailPattern skin={skin} fill={colorTheme.patterns} />}
			<RightLeg fill={colorTheme.legs} />
			{!incognito && <RightLegPattern skin={skin} fill={colorTheme.patterns} />}
			{showFin && (
				<>
					<Fin fill={colorTheme.fin} />
					{!incognito && <FinPattern skin={skin} fill={colorTheme.patterns} />}
				</>
			)}
			{accessoriesByType?.['back']?.category === 'wings' && (
				<AccessorySlot accessory={accessoriesByType['back']} species="bullshark" lor="right" />
			)}
			<Body fill={colorTheme.body} />
			{!incognito && <BodyPattern skin={skin} fill={colorTheme.patterns} />}
			{accessoriesByType?.['legs'] && (
				<AccessorySlot accessory={accessoriesByType['legs']} species="bullshark" body />
			)}
			{accessoriesByType?.['torso'] && (
				<AccessorySlot accessory={accessoriesByType['torso']} species="bullshark" body />
			)}
			<LeftLeg fill={colorTheme.legs} />
			{!incognito && <LeftLegPattern skin={skin} fill={colorTheme.patterns} />}
			{accessoriesByType?.['back'] && accessoriesByType?.['back']?.category !== 'wings' && (
				<AccessorySlot accessory={accessoriesByType['back']} species="bullshark" />
			)}
			{accessoriesByType?.['rightFeet'] && (
				<AccessorySlot accessory={accessoriesByType['rightFeet']} species="bullshark" />
			)}
			{accessoriesByType?.['leftFeet'] && (
				<AccessorySlot accessory={accessoriesByType['leftFeet']} species="bullshark" />
			)}
			{!accessoriesByType?.['rightFeet'] &&
				!accessoriesByType?.['leftFeet'] &&
				accessoriesByType?.['feet'] && (
					<AccessorySlot accessory={accessoriesByType['feet']} species="bullshark" />
				)}
			{accessoriesByType?.['legs'] && (
				<AccessorySlot accessory={accessoriesByType['legs']} species="bullshark" />
			)}
			{accessoriesByType?.['body'] && (
				<AccessorySlot accessory={accessoriesByType['body']} species="bullshark" body />
			)}
			{accessoriesByType?.['object'] && !renderMicrophoneArmInForeground && (
				<AccessorySlot accessory={accessoriesByType['object']} species="bullshark" />
			)}
			{!renderMicrophoneArmInForeground && (
				<>
					<LeftArm fill={colorTheme.hands} />
					{!incognito && <LeftArmPattern skin={skin} fill={colorTheme.patterns} />}
				</>
			)}
			{accessoriesByType?.['torso'] && (
				<AccessorySlot accessory={accessoriesByType['torso']} species="bullshark" lor="right" />
			)}
			{accessoriesByType?.['body'] && (
				<AccessorySlot accessory={accessoriesByType['body']} species="bullshark" lor="right" />
			)}
			<Head fill={colorTheme.head} />
			{!incognito && <HeadPattern skin={skin} fill={colorTheme.patterns} />}
			{!incognito && <Expression expression={expression} />}
			{headAccessory && <AccessorySlot accessory={headAccessory} species="bullshark" />}
			{accessoriesByType?.['eyes'] && (
				<AccessorySlot accessory={accessoriesByType['eyes']} species="bullshark" />
			)}
			{renderMicrophoneArmInForeground && (
				<>
					{accessoriesByType?.['object'] && (
						<AccessorySlot accessory={accessoriesByType['object']} species="bullshark" />
					)}
					<AnimatedAccessory fallbackPart="leftArm">
						<g>
							<LeftArm fill={colorTheme.hands} />
							{!incognito && <LeftArmPattern skin={skin} fill={colorTheme.patterns} />}
						</g>
					</AnimatedAccessory>
				</>
			)}
		</>
	);
}
