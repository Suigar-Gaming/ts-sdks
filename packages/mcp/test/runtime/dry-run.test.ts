// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { SuiClientTypes } from '@mysten/sui/client';
import { describe, expect, it } from 'vitest';
import { extractDryRunErrors, summarizeDryRun, toJsonValue } from '../../src/runtime/dry-run.js';
import type { RawDryRunResult } from '../../src/runtime/types.js';

const testAddress = (fill: string) => `0x${fill.repeat(64)}`;
const owner = testAddress('a');
const packageId = testAddress('b');
const gamePackageId = testAddress('c');

const transactionDefaults: NonNullable<RawDryRunResult['Transaction']> = {
	digest: 'simulation-digest',
	signatures: [],
	epoch: null,
	timestampMs: null,
	checkpoint: null,
	status: { success: true, error: null },
	balanceChanges: [],
	events: [],
	objectTypes: undefined,
	transaction: undefined,
	bcs: undefined,
	effects: {
		bcs: null,
		version: 2,
		status: { success: true, error: null },
		gasUsed: {
			computationCost: '0',
			storageCost: '0',
			storageRebate: '0',
			nonRefundableStorageFee: '0',
		},
		transactionDigest: 'simulation-digest',
		gasObject: null,
		eventsDigest: null,
		dependencies: [],
		lamportVersion: null,
		changedObjects: [],
		unchangedConsensusObjects: [],
		auxiliaryDataDigest: null,
	},
};

const eventDefaults = {
	packageId,
	module: 'coinflip',
	sender: owner,
	bcs: new Uint8Array(),
} satisfies Omit<SuiClientTypes.Event, 'eventType' | 'json'>;

describe('dry-run JSON conversion', () => {
	it('converts dry-run payloads into JSON-safe values', () => {
		expect(
			toJsonValue({
				bytes: new Uint8Array([7, 8, 9]),
				amount: 1n,
				invalidNumber: Number.POSITIVE_INFINITY,
				omitted: undefined,
				nested: [true, undefined, null],
			}),
		).toEqual({
			bytes: [7, 8, 9],
			amount: '1',
			invalidNumber: 'Infinity',
			omitted: null,
			nested: [true, null, null],
		});
	});
});

describe('dry-run errors', () => {
	it('extracts failed transaction errors from nested status fields', () => {
		const status: SuiClientTypes.ExecutionStatus = {
			success: false,
			error: { $kind: 'Unknown', Unknown: null, message: 'MoveAbort in coinflip::play' },
		};
		const dryRun = {
			$kind: 'FailedTransaction',
			commandResults: undefined,
			gasPaymentMocked: false,
			FailedTransaction: {
				...transactionDefaults,
				status,
				effects: { ...transactionDefaults.effects, status },
			},
		} satisfies RawDryRunResult;
		expect(extractDryRunErrors(dryRun)).toEqual(['MoveAbort in coinflip::play']);
	});

	it('deduplicates errors found on multiple dry-run branches', () => {
		const status: SuiClientTypes.ExecutionStatus = {
			success: false,
			error: { $kind: 'Unknown', Unknown: null, message: 'same error' },
		};
		const failedTransaction = {
			...transactionDefaults,
			status,
			message: 'same error',
			effects: {
				...transactionDefaults.effects,
				message: 'same error',
				status,
			},
		};
		const dryRun = {
			$kind: 'FailedTransaction',
			commandResults: undefined,
			gasPaymentMocked: false,
			FailedTransaction: failedTransaction,
		} satisfies RawDryRunResult;
		expect(extractDryRunErrors(dryRun)).toEqual(['same error']);
	});
});

