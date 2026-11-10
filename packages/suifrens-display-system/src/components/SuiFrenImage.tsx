import { type ReactNode, useMemo } from 'react';
import { AnimationProvider } from '../animation/AnimationContext.js';
import type { AnimationConfig } from '../types/animation.type.js';
import type { SuiFrenImageProps } from '../types/suifren.type.js';
import { getAccessoriesByType } from '../utils/accessoryUtils.js';
import { assertUnreachable } from '../utils/assertUnreachable.js';
import { AccessoryRendererProvider } from './accessories/AccessorySlot.js';
import { InlineAccessory } from './accessories/index.js';
import { BullsharkImage } from './bullshark-image/BullsharkImage.js';
import { CapyImage } from './capy-image/CapyImage.js';
import { shouldRenderMicrophoneArmInForeground } from './foregroundLayering.js';

export function SuiFrenImage({
	attributes,
	capyGesture,
	accessories,
	detail = 'full',
	renderSize,
	incognito = false,
	shadow = false,
	logo,
	className,
	style,
	animation: animationProp,
	animationPreset,
	animationSequence,
	animationPlayback,
	animationPlayState,
	animationDirection,
	animationTrigger,
	animationStartAt,
	animationAutoPlay,
	animationHoldOnComplete,
}: SuiFrenImageProps) {
	const accessoriesByType = useMemo(
		() => (accessories ? getAccessoriesByType(accessories) : undefined),
		[accessories],
	);

	const resolvedAnimation = useMemo<AnimationConfig | null>(() => {
		if (animationProp !== undefined) {
			return animationProp ?? null;
		}

		const sourceSequence = animationSequence;
		const sourcePreset = animationPreset;

		if (!sourceSequence && !sourcePreset) {
			return null;
		}

		const base: AnimationConfig = sourceSequence
			? { sequence: sourceSequence }
			: { preset: sourcePreset! };

		if (animationPlayback) {
			base.playback = animationPlayback;
		}
		if (animationPlayState) {
			base.playState = animationPlayState;
		}
		if (animationDirection) {
			base.direction = animationDirection;
		}
		if (animationTrigger !== undefined) {
			base.trigger = animationTrigger;
		}
		if (animationStartAt) {
			base.startAt = animationStartAt;
		}
		if (animationAutoPlay !== undefined) {
			base.autoPlay = animationAutoPlay;
		}
		if (animationHoldOnComplete !== undefined) {
			base.holdOnComplete = animationHoldOnComplete;
		}

		return base;
	}, [
		animationProp,
		animationSequence,
		animationPreset,
		animationPlayback,
		animationPlayState,
		animationDirection,
		animationTrigger,
		animationStartAt,
		animationAutoPlay,
		animationHoldOnComplete,
	]);

	const renderMicrophoneArmInForeground = shouldRenderMicrophoneArmInForeground(
		resolvedAnimation,
		accessoriesByType,
	);

	let suiFrenImageContent: ReactNode | undefined;
	if ('finStyle' in attributes) {
		suiFrenImageContent = (
			<BullsharkImage
				accessoriesByType={accessoriesByType}
				attributes={attributes}
				detail={detail}
				incognito={incognito}
				renderMicrophoneArmInForeground={renderMicrophoneArmInForeground}
			/>
		);
	} else if ('earShape' in attributes) {
		suiFrenImageContent = (
			<CapyImage
				gesture={capyGesture}
				accessoriesByType={accessoriesByType}
				attributes={attributes}
				detail={detail}
				incognito={incognito}
				renderMicrophoneArmInForeground={renderMicrophoneArmInForeground}
			/>
		);
	} else {
		assertUnreachable(attributes);
	}

	const resolvedSize =
		typeof renderSize === 'number' ? { width: renderSize, height: renderSize } : renderSize;
	const renderedContent = (
		<AccessoryRendererProvider renderer={InlineAccessory}>
			{suiFrenImageContent}
		</AccessoryRendererProvider>
	);

	return (
		<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			width={resolvedSize?.width}
			height={resolvedSize?.height}
			viewBox="0 -200 3000 3000"
			overflow={accessoriesByType?.['head']?.category === 'crowns' ? 'visible' : undefined}
			className={['suifren-image', className].filter(Boolean).join(' ')}
			style={style}
		>
			{shadow ? <ellipse opacity={0.3} cx="1400.4" cy="2615.2" rx="472.8" ry="130.6" /> : null}
			{resolvedAnimation ? (
				<AnimationProvider
					key={'finStyle' in attributes ? 'bullshark' : 'capy'}
					animation={resolvedAnimation}
				>
					{renderedContent}
				</AnimationProvider>
			) : (
				renderedContent
			)}
			{logo}
		</svg>
	);
}
