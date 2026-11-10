import type { JSX } from 'react';
import type { AnimationPart } from './animation.type.js';
import type { RunnerKitOptions } from './runner-kit.type.js';
import type { SoccerTeamKit } from './soccer-kit.type.js';

export type AccessoryAssetVariant = 'default' | 'body' | 'left' | 'right' | 'leftLeg' | 'rightLeg';

export type SuiFrenSpecies = 'capy' | 'bullshark';

export type AccessoryPlacement = {
	x?: number;
	y?: number;
	scale?: number;
	rotation?: number;
	originX?: number;
	originY?: number;
};

export type AccessoryRenderOptions = Record<string, unknown> & {
	runnerKit?: RunnerKitOptions;
	showEars?: boolean;
	showFin?: boolean;
	country?: string;
	teamKit?: SoccerTeamKit;
	side?: 'home' | 'away';
	assetSrc?: string;
	placement?: Partial<Record<SuiFrenSpecies, AccessoryPlacement>>;
	animationPart?: AnimationPart;
	/** Draw a left-hand object and its gripping arm above the head/body. */
	foreground?: boolean;
};

export type AccessoryMetadata = {
	type: string;
	category: string;
	renderOptions: AccessoryRenderOptions;
	name: string;
	price: number;
	quantity: number | null;
	description: string;
	collection: string;
};

export type BodyAccessoryProps = {
	lor?: 'left' | 'right';
	body?: boolean;
};

export type AccessoryRendererProps = BodyAccessoryProps & {
	accessory: AccessoryMetadata;
	species: SuiFrenSpecies;
};

export type AccessoryRenderer = (props: AccessoryRendererProps) => JSX.Element | null;

export type SvgAccessoryProps = {
	assetSrc: string;
	symbolId?: string;
	species: SuiFrenSpecies;
	placement?: Partial<Record<SuiFrenSpecies, AccessoryPlacement>>;
	viewport?: { x: number; y: number; width: number; height: number };
};
