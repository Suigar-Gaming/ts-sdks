// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type * as SuiTransactions from '@mysten/sui/transactions';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import {
	buildSweetHouseClaimOwnRedeemRequestAfterDelayTransactionTool,
	buildSweetHouseDepositTransactionTool,
	buildSweetHouseRedeemRequestTransactionTool,
} from '../../../src/tools/handlers/index.js';
import { getBuildResult } from '../../result-assertions.js';

const mocks = vi.hoisted(() => ({
	buildTransactionBytes: vi.fn<SuiTransactions.Transaction['build']>(),
}));

vi.mock('@mysten/sui/transactions', async (importOriginal) => {
	const actual = await importOriginal<typeof SuiTransactions>();

	return {
		...actual,
		Transaction: class MockTransaction extends actual.Transaction {
			override build = mocks.buildTransactionBytes;
		},
	};
});

const testAddress = (fill: string) => `0x${fill.repeat(64)}`;
const owner = testAddress('a');
const requestId = testAddress('b');

beforeEach(() => {
	mocks.buildTransactionBytes.mockResolvedValue(new Uint8Array([1]));
});

afterEach(() => {
	mocks.buildTransactionBytes.mockReset();
});

describe('SweetHouse transaction tools', () => {
	it.each([
		[
			'deposit',
			() => buildSweetHouseDepositTransactionTool({ mode: 'read-only' }),
			'deposit_public_pool_and_mint_staked_coins',
			['owner', 'amount'],
		],
		[
			'redeem request',
			() => buildSweetHouseRedeemRequestTransactionTool({ mode: 'read-only' }),
			'redeem_request',
			['owner', 'amount'],
		],
		[
			'delayed claim',
			() =>
				buildSweetHouseClaimOwnRedeemRequestAfterDelayTransactionTool({
					mode: 'read-only',
				}),
			'claim_own_redeem_request_after_delay',
			['owner', 'requestId'],
		],
	])('returns a read-only plan for %s', async (_name, run, functionName, requiredInputs) => {
		const result = await run();
		const content = z
			.object({
				mode: z.literal('read-only'),
				plan: z.object({ target: z.string(), requiredInputs: z.array(z.string()) }),
				sweethouse: z.object({ packageId: z.string(), sweetHouseId: z.string() }),
			})
			.parse(result.structuredContent);

		expect(content.mode).toBe('read-only');
		expect(content.plan.target).toContain(`::sweethouse::${functionName}`);
		expect(content.plan.requiredInputs).toEqual(requiredInputs);
		expect(content.sweethouse.packageId).toMatch(/^(?:0x|@suigar\/)/u);
		expect(content.sweethouse.sweetHouseId).toMatch(/^0x/u);
	});

	it('builds SDK-backed SweetHouse transactions', async () => {
		const [deposit, redeem, claim] = await Promise.all([
			buildSweetHouseDepositTransactionTool({
				mode: 'build',
				owner,
				amount: '1',
			}),
			buildSweetHouseRedeemRequestTransactionTool({
				mode: 'build',
				owner,
				amount: '1',
			}),
			buildSweetHouseClaimOwnRedeemRequestAfterDelayTransactionTool({
				mode: 'build',
				owner,
				requestId,
			}),
		]);

		const depositSummary = getBuildResult(deposit.structuredContent).summary;
		const redeemSummary = getBuildResult(redeem.structuredContent).summary;
		const claimSummary = getBuildResult(claim.structuredContent).summary;

		expect(depositSummary.gameInputs).toEqual({ sweetHouseAction: 'deposit' });
		expect(redeemSummary.gameInputs).toEqual({ sweetHouseAction: 'redeem-request' });
		expect(claimSummary.gameInputs).toEqual({
			sweetHouseAction: 'claim-own-redeem-request-after-delay',
			requestId,
		});
		expect(depositSummary.commands).toEqual([]);
		expect(redeemSummary.commands).toEqual([]);
		expect(claimSummary.commands).toEqual([]);
		expect(mocks.buildTransactionBytes).toHaveBeenCalledTimes(3);
	});
});
