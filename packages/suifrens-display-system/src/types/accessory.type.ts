// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import type { JSX } from 'react';
import type { AnimationPart } from './animation.type.js';
import type { RunnerKitOptions } from './runner-kit.type.js';
import type { SoccerTeamCountryCode, SoccerTeamKit, SoccerTeamSide } from './soccer-kit.type.js';

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

export type AccessoryKit =
	| ({ type: 'runner' } & RunnerKitOptions)
	| ({ type: 'soccer'; side?: SoccerTeamSide } & (
			| { country?: SoccerTeamCountryCode; team?: never }
			| { team: SoccerTeamKit; country?: never }
	  ));

export type AccessoryRenderOptions = {
	kit?: AccessoryKit;
	showEars?: boolean;
	showFin?: boolean;
	assetSrc?: string;
	placement?: Partial<Record<SuiFrenSpecies, AccessoryPlacement>>;
	animationPart?: AnimationPart;
	/** Draw a left-hand object and its gripping arm above the head/body. */
	foreground?: boolean;
};

export type SuiFrenAccessory = {
	type: string;
	category: string;
	renderOptions: AccessoryRenderOptions;
	name: string;
};

export type AccessoryMetadata = SuiFrenAccessory & {
	price: number;
	quantity: number | null;
	description: string;
	collection: string;
};

export type AccessorySlots<T extends SuiFrenAccessory = SuiFrenAccessory | AccessoryMetadata> =
	Partial<Record<string, T>>;

export type BodyAccessoryProps = {
	layer?: 'body' | 'left' | 'right';
};

export type AccessoryRendererProps = BodyAccessoryProps & {
	accessory: SuiFrenAccessory;
	species: SuiFrenSpecies;
};

export type AccessoryRenderer = (props: AccessoryRendererProps) => JSX.Element | null;

export type SvgAccessoryProps = {
	assetSrc: string;
	symbolId?: string | undefined;
	species: SuiFrenSpecies;
	placement?: Partial<Record<SuiFrenSpecies, AccessoryPlacement>> | undefined;
	viewport?: { x: number; y: number; width: number; height: number } | undefined;
};
