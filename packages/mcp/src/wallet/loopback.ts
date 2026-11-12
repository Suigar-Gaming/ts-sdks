// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { IncomingMessage, RequestListener, ServerResponse } from 'node:http';
import type { Server } from 'node:net';

export const LOOPBACK_HOST: string = '127.0.0.1';
export const LOCALHOST_HOST: string = 'localhost';
export const LOOPBACK_ORIGIN: string = `http://${LOOPBACK_HOST}`;

export function loopbackOrigin(port: number | string): string {
	return `${LOOPBACK_ORIGIN}:${port}`;
}

export function getLoopbackServerPort(server: Pick<Server, 'address'>): number {
	const address = server.address();
	if (address == null || typeof address === 'string') {
		throw new Error('Unable to resolve the local server address.');
	}
	return address.port;
}

/** Adapts asynchronous local HTTP handlers to Node's synchronous listener contract. */
export function asyncRequestListener(
	handler: (request: IncomingMessage, response: ServerResponse) => Promise<void>,
): RequestListener {
	return (request, response) => {
		void handler(request, response).catch((error: unknown) => {
			response.destroy(
				error instanceof Error ? error : new Error('Local request failed.', { cause: error }),
			);
		});
	};
}
