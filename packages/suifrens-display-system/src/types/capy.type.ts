import type { SVGProps } from 'react';
import type { colors } from '../constants/colors.js';
import type { AccessoryMetadata } from './accessory.type.js';

export type CapyImageProps = {
	attributes: CapyAttributes;
	gesture?: 'thumbsUp';
	accessoriesByType?: Record<string, AccessoryMetadata>;
	detail?: 'full' | 'head';
	incognito?: boolean;
	renderMicrophoneArmInForeground?: boolean;
};

export type CapySkin =
	| 'basic'
	| 'cheetah'
	| 'fox'
	| 'panda'
	| 'stripes'
	| 'snake'
	| 'lizard'
	| 'dalmation';

export type CapyEarShape = 'default' | 'quiet' | 'wild' | 'mischievous';

export type CapyExpression =
	| 'angry'
	| 'annoyed'
	| 'bigSmile'
	| 'blush'
	| 'cool'
	| 'crying'
	| 'happy'
	| 'heartEyes'
	| 'kiss'
	| 'laughing'
	| 'mischievous'
	| 'relaxed'
	| 'sad'
	| 'shocked'
	| 'sleepy'
	| 'tongueOut'
	| 'wink'
	| 'dizzyFace'
	| 'goofy'
	| 'grimace';

export type CapyAttributes = {
	mainColor: keyof typeof colors;
	secondaryColor: keyof typeof colors;
	earShape: CapyEarShape;
	skin: CapySkin;
	expression: CapyExpression;
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
