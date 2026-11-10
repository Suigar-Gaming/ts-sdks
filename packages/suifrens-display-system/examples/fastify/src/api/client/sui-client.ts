import type { SuiClientTypes } from '@mysten/sui/client';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { accessories } from '@suigar/suifrens-display-system/accessories';
import type { AccessoryMetadata, SuiFrenType } from '@suigar/suifrens-display-system/types';
import { parseSuiFrenAttributes } from '../../utils/attribute-utils.js';
import { extractBaseFrenType } from '../../utils/object-type-utils.js';
import { ACCESSORIES_KEY_TYPE, BULLSHARK_TYPE, CAPY_TYPE, NETWORK } from '../lib/config.js';

export const suiClient = new SuiGrpcClient({
	network: NETWORK,
	baseUrl: `https://fullnode.${NETWORK}.sui.io:443`,
});

export async function getSuiFrenAttributesAndAccessories(suiFrenId: string) {
	const { object } = await suiClient.getObject({
		objectId: suiFrenId,
		include: { json: true },
	});
	const suiFrenType = getSuiFrenTypeFromObjectType(object.type);
	const attributes = object.json?.attributes;
	if (
		!suiFrenType ||
		!Array.isArray(attributes) ||
		!attributes.every((v) => typeof v === 'string')
	) {
		throw new Error(`Failed to parse object data returned for SuiFren ${suiFrenId}`);
	}
	return {
		equippedAccessories: await getSuiFrenAccessories(suiFrenId),
		attributes: parseSuiFrenAttributes(suiFrenType, attributes),
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
				include: { json: true },
			});
			const accessory = accessories.find((item) => item.name === object.json?.name);
			if (accessory) {
				equipped.push(accessory);
			}
		}
		cursor = page.hasNextPage ? page.cursor : null;
	} while (cursor);
	return equipped;
}

export function getSuiFrenTypeFromObjectType(suiFrenObjectType: string): SuiFrenType | undefined {
	const frenObjectType = extractBaseFrenType(suiFrenObjectType);
	if (frenObjectType === CAPY_TYPE) {
		return 'capy';
	} else if (frenObjectType === BULLSHARK_TYPE) {
		return 'bullshark';
	}
	return undefined;
}
