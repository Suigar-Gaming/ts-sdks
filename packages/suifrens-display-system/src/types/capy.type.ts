// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { SVGProps } from 'react';
import type { AccessoryMetadata } from './accessory.type.js';
import type { SuiFrenAppearance } from './appearance.type.js';

export type CapyImageProps = {
	attributes: CapyAttributes;
	gesture?: 'thumbs_up';
	accessoriesByType?: Record<string, AccessoryMetadata>;
	detail?: 'full' | 'head';
	incognito?: boolean;
	renderMicrophoneArmInForeground?: boolean;
};

export type CapyEarShape = 'default' | 'quiet' | 'wild' | 'mischievous';

export type CapyAttributes = SuiFrenAppearance & {
	earShape: CapyEarShape;
};

export type CapyEarProps =
	| ({ earShape: 'default' | 'mischievous' } & SVGProps<SVGPathElement>)
	| ({ earShape: 'quiet' } & SVGProps<SVGGElement>)
	| {
			earShape: 'wild';
			outerEarProps?: SVGProps<SVGPathElement>;
			innerEarProps?: SVGProps<SVGPathElement>;
	  };

export type CapyTheme = {
	head: string;
	body: string;
	legs: string;
	arms: string;
	outerEars: string;
	innerEars: string;
	patterns: string;
	nose: string;
	appendages: string;
};
