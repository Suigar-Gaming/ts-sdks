// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { ObjectError } from '@mysten/sui/client';
import type { FastifyInstance } from 'fastify';
import sharp from 'sharp';
import { beforeEach, expect, test, vi } from 'vitest';
import { buildServer } from '../../../src/api/app.js';
import {
	ACCESSORIES_KEY_TYPE,
	ACCESSORY_TYPE,
	BULLSHARK_TYPE,
	CAPY_TYPE,
	SUIFREN_TYPE,
} from '../../../src/api/lib/config.js';
import * as imageRenderer from '../../../src/api/lib/render-image.js';
import { Accessory, SuiFren } from '../../../src/api/lib/suifren-bcs.js';
import { client } from '../../helpers/sui-client.js';

vi.mock('@mysten/sui/grpc', async () => (await import('../../helpers/sui-client.js')).grpcMock);
beforeEach(() => {
	vi.resetAllMocks();
});

test.each(['svg', 'png'])(
	'serves health and %s images and handles missing accessories',
	async (format) => {
		const app = buildServer({ logger: false });
		try {
			expect((await app.inject('/')).json()).toEqual({ ok: true });
			const image = await app.inject(`/accessories/soccer%20team%20shirt/${format}`);
			expect(image.statusCode).toBe(200);
			if (format === 'svg') {
				expectSvgResponse(image);
			} else {
				await expectPngResponse(image);
			}
			expect((await app.inject(`/accessories/missing/${format}`)).statusCode).toBe(404);
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
	},
);

test.each([
	[CAPY_TYPE, 'ear1', 'svg'],
	[BULLSHARK_TYPE, 'classic', 'svg'],
	[CAPY_TYPE, 'ear1', 'png'],
	[BULLSHARK_TYPE, 'classic', 'png'],
])('renders %s with %s in %s and handles upstream failures', async (species, trait, format) => {
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
				attributes: ['basic', '6fbbee', 'e6fbff', 'happy', trait],
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
		const image = await app.inject(`/suifrens/0x1/${format}`);
		expect(image.statusCode).toBe(200);
		if (format === 'png') {
			await expectPngResponse(image);
		} else {
			expectSvgResponse(image);
		}
		await expectLogoVariants(app, `/suifrens/0x1/${format}`);
		await expectOptionVariants(app, `/suifrens/0x1/${format}`, 'shadow', true);
		expect(client.getObject).toHaveBeenCalledWith({ objectId: '0x1', include: { content: true } });
		if (format === 'png') {
			await expectEquippedPng(app, image.rawPayload);
			await expectResizedPng(app, '/suifrens/0x1/png');
		}

		client.getObject.mockResolvedValueOnce({
			object: { type: `${SUIFREN_TYPE}<${species}>`, content: new Uint8Array([1]) },
		});
		expect((await app.inject(`/suifrens/0x1/${format}`)).statusCode).toBe(500);
		client.getObject.mockRejectedValue(
			new ObjectError('NOT_FOUND', 'missing', { reason: 'notFound' }),
		);
		expect((await app.inject(`/suifrens/0x1/${format}`)).statusCode).toBe(404);
		client.getObject.mockRejectedValue(new Error('private upstream detail'));
		const failed = await app.inject(`/suifrens/0x1/${format}`);
		expect(failed.statusCode).toBe(500);
		expect(failed.body).not.toContain('private upstream detail');
	} finally {
		await app.close();
	}
});

