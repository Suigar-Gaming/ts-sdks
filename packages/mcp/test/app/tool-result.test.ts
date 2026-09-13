// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from 'vitest';
import { getToolResultPayload } from '../../src/app/src/lib/tool-result.js';

describe('getToolResultPayload', () => {
	it('uses direct structured content', () => {
		expect(
			getToolResultPayload({ content: [], structuredContent: { network: 'testnet' } }),
		).toEqual({
			network: 'testnet',
		});
	});

	it('supports a wrapped result envelope', () => {
		expect(
			getToolResultPayload({ result: { structuredContent: { network: 'testnet' } } } as never),
		).toEqual({ network: 'testnet' });
	});

	it('parses JSON text content', () => {
		expect(
			getToolResultPayload({ content: [{ type: 'text', text: '{"network":"testnet"}' }] }),
		).toEqual({ network: 'testnet' });
	});
});
