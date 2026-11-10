import { ObjectError, type SuiClientTypes } from '@mysten/sui/client';
import { beforeEach, expect, test, vi } from 'vitest';
import { accessories } from '@suigar/suifrens-display-system/accessories';
import { buildServer } from '../src/api/app.js';
import { getSuiFrenAccessories } from '../src/api/client/sui-client.js';
import { ACCESSORIES_KEY_TYPE, CAPY_TYPE } from '../src/api/lib/config.js';

const client = vi.hoisted(() => ({
	getObject:
		vi.fn<
			(
				options: SuiClientTypes.GetObjectOptions,
			) => Promise<{ object: { type: string; json: { attributes: Array<string> } } }>
		>(),
	listDynamicFields: vi.fn<
		(options: SuiClientTypes.ListDynamicFieldsOptions) => Promise<{
			dynamicFields: Array<{ name: SuiClientTypes.DynamicFieldName; $kind?: string }>;
			cursor: string | null;
			hasNextPage: boolean;
		}>
	>(),
	getDynamicObjectField:
		vi.fn<
			(
				options: SuiClientTypes.GetDynamicObjectFieldOptions,
			) => Promise<{ object: { json: { name: string } } }>
		>(),
}));
vi.mock('@mysten/sui/grpc', () => ({
	SuiGrpcClient: class {
		getObject = client.getObject;
		listDynamicFields = client.listDynamicFields;
		getDynamicObjectField = client.getDynamicObjectField;
	},
}));
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

test('Sui gRPC reads JSON attributes and maps missing objects to 404', async () => {
	const app = buildServer({ logger: false });
	client.getObject.mockResolvedValue({
		object: {
			type: `0x1::suifrens::SuiFren<${CAPY_TYPE}>`,
			json: { attributes: ['basic', '6FBBEE', 'E6FBFF', 'happy', 'ear1'] },
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
		expect(client.getObject).toHaveBeenCalledWith({ objectId: '0x1', include: { json: true } });
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

test('gRPC accessory lookup follows pagination and dynamic-object names', async () => {
	const name = { type: ACCESSORIES_KEY_TYPE, bcs: new Uint8Array([1]) };
	client.listDynamicFields
		.mockResolvedValueOnce({
			dynamicFields: [{ name: { ...name, type: 'unrelated' } }],
			cursor: 'next',
			hasNextPage: true,
		})
		.mockResolvedValueOnce({
			dynamicFields: [{ $kind: 'DynamicObject', name }],
			cursor: null,
			hasNextPage: false,
		});
	client.getDynamicObjectField.mockResolvedValue({
		object: { json: { name: accessories[0].name } },
	});
	expect(await getSuiFrenAccessories('0x1')).toEqual([accessories[0]]);
	expect(client.listDynamicFields).toHaveBeenCalledTimes(2);
	expect(client.listDynamicFields).toHaveBeenNthCalledWith(2, { parentId: '0x1', cursor: 'next' });
	expect(client.getDynamicObjectField).toHaveBeenCalledExactlyOnceWith({
		parentId: '0x1',
		name,
		include: { json: true },
	});
});
