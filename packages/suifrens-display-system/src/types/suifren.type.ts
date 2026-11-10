import type { CSSProperties, ReactNode } from 'react';
import type { AccessoryMetadata } from './accessory.type.js';
import type {
	AnimationConfig,
	AnimationDirection,
	AnimationSequence,
	PlaybackOptions,
	PlayState,
} from './animation.type.js';
import type { BullsharkAttributes } from './bullshark.type.js';
import type { CapyAttributes } from './capy.type.js';

export type SuiFrenRenderSize =
	| number
	| {
			width: number;
			height: number;
	  };

export type SuiFrenImageProps = {
	attributes: SuiFrenAttributes;
	/** Optional native capy gesture; bullsharks and head portraits are unchanged. */
	capyGesture?: 'thumbsUp';
	accessories?: Array<AccessoryMetadata>;
	detail?: 'full' | 'head';
	renderSize?: SuiFrenRenderSize;
	incognito?: boolean;
	shadow?: boolean;
	logo?: ReactNode;
	className?: string;
	style?: CSSProperties;
	animation?: AnimationConfig | null;
	animationPreset?: string;
	animationSequence?: AnimationSequence;
	animationPlayback?: PlaybackOptions;
	animationPlayState?: PlayState;
	animationDirection?: AnimationDirection;
	animationTrigger?: string | number;
	animationStartAt?: 'start' | 'end';
	animationAutoPlay?: boolean;
	animationHoldOnComplete?: boolean;
};

export type SuiFrenImageAssetsProps = SuiFrenImageProps;

export enum SuiFrenType {
	BULLSHARK = 'BULLSHARK',
	CAPY = 'CAPY',
}

export type SuiFrenAttributes = CapyAttributes | BullsharkAttributes;
