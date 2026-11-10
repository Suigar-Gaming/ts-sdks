// Original character types by Mysten Labs. Suigar extended them with gesture and rendering options.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import type { CSSProperties, ReactNode } from 'react';
import type { AccessoryMetadata, SuiFrenAccessory } from './accessory.type.js';
import type { AnimationConfig } from './animation.type.js';
import type { BullsharkAttributes } from './bullshark.type.js';
import type { CapyAttributes } from './capy.type.js';
import type { SuiFrenGestureProps } from './gesture.type.js';

export type SuiFrenRenderSize =
	| number
	| {
			width: number;
			height: number;
	  };

export type SuiFrenImageProps = SuiFrenGestureProps & {
	attributes: SuiFrenAttributes;
	accessories?: ReadonlyArray<SuiFrenAccessory | AccessoryMetadata>;
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
