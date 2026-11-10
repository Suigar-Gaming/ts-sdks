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

export type DefaultLeftEarProps = {
	earShape: 'default';
} & SVGProps<SVGPathElement>;

export type MischievousLeftEarProps = {
	earShape: 'mischievous';
} & SVGProps<SVGPathElement>;

export type QuietLeftEarProps = {
	earShape: 'quiet';
} & SVGProps<SVGGElement>;

export type WildLeftEarProps = {
	earShape: 'wild';
	outerEarProps?: SVGProps<SVGPathElement>;
	innerEarProps?: SVGProps<SVGPathElement>;
};

export type DefaultRightEarProps = {
	earShape: 'default';
} & SVGProps<SVGPathElement>;

export type MischievousRightEarProps = {
	earShape: 'mischievous';
} & SVGProps<SVGPathElement>;

export type QuietRightEarProps = {
	earShape: 'quiet';
} & SVGProps<SVGGElement>;

export type WildRightEarProps = {
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
