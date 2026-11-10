// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type {
	AccessoryMetadata,
	AccessoryPlacement,
	SuiFrenSpecies,
} from '../types/accessory.type.js';
import type { VipCrownAccessoryName } from '../types/vip-crown.type.js';

type VipCrownPlacementMap = Record<
	VipCrownAccessoryName,
	Partial<Record<SuiFrenSpecies, AccessoryPlacement>>
>;

export const VIP_CROWN_ACCESSORY_NAMES = [
	'bronze-1',
	'bronze-2',
	'bronze-3',
	'silver-1',
	'silver-2',
	'silver-3',
	'gold-1',
	'gold-2',
	'gold-3',
	'platinum-1',
	'platinum-2',
	'platinum-3',
	'diamond-1',
	'diamond-2',
	'diamond-3',
	'master-1',
	'master-2',
	'legend',
] as const;

const DEFAULT_CAPY_PLACEMENT: AccessoryPlacement = {
	x: 0,
	y: 0,
	scale: 1,
	rotation: 0,
	originX: 1500,
	originY: 1500,
};

const DEFAULT_BULLSHARK_PLACEMENT: AccessoryPlacement = {
	x: 0,
	y: 0,
	scale: 1,
	rotation: 0,
	originX: 1500,
	originY: 1500,
};

// Tweak crown placement here. The SVGs are already exported in the full
// 3000x3000 SuiFren canvas, so these values are small nudge controls.
const VIP_CROWN_PLACEMENT_BY_NAME: VipCrownPlacementMap = VIP_CROWN_ACCESSORY_NAMES.reduce(
	(accumulator, name) => {
		accumulator[name] = {
			capy: { ...DEFAULT_CAPY_PLACEMENT },
			bullshark: { ...DEFAULT_BULLSHARK_PLACEMENT },
		};
		return accumulator;
	},
	{} as VipCrownPlacementMap,
);

function createVipCrownAccessory(name: VipCrownAccessoryName): AccessoryMetadata {
	return {
		type: 'head',
		category: 'crowns',
		renderOptions: {
			showEars: true,
			showFin: true,
			placement: VIP_CROWN_PLACEMENT_BY_NAME[name],
			animationPart: 'head',
		},
		name,
		price: 0,
		quantity: null,
		description: `VIP ${name} crown`,
		collection: 'vip',
	};
}

export const vipCrownAccessories = VIP_CROWN_ACCESSORY_NAMES.map((name) =>
	createVipCrownAccessory(name),
);
