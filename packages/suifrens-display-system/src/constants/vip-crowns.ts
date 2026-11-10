import type {
	AccessoryMetadata,
	AccessoryPlacement,
	SuiFrenSpecies,
} from '../utils/accessoryUtils.js';

export const VIP_CROWN_ACCESSORY_NAMES = [
	'bronze-i',
	'bronze-ii',
	'bronze-iii',
	'silver-i',
	'silver-ii',
	'silver-iii',
	'gold-i',
	'gold-ii',
	'gold-iii',
	'platinium-i',
	'platinium-ii',
	'platinium-iii',
	'diamond-i',
	'diamond-ii',
	'diamond-iii',
	'master-i',
	'master-ii',
	'legend',
] as const;

export type VipCrownAccessoryName = (typeof VIP_CROWN_ACCESSORY_NAMES)[number];

type VipCrownPlacementMap = Record<
	VipCrownAccessoryName,
	Partial<Record<SuiFrenSpecies, AccessoryPlacement>>
>;

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
