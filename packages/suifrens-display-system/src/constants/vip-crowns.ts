// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { AccessoryMetadata, AccessoryPlacement } from '../types/accessory.type.js';
import type { VipCrownAccessoryName } from '../types/vip-crown.type.js';

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

const DEFAULT_PLACEMENT: AccessoryPlacement = {
	x: 0,
	y: 0,
	scale: 1,
	rotation: 0,
	originX: 1500,
	originY: 1500,
};

function createVipCrownAccessory(name: VipCrownAccessoryName): AccessoryMetadata {
	return {
		type: 'head',
		category: 'crowns',
		renderOptions: {
			showEars: true,
			showFin: true,
			placement: { capy: { ...DEFAULT_PLACEMENT }, bullshark: { ...DEFAULT_PLACEMENT } },
			animationPart: 'head',
		},
		name,
		price: 0,
		quantity: null,
		description: `VIP ${name} crown`,
		collection: 'vip',
	};
}

export const VIP_CROWN_ACCESSORIES = VIP_CROWN_ACCESSORY_NAMES.map((name) =>
	createVipCrownAccessory(name),
);
