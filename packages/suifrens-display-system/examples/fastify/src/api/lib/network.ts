// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { parseArgs } from 'node:util';

export function parseNetwork(args: Array<string>): 'mainnet' | 'testnet' {
	const { values } = parseArgs({
		args,
		options: { network: { type: 'string', default: 'mainnet' } },
		strict: false,
		allowPositionals: true,
	});
	if (values.network !== 'mainnet' && values.network !== 'testnet') {
		throw new Error('Invalid --network. Use mainnet or testnet.');
	}
	return values.network;
}
