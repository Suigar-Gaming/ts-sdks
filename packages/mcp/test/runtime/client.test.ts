// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { describe, expect, it, vi } from 'vitest';
import {
	createSuigarClient,
	executeSessionTransaction,
	getProviderUrl,
	normalizeNetwork,
	resolveDefaultCoinType,
	resolveOwnerAddress,
	type SuigarClientBundle,
} from '../../src/runtime/client.js';

const testAddress = (fill: string) => `0x${fill.repeat(64)}`;
const owner = testAddress('a');
const resolvedOwner = testAddress('b');
const customCoinType = `${testAddress('c')}::coin::COIN`;

type ResolveNameServiceAddress = SuigarClientBundle['client']['core']['resolveNameServiceAddress'];

function createResolverBundle(resolveNameServiceAddress: ResolveNameServiceAddress) {
	const bundle = createSuigarClient({ network: 'testnet' });
	vi.spyOn(bundle.client.core, 'resolveNameServiceAddress').mockImplementation(
		resolveNameServiceAddress,
	);
	return bundle;
}

describe('network resolution', () => {
	it('defaults to testnet and accepts supported networks', () => {
		expect(normalizeNetwork()).toBe('testnet');
		expect(normalizeNetwork('mainnet')).toBe('mainnet');
		expect(normalizeNetwork('testnet')).toBe('testnet');
	});

	it('rejects unsupported networks with an actionable error', () => {
		expect(() => normalizeNetwork('devnet')).toThrow(/mainnet.*testnet/u);
	});

	it('uses default provider URLs unless one is provided', () => {
		expect(getProviderUrl({ network: 'testnet' })).toBe('https://fullnode.testnet.sui.io:443');
		expect(getProviderUrl({ network: 'mainnet', providerUrl: 'https://example.com' })).toBe(
			'https://example.com',
		);
	});
});

describe('coin type resolution', () => {
	it('normalizes explicit and configured default coin types', () => {
		const { config } = createSuigarClient({
			network: 'testnet',
			config: { coins: { sui: { coinType: '0x2::sui::SUI' } } },
		});

		expect(resolveDefaultCoinType({ config })).toBe(
			'0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
		);
		expect(resolveDefaultCoinType({ config, coinType: customCoinType })).toBe(customCoinType);
	});
});

describe('owner resolution', () => {
	it('normalizes raw Sui addresses without a SuiNS lookup', async () => {
		const lookup = vi.fn<ResolveNameServiceAddress>();

		await expect(
			resolveOwnerAddress({ owner, bundle: createResolverBundle(lookup) }),
		).resolves.toBe(owner);
		expect(lookup).not.toHaveBeenCalled();
	});

	it('resolves SuiNS names and subnames before transaction construction', async () => {
		const lookup = vi.fn<ResolveNameServiceAddress>().mockResolvedValue({ address: resolvedOwner });

		await expect(
			resolveOwnerAddress({ owner: 'furbor.sui', bundle: createResolverBundle(lookup) }),
		).resolves.toBe(resolvedOwner);
		expect(lookup).toHaveBeenCalledWith({ name: 'furbor.sui' });

		await expect(
			resolveOwnerAddress({ owner: 'desk.furbor.sui', bundle: createResolverBundle(lookup) }),
		).resolves.toBe(resolvedOwner);
		expect(lookup).toHaveBeenLastCalledWith({ name: 'desk.furbor.sui' });
	});

	it('rejects invalid or unresolved SuiNS owners with actionable errors', async () => {
		await expect(
			resolveOwnerAddress({
				owner: 'not a name',
				bundle: createResolverBundle(async () => ({ address: resolvedOwner })),
			}),
		).rejects.toThrow(/Sui address or SuiNS name/u);

		await expect(
			resolveOwnerAddress({
				owner: 'missing.sui',
				bundle: createResolverBundle(async () => ({ address: null })),
			}),
		).rejects.toThrow(/did not resolve/u);
	});
});

describe('session execution', () => {
	const transactionFields = {
		signatures: [],
		epoch: null,
		timestampMs: null,
		checkpoint: null,
		balanceChanges: undefined,
		effects: undefined,
		events: undefined,
		objectTypes: undefined,
		transaction: undefined,
		bcs: undefined,
	};

	it('signs and submits with the supplied session signer', async () => {
		const signer = Ed25519Keypair.generate();
		vi.spyOn(signer, 'toSuiAddress').mockReturnValue(owner);
		const signAndExecuteTransaction = vi
			.fn<SuigarClientBundle['client']['signAndExecuteTransaction']>()
			.mockResolvedValue({
				$kind: 'Transaction',
				protoJson: undefined,
				Transaction: {
					digest: 'session-digest',
					...transactionFields,
					status: { success: true, error: null },
				},
			});
		const { client } = createSuigarClient({ network: 'testnet' });
		vi.spyOn(client, 'signAndExecuteTransaction').mockImplementation(signAndExecuteTransaction);
		const transaction = new Transaction();

		await expect(
			executeSessionTransaction({
				transaction,
				client,
				signer,
			}),
		).resolves.toEqual({
			address: owner,
			digest: 'session-digest',
			status: 'success',
		});
		expect(signAndExecuteTransaction).toHaveBeenCalledWith({
			transaction,
			signer,
			include: { effects: true },
		});
	});

	it('reports an on-chain failed session execution without an approval flow', async () => {
		const signer = Ed25519Keypair.generate();
		vi.spyOn(signer, 'toSuiAddress').mockReturnValue(owner);
		const signAndExecuteTransaction = vi
			.fn<SuigarClientBundle['client']['signAndExecuteTransaction']>()
			.mockResolvedValue({
				$kind: 'FailedTransaction',
				protoJson: undefined,
				FailedTransaction: {
					digest: 'failed-digest',
					...transactionFields,
					status: {
						success: false,
						error: { $kind: 'Unknown', Unknown: null, message: 'Insufficient gas' },
					},
				},
			});
		const { client } = createSuigarClient({ network: 'testnet' });
		vi.spyOn(client, 'signAndExecuteTransaction').mockImplementation(signAndExecuteTransaction);

		await expect(
			executeSessionTransaction({
				transaction: new Transaction(),
				client,
				signer,
			}),
		).resolves.toEqual({
			address: owner,
			digest: 'failed-digest',
			status: 'failed',
			error: 'Insufficient gas',
		});
	});
});
