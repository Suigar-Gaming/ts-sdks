import type { AnimationPart } from '../animation/parts.js';
import type { RunnerKitOptions } from '../components/accessories/runnerKit.js';
import type { SoccerTeamKit } from '../components/accessories/soccerTeamKit.js';

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

function getAccessorySlotKey(accessory: AccessoryMetadata) {
	if (accessory.type === 'feet') {
		if (accessory.renderOptions.animationPart === 'leftLeg') {
			return 'leftFeet';
		}
		if (accessory.renderOptions.animationPart === 'rightLeg') {
			return 'rightFeet';
		}
	}

	return accessory.type;
}

export function getAccessoriesByType(accessories: Array<AccessoryMetadata>) {
	return accessories.reduce<Record<string, AccessoryMetadata>>((accumulator, accessory) => {
		accumulator[getAccessorySlotKey(accessory)] = accessory;
		return accumulator;
	}, {});
}
