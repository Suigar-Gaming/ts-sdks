// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { beforeEach, expect, test, vi } from 'vitest';
import { accessories } from '@suigar/suifrens-display-system/accessories';
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
			content: Accessory.serialize({ id: '0x2', name: accessories[0].name, type: 'hat' }).toBytes(),
		},
	});
	expect(await getSuiFrenAccessories('0x1')).toEqual([accessories[0]]);
	expect(client.listDynamicFields).toHaveBeenCalledTimes(2);
	expect(client.listDynamicFields).toHaveBeenNthCalledWith(2, { parentId: '0x1', cursor: 'next' });
	expect(client.getDynamicObjectField).toHaveBeenCalledExactlyOnceWith({
		parentId: '0x1',
		name,
		include: { content: true },
	});
});
