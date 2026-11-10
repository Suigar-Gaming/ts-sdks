// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { CSSProperties, ReactNode } from 'react';
import type { AccessoryMetadata } from './accessory.type.js';
import type { AnimationConfig } from './animation.type.js';
import type { BullsharkAttributes } from './bullshark.type.js';
import type { CapyAttributes, CapyImageProps } from './capy.type.js';

export type SuiFrenRenderSize =
	| number
	| {
			width: number;
			height: number;
	  };

export type SuiFrenImageProps = {
	attributes: SuiFrenAttributes;
	/** Optional native capy gesture; bullsharks and head portraits are unchanged. */
	capyGesture?: CapyImageProps['gesture'];
	accessories?: Array<AccessoryMetadata>;
	detail?: 'full' | 'head';
	renderSize?: SuiFrenRenderSize;
	incognito?: boolean;
	shadow?: boolean;
	logo?: ReactNode;
	className?: string;
	style?: CSSProperties;
	animation?: AnimationConfig | null;
};

export type SuiFrenAttributes = CapyAttributes | BullsharkAttributes;
