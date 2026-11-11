// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { spawn } from 'node:child_process';
import { build } from 'tsdown';

const args = process.argv.slice(2);

await build({
	entry: ['src/api/index.ts'],
	watch: true,
	onSuccess: (_config, signal) => {
		const server = spawn(process.execPath, ['dist/index.mjs', ...args], {
			stdio: 'inherit',
			signal,
		});
		server.on('error', (error) => {
			if (!signal.aborted) {
				console.error(error);
				process.exitCode = 1;
			}
		});
		server.on('exit', (code) => {
			if (!signal.aborted && code) {
				process.exitCode = code;
			}
		});
	},
});
