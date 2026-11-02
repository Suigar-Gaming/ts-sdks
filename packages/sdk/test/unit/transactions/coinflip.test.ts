// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { fromHex, normalizeStructTag, normalizeSuiAddress } from '@mysten/sui/utils';
import { describe, expect, it, vi } from 'vitest';
import { buildCoinflipTransaction } from '../../../src/transactions/coinflip.js';
import { createContractCallMock, encodeUtf8, getFirstMockArg, TEST_CONFIG } from '../../utils.js';
import { getMoveCall, loadTransactionModuleWithMock } from './utils.js';

describe('coinflip transaction builder', () => {
	it('omits an absent package override when calling the generated helper', async () => {
		vi.resetModules();
		const playV2 = createContractCallMock();
		const { buildCoinflipTransaction: buildWithMock } = await loadTransactionModuleWithMock<{
			buildCoinflipTransaction: typeof buildCoinflipTransaction;
		}>(
			'../../../src/contracts/coinflip/coinflip.js',
			{ playV2 },
			'../../../src/transactions/coinflip.js',
		);

		buildWithMock({
			owner: '0x123',
			coinType: '0x2::sui::SUI',
			stake: 1_000,
			side: 'heads',
			config: { ...TEST_CONFIG, packageIds: { nftV1: TEST_CONFIG.packageIds.nftV1 } },
		});

		expect(getFirstMockArg(playV2)).not.toHaveProperty('package');
	});

	it('builds a coinflip transaction with a configured package override', () => {
		const tx = buildCoinflipTransaction({
			owner: '0x123',
			coinType: '0x2::sui::SUI',
			stake: 1_000,
			side: 'heads',
			config: TEST_CONFIG,
		});
		const data = tx.getData();

		expect(data.sender).toBe(normalizeSuiAddress('0x123'));
		expect(data.commands[0]?.$kind).toBe('$Intent');
		expect(data.commands[1]?.$kind).toBe('MoveCall');
		expect(getMoveCall(data, 1).package).toBe(normalizeSuiAddress(TEST_CONFIG.packageIds.coinflip));
	});

	it('passes normalized arguments to the generated coinflip contract helper', async () => {
		const playV2 = createContractCallMock();

		const { buildCoinflipTransaction: buildCoinflipTransactionWithMock } =
			await loadTransactionModuleWithMock<{
				buildCoinflipTransaction: typeof buildCoinflipTransaction;
			}>(
				'../../../src/contracts/coinflip/coinflip.js',
				{ playV2 },
				'../../../src/transactions/coinflip.js',
			);
		const partner = normalizeSuiAddress('0x456');

		buildCoinflipTransactionWithMock({
			owner: '0x123',
			coinType: '0x2::sui::SUI',
			stake: 1000,
			betCount: 2,
			side: 'tails',
			metadata: { label: 'vip' },
			partner,
			config: TEST_CONFIG,
		});

		const options = getFirstMockArg<{
			package?: string;
			typeArguments: Array<string>;
			arguments: Array<unknown>;
		}>(playV2);

		expect(options.package).toBe(TEST_CONFIG.packageIds.coinflip);
		expect(options.typeArguments).toEqual([normalizeStructTag('0x2::sui::SUI')]);
		expect(options.arguments[0]).toBe(TEST_CONFIG.objectIds.sweetHouse);
		expect(options.arguments[1]).toBe(1000n);
		expect(options.arguments[3]).toBe(2n);
		expect(options.arguments[4]).toBe(true);
		expect(options.arguments[5]).toEqual(['partner', 'label']);
		expect(options.arguments[6]).toEqual([Array.from(fromHex(partner)), encodeUtf8('vip')]);
		expect(options.arguments[7]).toBe(TEST_CONFIG.coins.sui.priceInfoObjectId);
	});
});
