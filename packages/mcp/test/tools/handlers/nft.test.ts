// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { buildNftV1MintTransactionTool, listNftsTool } from '../../../src/tools/handlers/index.js';
import { getReadOnlyPlan } from '../../result-assertions.js';

describe('list_nfts', () => {
	it('requires an owner when listing NFTs', async () => {
		await expect(listNftsTool({})).rejects.toThrow('Missing required field: owner.');
	});
});

describe('build_nft_v1_mint_transaction', () => {
	it('returns a read-only plan', async () => {
		const result = await buildNftV1MintTransactionTool({ mode: 'read-only' });
		const content = getReadOnlyPlan(result.structuredContent);

		expect(content.mode).toBe('read-only');
		expect(content.network).toBe('testnet');
		expect(content.plan.target).toMatch(/^0x.*::/u);
		expect(result.content[0].text).toContain('"read-only"');
	});

	it('returns an NFT V1 mint plan with its resolved configuration', async () => {
		const result = await buildNftV1MintTransactionTool({
			mode: 'read-only',
		});
		const content = z
			.object({
				plan: z.object({ target: z.string(), requiredInputs: z.array(z.string()) }),
				nft: z.object({ packageId: z.string(), factoryId: z.string() }),
			})
			.parse(result.structuredContent);

		expect(content.plan.target).toMatch(/::nft::mint_to_sender$/u);
		expect(content.plan.requiredInputs).toEqual(['owner', 'specId']);
		expect(content.nft.packageId).toMatch(/^0x/u);
		expect(content.nft.factoryId).toMatch(/^0x/u);
	});
});
