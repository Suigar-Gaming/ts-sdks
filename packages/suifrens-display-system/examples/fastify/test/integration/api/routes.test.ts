import { ObjectError } from '@mysten/sui/client';
import { beforeEach, expect, test, vi } from 'vitest';
import { buildServer } from '../../../src/api/app.js';
import { BULLSHARK_TYPE, CAPY_TYPE, SUIFREN_TYPE } from '../../../src/api/lib/config.js';
import { SuiFren } from '../../../src/api/lib/suifren-bcs.js';
import { client } from '../../helpers/sui-client.js';

vi.mock('@mysten/sui/grpc', async () => (await import('../../helpers/sui-client.js')).grpcMock);
beforeEach(() => {
	vi.resetAllMocks();
});

test('Fastify 5 serves health and SVGs, and completes missing-accessory responses', async () => {
	const app = buildServer({ logger: false });
	try {
		expect((await app.inject('/')).json()).toEqual({ ok: true });
		const image = await app.inject('/accessories/soccer%20team%20shirt/svg');
		expect(image.statusCode).toBe(200);
		expect(image.headers['content-type']).toMatch(/image\/svg\+xml/);
		expect(image.body).toMatch(/^<svg/);
		expect((await app.inject('/accessories/missing/svg')).statusCode).toBe(404);
		const cors = await app.inject({
			method: 'OPTIONS',
			url: '/',
			headers: {
				origin: 'https://example.com',
				'access-control-request-method': 'GET',
			},
		});
		expect(cors.statusCode).toBe(204);
		expect(cors.headers['access-control-allow-origin']).toBe('*');
	} finally {
		await app.close();
	}
});

test.each([
	[CAPY_TYPE, 'ear1'],
	[BULLSHARK_TYPE, 'classic'],
])('renders BCS attributes for %s and maps missing objects to 404', async (species, trait) => {
	const app = buildServer({ logger: false });
	client.getObject.mockResolvedValue({
		object: {
			type: `${SUIFREN_TYPE}<${species}>`,
			content: SuiFren.serialize({
				id: '0x1',
				generation: 1,
				birthdate: 1700000000000,
				cohort: 42,
				genes: [24, 8],
				attributes: ['basic', '6FBBEE', 'E6FBFF', 'happy', trait],
				birth_location: 'Sui',
			}).toBytes(),
		},
	});
	client.listDynamicFields.mockResolvedValue({
		dynamicFields: [],
		cursor: null,
		hasNextPage: false,
	});
	try {
		const image = await app.inject('/suifrens/0x1/svg');
		expect(image.statusCode).toBe(200);
		expect(image.body).toMatch(/^<svg/);
		expect(client.getObject).toHaveBeenCalledWith({ objectId: '0x1', include: { content: true } });
		client.getObject.mockResolvedValueOnce({
			object: { type: `${SUIFREN_TYPE}<${species}>`, content: new Uint8Array([1]) },
		});
		expect((await app.inject('/suifrens/0x1/svg')).statusCode).toBe(500);
		client.getObject.mockRejectedValue(
			new ObjectError('NOT_FOUND', 'missing', { reason: 'notFound' }),
		);
		expect((await app.inject('/suifrens/0x1/svg')).statusCode).toBe(404);
		client.getObject.mockRejectedValue(new Error('private upstream detail'));
		const failed = await app.inject('/suifrens/0x1/svg');
		expect(failed.statusCode).toBe(500);
		expect(failed.body).not.toMatch(/private upstream detail/);
	} finally {
		await app.close();
	}
});
