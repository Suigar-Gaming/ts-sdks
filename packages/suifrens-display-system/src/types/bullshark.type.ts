import type { colors } from '../colors/index.js';
import type { AccessoryMetadata } from './accessory.type.js';

export type BullsharkImageProps = {
	attributes: BullsharkAttributes;
	accessoriesByType?: Record<string, AccessoryMetadata>;
	detail?: 'full' | 'head';
	incognito?: boolean;
	renderMicrophoneArmInForeground?: boolean;
};

export type BullsharkSkin =
	| 'basic'
	| 'cheetah'
	| 'fox'
	| 'panda'
	| 'stripes'
	| 'snake'
	| 'lizard'
	| 'dalmation';

export type BullsharkExpression =
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

export type BullsharkFinStyle = 'classic';

export type BullsharkAttributes = {
	mainColor: keyof typeof colors;
	secondaryColor: keyof typeof colors;
	skin: BullsharkSkin;
	expression: BullsharkExpression;
	finStyle: BullsharkFinStyle;
};
