// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import { buildServer } from './app.js';

const fastify = buildServer();
// Start the server:
fastify.listen({ port: 3000, host: '0.0.0.0' }, (err) => {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`SuiFrens image rendering server started successfully!`);
});
