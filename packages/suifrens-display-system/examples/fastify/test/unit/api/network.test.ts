// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { expect, test } from 'vitest';
import { parseNetwork } from '../../../src/api/lib/network.js';

test('defaults to mainnet and accepts both network argument forms', () => {
	expect(parseNetwork([])).toBe('mainnet');
	expect(parseNetwork(['--network', 'mainnet'])).toBe('mainnet');
	expect(parseNetwork(['--network', 'testnet'])).toBe('testnet');
	expect(parseNetwork(['--network=testnet'])).toBe('testnet');
});

test.each([['--network', 'devnet'], ['--network'], ['--network=']])(
	'rejects invalid or missing network values: %j',
	(...args) => {
		expect(() => parseNetwork(args)).toThrow('Invalid --network. Use mainnet or testnet.');
	},
);
