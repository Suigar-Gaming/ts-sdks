// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { IncomingMessage, ServerResponse } from 'node:http';
import { Socket } from 'node:net';
import { describe, expect, it, vi } from 'vitest';
import {
	asyncRequestListener,
	getLoopbackServerPort,
	LOCALHOST_HOST,
	LOOPBACK_HOST,
	LOOPBACK_ORIGIN,
	loopbackOrigin,
} from '../../src/wallet/loopback.js';

describe('wallet loopback helpers', () => {
	it.each([
		{ rejection: new Error('request failed'), expected: { message: 'request failed' } },
		{
			rejection: 'request failed',
			expected: { message: 'Local request failed.', cause: 'request failed' },
		},
	])(
		'closes requests when an asynchronous handler rejects: $rejection',
		async ({ rejection, expected }) => {
			const request = new IncomingMessage(new Socket());
			const response = new ServerResponse(request);
			const destroy = vi.spyOn(response, 'destroy').mockReturnValue(response);
			try {
				const handler = vi.fn<() => Promise<void>>().mockRejectedValue(rejection);
				asyncRequestListener(handler)(request, response);
				await Promise.resolve();
				expect(destroy).toHaveBeenCalledOnce();
				expect(destroy.mock.calls[0]![0]).toMatchObject(expected);
			} finally {
				request.destroy();
			}
		},
	);

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