describe('dry-run summaries', () => {
	it('summarizes successful dry-run gas, balance changes, and event amounts', () => {
		const dryRun = {
			$kind: 'Transaction',
			commandResults: undefined,
			gasPaymentMocked: false,
			Transaction: {
				...transactionDefaults,
				effects: {
					...transactionDefaults.effects,
					status: { success: true, error: null },
					gasUsed: {
						computationCost: '1120000',
						storageCost: '35476800',
						storageRebate: '26792964',
						nonRefundableStorageFee: '0',
					},
				},
				balanceChanges: [
					{
						address: owner,
						coinType: '0x2::sui::SUI',
						amount: '-9803836',
					},
				],
				events: [
					{
						...eventDefaults,
						eventType: `${packageId}::core::BetResultEvent<${gamePackageId}::coinflip::Game>`,
						json: {
							player_bet: 'heads',
							coin_outcome: 'heads',
							stake_amount: '1000000000',
							outcome_amount: '2000000000',
						},
					},
				],
			},
		} satisfies RawDryRunResult;

		const summary = summarizeDryRun({
			dryRun,
			context: {
				coinDecimals: 9,
			},
		});

		expect(summary).toMatchObject({
			success: true,
			error: null,
			gasUsed: {
				computation: {
					raw: '1120000',
					display: '0.00112',
				},
				storage: {
					raw: '35476800',
					display: '0.0354768',
				},
				rebate: {
					raw: '26792964',
					display: '0.026792964',
				},
				net: {
					raw: '-9803836',
					display: '-0.009803836',
				},
			},
			balanceChanges: [
				{
					address: owner,
					coinType: '0x2::sui::SUI',
					amount: {
						raw: '-9803836',
						display: '-0.009803836',
					},
				},
			],
			events: [
				{
					type: `${packageId}::core::BetResultEvent<${gamePackageId}::coinflip::Game>`,
					fields: {
						player_bet: 'heads',
						coin_outcome: 'heads',
						stake_amount: '1000000000',
						stake_amount_display: '1',
						outcome_amount: '2000000000',
						outcome_amount_display: '2',
					},
				},
			],
		});
	});

	it('keeps parsed event identity for JSON bet result events after other events', () => {
		const dryRun = {
			$kind: 'Transaction',
			commandResults: undefined,
			gasPaymentMocked: false,
			Transaction: {
				...transactionDefaults,
				effects: {
					...transactionDefaults.effects,
					status: { success: true, error: null },
				},
				events: [
					{
						...eventDefaults,
						eventType: `${packageId}::core::BetPlacedEvent`,
						json: {
							amount: '5000000',
							game_type: `${gamePackageId}::coinflip::CoinFlip`,
						},
					},
					{
						...eventDefaults,
						eventType: `${packageId}::core::BetResultEvent<${gamePackageId}::coinflip::Game>`,
						json: {
							player_bet: 'tails',
							coin_outcome: 'tails',
							stake_amount: '10000000000',
							outcome_amount: '20000000000',
						},
					},
				],
			},
		} satisfies RawDryRunResult;

		const summary = summarizeDryRun({
			dryRun,
			context: {
				coinDecimals: 9,
			},
		});

		expect(summary.events).toMatchObject([
			{
				type: `${packageId}::core::BetPlacedEvent`,
				fields: {
					amount: '5000000',
					amount_display: '0.005',
					game_type: `${gamePackageId}::coinflip::CoinFlip`,
				},
			},
			{
				type: `${packageId}::core::BetResultEvent<${gamePackageId}::coinflip::Game>`,
				game: 'coinflip',
				event: 'BetResultEvent',
				fields: {
					player_bet: 'tails',
					coin_outcome: 'tails',
					stake_amount: '10000000000',
					stake_amount_display: '10',
					outcome_amount: '20000000000',
					outcome_amount_display: '20',
				},
			},
		]);
	});

	it('summarizes failed dry-runs without balance or event data', () => {
		const status: SuiClientTypes.ExecutionStatus = {
			success: false,
			error: { $kind: 'Unknown', Unknown: null, message: 'MoveAbort in coinflip::play' },
		};
		const dryRun = {
			$kind: 'FailedTransaction',
			commandResults: undefined,
			gasPaymentMocked: false,
			FailedTransaction: {
				...transactionDefaults,
				status,
				effects: { ...transactionDefaults.effects, status },
			},
		} satisfies RawDryRunResult;
		const summary = summarizeDryRun({ dryRun, context: { coinDecimals: 9 } });

		expect(summary).toEqual({
			success: false,
			error: 'MoveAbort in coinflip::play',
			gasUsed: {
				computation: { raw: '0', display: '0' },
				storage: { raw: '0', display: '0' },
				rebate: { raw: '0', display: '0' },
				nonRefundableStorageFee: { raw: '0', display: '0' },
				net: { raw: '0', display: '0' },
			},
			balanceChanges: [],
			events: [],
		});
	});
});
