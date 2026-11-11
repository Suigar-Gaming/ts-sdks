// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Server } from 'node:net';

export const LOOPBACK_HOST: string = '127.0.0.1';
export const LOCALHOST_HOST: string = 'localhost';
export const LOOPBACK_ORIGIN: string = `http://${LOOPBACK_HOST}`;

export function loopbackOrigin(port: number | string): string {
	return `${LOOPBACK_ORIGIN}:${port}`;
}

export function getLoopbackServerPort(server: Pick<Server, 'address'>): number {
	const address = server.address();
	if (!address || typeof address === 'string') {
		throw new Error('Unable to resolve the local server address.');
	}
	return address.port;
}
