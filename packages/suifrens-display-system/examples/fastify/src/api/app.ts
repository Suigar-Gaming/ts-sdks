// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import compress from '@fastify/compress';
import cors from '@fastify/cors';
import Fastify, { type FastifyServerOptions } from 'fastify';
import { accessories } from './routes/accessories.js';
import { suifrens } from './routes/suifrens.js';

export function buildServer(options: FastifyServerOptions = {}) {
	const fastify = Fastify({
		...options,
		logger: options.logger ?? {
			transport: {
				target: 'pino-pretty',
				options: {
					translateTime: 'HH:MM:ss Z',
					ignore: 'pid,hostname',
				},
			},
		},
	});

	// Register plugins:
	fastify.register(compress);
	fastify.register(cors);

	// Register routes:
	fastify.register(suifrens);
	fastify.register(accessories);

	// Health check:
	fastify.get('/', () => {
		return Promise.try(() => {
			return { ok: true };
		});
	});

	return fastify;
}
