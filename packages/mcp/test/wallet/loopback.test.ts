// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from 'vitest';
import {
	getLoopbackServerPort,
	LOCALHOST_HOST,
	LOOPBACK_HOST,
	LOOPBACK_ORIGIN,
	loopbackOrigin,
} from '../../src/wallet/loopback.js';

describe('wallet loopback helpers', () => {
	it('centralizes loopback host values', () => {
		expect(LOOPBACK_HOST).toBe('127.0.0.1');
		expect(LOCALHOST_HOST).toBe('localhost');
		expect(LOOPBACK_ORIGIN).toBe('http://127.0.0.1');
	});

	it('reads the assigned TCP port and rejects missing or non-TCP addresses', () => {
		expect(
			getLoopbackServerPort({
				address: () => ({ address: '127.0.0.1', family: 'IPv4', port: 12345 }),
			}),
		).toBe(12345);
		expect(() => getLoopbackServerPort({ address: () => null })).toThrow(
			'Unable to resolve the local server address.',
		);
		expect(() => getLoopbackServerPort({ address: () => '/tmp/socket' })).toThrow(
			'Unable to resolve the local server address.',
		);
	});

	it('formats loopback origins for numeric and string ports', () => {
		expect(loopbackOrigin(12345)).toBe('http://127.0.0.1:12345');
		expect(loopbackOrigin('54321')).toBe('http://127.0.0.1:54321');
	});
});
