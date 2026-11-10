// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { type ReactNode, useMemo } from 'react';
import { AnimationProvider } from '../animation/AnimationContext.js';
import { shouldRenderMicrophoneArmInForeground } from '../helpers/foreground-layering.js';
import type { AccessoryRenderer } from '../types/accessory.type.js';
import type { SuiFrenImageProps } from '../types/suifren.type.js';
import { getAccessoriesByType } from '../utils/accessories.js';
import { assertUnreachable } from '../utils/assert-unreachable.js';
import { AccessoryRendererProvider } from './accessories/AccessorySlot.js';
import { BullsharkImage } from './bullshark/BullsharkImage.js';
import { CapyImage } from './capy/CapyImage.js';

export function SuiFrenImageView({
	accessoryRenderer,
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
	animation = null,
}: SuiFrenImageProps & { accessoryRenderer: AccessoryRenderer }) {
	const accessoriesByType = useMemo(
		() => (accessories ? getAccessoriesByType(accessories) : undefined),
		[accessories],
	);

	const renderMicrophoneArmInForeground = shouldRenderMicrophoneArmInForeground(
		animation,
		accessoriesByType,
	);

	let suiFrenImageContent: ReactNode | undefined;
	if ('finStyle' in attributes) {
		suiFrenImageContent = (
			<BullsharkImage
				{...(accessoriesByType && { accessoriesByType })}
				attributes={attributes}
				detail={detail}
				incognito={incognito}
				renderMicrophoneArmInForeground={renderMicrophoneArmInForeground}
			/>
		);
	} else if ('earShape' in attributes) {
		suiFrenImageContent = (
			<CapyImage
				{...(capyGesture && { gesture: capyGesture })}
				{...(accessoriesByType && { accessoriesByType })}
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
		<AccessoryRendererProvider renderer={accessoryRenderer}>
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
			{animation ? (
				<AnimationProvider
					key={'finStyle' in attributes ? 'bullshark' : 'capy'}
					animation={animation}
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
