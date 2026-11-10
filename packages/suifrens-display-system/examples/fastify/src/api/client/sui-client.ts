// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import type { SuiClientTypes } from '@mysten/sui/client';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { accessories } from '@suigar/suifrens-display-system/accessories';
import type { AccessoryMetadata, SuiFrenSpecies } from '@suigar/suifrens-display-system/types';
import { parseSuiFrenAttributes } from '../../utils/attribute-utils.js';
import {
	ACCESSORIES_KEY_TYPE,
	ACCESSORY_TYPE,
	BULLSHARK_TYPE,
	CAPY_TYPE,
	NETWORK,
	SUIFREN_TYPE,
} from '../lib/config.js';
import { Accessory, SuiFren } from '../lib/suifren-bcs.js';

export const suiClient = new SuiGrpcClient({
	network: NETWORK,
	baseUrl: `https://fullnode.${NETWORK}.sui.io:443`,
});

export async function getSuiFrenAttributesAndAccessories(suiFrenId: string) {
	const { object } = await suiClient.getObject({
		objectId: suiFrenId,
		include: { content: true },
	});
	const species = getSuiFrenSpeciesFromObjectType(object.type);
	if (!species) {
		throw new Error(`Failed to parse object data returned for SuiFren ${suiFrenId}`);
	}
	const { attributes } = SuiFren.parse(object.content);
	return {
		attributes: parseSuiFrenAttributes(species, attributes),
		equippedAccessories: await getSuiFrenAccessories(suiFrenId),
	};
}

export async function getSuiFrenAccessories(suiFrenId: string) {
	const equipped: Array<AccessoryMetadata> = [];
	let cursor: string | null = null;
	do {
		const page: SuiClientTypes.ListDynamicFieldsResponse = await suiClient.listDynamicFields({
			parentId: suiFrenId,
			cursor,
		});
		for (const field of page.dynamicFields) {
			if (field.name.type !== ACCESSORIES_KEY_TYPE) {
				continue;
			}
			const { object } = await suiClient.getDynamicObjectField({
				parentId: suiFrenId,
				name: field.name,
				include: { content: true },
			});
			if (object.type !== ACCESSORY_TYPE) {
				continue;
			}
			const { name } = Accessory.parse(object.content);
			const accessory = accessories.find((item) => item.name === name);
			if (accessory) {
				equipped.push(accessory);
			}
		}
		cursor = page.hasNextPage ? page.cursor : null;
	} while (cursor);
	return equipped;
}

export function getSuiFrenSpeciesFromObjectType(
	suiFrenObjectType: string,
): SuiFrenSpecies | undefined {
	if (suiFrenObjectType === `${SUIFREN_TYPE}<${CAPY_TYPE}>`) {
		return 'capy';
	} else if (suiFrenObjectType === `${SUIFREN_TYPE}<${BULLSHARK_TYPE}>`) {
		return 'bullshark';
	}
	return undefined;
}