async function expectPng(buffer: Buffer, width = 1024) {
	expect(buffer.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
	const image = sharp(buffer);
	const metadata = await image.metadata();
	expect(metadata.format).toBe('png');
	expect(metadata.width).toBe(width);
	expect(metadata.height).toBeGreaterThan(0);
	expect(metadata.hasAlpha).toBe(true);
	const stats = await image.stats();
	const alpha = stats.channels[3];
	expect(alpha?.min).toBe(0);
	expect(alpha?.max).toBe(255);
}

test.each(['/accessories/soccer%20team%20shirt/png'])(
	'returns a safe error when PNG conversion fails for %s',
	async (url) => {
		const app = buildServer({ logger: false });
		const conversion = vi
			.spyOn(imageRenderer, 'renderImage')
			.mockRejectedValueOnce(new Error('private conversion detail'));
		try {
			const response = await app.inject(url);
			expect(response.statusCode).toBe(500);
			expect(response.body).not.toContain('private');
			expect(conversion).toHaveBeenCalledOnce();
		} finally {
			await app.close();
		}
	},
);

function expectSvgResponse(image: { headers: Record<string, unknown>; body: string }) {
	expect(image.headers['content-type']).toContain('image/svg+xml');
	expect(image.body.startsWith('<svg')).toBe(true);
}

async function expectPngResponse(image: { headers: Record<string, unknown>; rawPayload: Buffer }) {
	expect(image.headers['content-type']).toBe('image/png');
	await expectPng(image.rawPayload);
}

async function expectEquippedPng(app: FastifyInstance, bareImage: Buffer) {
	client.listDynamicFields.mockResolvedValue({
		dynamicFields: [{ name: { type: ACCESSORIES_KEY_TYPE, bcs: new Uint8Array([1]) } }],
		cursor: null,
		hasNextPage: false,
	});
	client.getDynamicObjectField.mockResolvedValue({
		object: {
			type: ACCESSORY_TYPE,
			content: Accessory.serialize({ id: '0x2', name: 'baseball cap', type: 'hat' }).toBytes(),
		},
	});
	const equipped = await app.inject('/suifrens/0x1/png');
	expect(equipped.statusCode).toBe(200);
	await expectPng(equipped.rawPayload);
	expect(equipped.rawPayload.equals(bareImage)).toBe(false);
	const conversion = vi
		.spyOn(imageRenderer, 'renderImage')
		.mockRejectedValueOnce(new Error('private conversion detail'));
	const failedConversion = await app.inject('/suifrens/0x1/png');
	expect(failedConversion.statusCode).toBe(500);
	expect(failedConversion.body).not.toContain('private');
	conversion.mockRestore();
}

async function expectResizedPng(app: FastifyInstance, url: string) {
	const original = await app.inject(url);
	const originalMetadata = await sharp(original.rawPayload).metadata();
	const resized = await app.inject(`${url}?width=256`);
	expect(resized.headers['content-type']).toBe('image/png');
	await expectPng(resized.rawPayload, 256);
	const resizedMetadata = await sharp(resized.rawPayload).metadata();
	expect(resizedMetadata.height).toBe(
		Math.round((originalMetadata.height * 256) / originalMetadata.width),
	);
	return resized;
}

test('renders an accessory PNG at the requested width', async () => {
	const app = buildServer({ logger: false });
	try {
		const response = await expectResizedPng(app, '/accessories/soccer%20team%20shirt/png');
		expect(response.statusCode).toBe(200);
	} finally {
		await app.close();
	}
});

test.each(['0', '-1', '4097', '1.5', 'abc', '', '512&width=256'])(
	'rejects invalid PNG width %s before reading or rendering',
	async (width) => {
		const app = buildServer({ logger: false });
		const rendering = vi.spyOn(imageRenderer, 'renderImage');
		try {
			const suifren = await app.inject(`/suifrens/0x1/png?width=${width}`);
			const accessory = await app.inject(`/accessories/soccer%20team%20shirt/png?width=${width}`);
			expect(suifren.statusCode).toBe(400);
			expect(accessory.statusCode).toBe(400);
			expect(client.getObject).not.toHaveBeenCalled();
			expect(rendering).not.toHaveBeenCalled();
		} finally {
			await app.close();
		}
	},
);

async function expectOptionVariants(
	app: FastifyInstance,
	url: string,
	option: 'shadow',
	defaultValue: boolean,
) {
	const original = await app.inject(url);
	const enabled = await app.inject(`${url}?${option}=true`);
	const disabled = await app.inject(`${url}?${option}=false`);
	expect(enabled.statusCode).toBe(200);
	expect(disabled.statusCode).toBe(200);
	expect(enabled.rawPayload.equals(disabled.rawPayload)).toBe(false);
	expect(original.rawPayload).toEqual(defaultValue ? enabled.rawPayload : disabled.rawPayload);
}

test.each([
	['svg', 'shadow', true],
	['png', 'shadow', true],
] as const)('toggles accessory %s %s', async (format, option, defaultValue) => {
	const app = buildServer({ logger: false });
	try {
		await expectOptionVariants(
			app,
			`/accessories/soccer%20team%20shirt/${format}`,
			option,
			defaultValue,
		);
		const image = await app.inject(`/accessories/soccer%20team%20shirt/${format}?${option}=false`);
		expect(image.statusCode).toBe(200);
	} finally {
		await app.close();
	}
});

test('combines PNG width, logo and shadow selection', async () => {
	const app = buildServer({ logger: false });
	try {
		const withLogo = await app.inject(
			'/accessories/soccer%20team%20shirt/png?width=256&logo=suigar&shadow=false',
		);
		const withoutLogo = await app.inject(
			'/accessories/soccer%20team%20shirt/png?width=256&shadow=false',
		);
		expect(withLogo.statusCode).toBe(200);
		expect(withoutLogo.statusCode).toBe(200);
		await expectPng(withLogo.rawPayload, 256);
		await expectPng(withoutLogo.rawPayload, 256);
		expect(withLogo.rawPayload.equals(withoutLogo.rawPayload)).toBe(false);
	} finally {
		await app.close();
	}
});

test.each(
	['logo', 'shadow'].flatMap((option) =>
		[
			...(option === 'logo' ? ['true', 'false', 'sui&logo=suigar'] : []),
			'invalid',
			'',
			'0',
			'1',
			`true&${option}=false`,
		].map((value) => [option, value]),
	),
)('rejects invalid %s value %s before reading or rendering', async (option, value) => {
	const app = buildServer({ logger: false });
	const rendering = vi.spyOn(imageRenderer, 'renderImage');
	try {
		for (const format of ['svg', 'png']) {
			const suifren = await app.inject(`/suifrens/0x1/${format}?${option}=${value}`);
			const accessory = await app.inject(
				`/accessories/soccer%20team%20shirt/${format}?${option}=${value}`,
			);
			expect(suifren.statusCode).toBe(400);
			expect(accessory.statusCode).toBe(400);
		}
		expect(client.getObject).not.toHaveBeenCalled();
		expect(rendering).not.toHaveBeenCalled();
	} finally {
		await app.close();
	}
});

async function expectLogoVariants(app: FastifyInstance, url: string) {
	const original = await app.inject(url);
	const sui = await app.inject(`${url}?logo=sui`);
	const suigar = await app.inject(`${url}?logo=suigar`);
	expect(original.statusCode).toBe(200);
	expect(sui.statusCode).toBe(200);
	expect(suigar.statusCode).toBe(200);
	expect(original.rawPayload.equals(sui.rawPayload)).toBe(false);
	expect(original.rawPayload.equals(suigar.rawPayload)).toBe(false);
	expect(sui.rawPayload.equals(suigar.rawPayload)).toBe(false);
	const expectImageResponse = url.endsWith('/svg') ? expectSvgResponse : expectPngResponse;
	await expectImageResponse(sui);
	await expectImageResponse(suigar);
}

test.each(['svg', 'png'])(
	'selects a Sui or Suigar logo for accessory %s output',
	async (format) => {
		const app = buildServer({ logger: false });
		try {
			await expectLogoVariants(app, `/accessories/soccer%20team%20shirt/${format}`);
			expect(client.getObject).not.toHaveBeenCalled();
		} finally {
			await app.close();
		}
	},
);

test.each(['sui', 'suigar'] as const)(
	'embeds the selected %s mark in standalone SVG output',
	async (logo) => {
		const app = buildServer({ logger: false });
		try {
			const original = await app.inject('/accessories/soccer%20team%20shirt/svg');
			const selected = await app.inject(`/accessories/soccer%20team%20shirt/svg?logo=${logo}`);
			expect(original.body).not.toContain('data-image-logo');
			expect(selected.body).toContain(`data-image-logo="${logo}"`);
			expect(selected.body).not.toContain('data:image/svg+xml;base64,');
			expect(selected.body.includes('viewBox="0 0 210 211"')).toBe(logo === 'suigar');
		} finally {
			await app.close();
		}
	},
);
