// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { beforeEach, expect, test, vi } from 'vitest';
import { ACCESSORIES } from '@suigar/suifrens-display-system/accessories';
import { getSuiFrenAccessories } from '../../../../src/api/client/sui-client.js';
import { ACCESSORIES_KEY_TYPE, ACCESSORY_TYPE } from '../../../../src/api/lib/config.js';
import { Accessory } from '../../../../src/api/lib/suifren-bcs.js';
import { client } from '../../../helpers/sui-client.js';

vi.mock('@mysten/sui/grpc', async () => (await import('../../../helpers/sui-client.js')).grpcMock);
beforeEach(() => {
	vi.resetAllMocks();
});

test('gRPC accessory lookup follows pagination and dynamic-object names', async () => {
	const name = { type: ACCESSORIES_KEY_TYPE, bcs: new Uint8Array([1]) };
	client.listDynamicFields
		.mockResolvedValueOnce({
			dynamicFields: [{ name: { ...name, type: 'unrelated' } }],
			cursor: 'next',
			hasNextPage: true,
		})
		.mockResolvedValueOnce({
			dynamicFields: [{ $kind: 'DynamicObject', name }],
			cursor: null,
			hasNextPage: false,
		});
	client.getDynamicObjectField.mockResolvedValue({
		object: {
			type: ACCESSORY_TYPE,
			content: Accessory.serialize({ id: '0x2', name: 'baseball cap', type: 'hat' }).toBytes(),
		},
	});
	expect(await getSuiFrenAccessories('0x1')).toEqual(
		ACCESSORIES.filter((item) => item.name === 'baseball cap'),
	);
	expect(client.listDynamicFields).toHaveBeenCalledTimes(2);
	expect(client.listDynamicFields).toHaveBeenNthCalledWith(2, { parentId: '0x1', cursor: 'next' });
	expect(client.getDynamicObjectField).toHaveBeenCalledExactlyOnceWith({
		parentId: '0x1',
		name,
		include: { content: true },
	});
});

test('waits for each accessory lookup before starting the next one or advancing the cursor', async () => {
	const first = Promise.withResolvers<Awaited<ReturnType<typeof client.getDynamicObjectField>>>();
	client.listDynamicFields
		.mockResolvedValueOnce({
			dynamicFields: [1, 2].map((value) => ({
				name: { type: ACCESSORIES_KEY_TYPE, bcs: new Uint8Array([value]) },
			})),
			cursor: 'next',
			hasNextPage: true,
		})
		.mockResolvedValueOnce({ dynamicFields: [], cursor: null, hasNextPage: false });
	client.getDynamicObjectField.mockReturnValueOnce(first.promise).mockResolvedValueOnce({
		object: {
			type: ACCESSORY_TYPE,
			content: Accessory.serialize({ id: '0x3', name: '8 bit glasses', type: 'glasses' }).toBytes(),
		},
	});

	const result = getSuiFrenAccessories('0x1');
	await vi.waitFor(() => {
		expect(client.getDynamicObjectField).toHaveBeenCalledTimes(1);
	});
	expect(client.listDynamicFields).toHaveBeenCalledTimes(1);
	first.resolve({
		object: {
			type: ACCESSORY_TYPE,
			content: Accessory.serialize({ id: '0x2', name: 'baseball cap', type: 'hat' }).toBytes(),
		},
	});

	expect((await result).map((accessory) => accessory.name)).toEqual([
		'baseball cap',
		'8 bit glasses',
	]);
	expect(client.listDynamicFields).toHaveBeenNthCalledWith(2, { parentId: '0x1', cursor: 'next' });
});
