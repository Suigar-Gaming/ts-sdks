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
	fastify.get('/', async () => {
		return { ok: true };
	});

	return fastify;
}
