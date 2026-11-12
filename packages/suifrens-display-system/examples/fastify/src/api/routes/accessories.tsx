// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { FastifyPluginCallback } from 'fastify';
import { renderToStaticMarkup } from 'react-dom/server';
import { Type } from 'typebox';
import { ACCESSORIES as suiFrensAccessories } from '@suigar/suifrens-display-system/accessories';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import { IMAGE_LOGO_SCHEMA, renderImageLogo } from '../lib/image-logo.js';
import { renderImage } from '../lib/render-image.js';

export const accessories: FastifyPluginCallback = (fastify, _options, done) => {
	for (const format of ['svg', 'png'] as const) {
		fastify.withTypeProvider<TypeBoxTypeProvider>().get(
			`/accessories/:name/${format}`,
			{
				schema: {
					params: Type.Object({
						name: Type.String(),
					}),
					querystring:
						format === 'png'
							? Type.Object({
									width: Type.Optional(Type.Integer({ minimum: 1, maximum: 4096 })),
									logo: IMAGE_LOGO_SCHEMA,
									shadow: Type.Optional(Type.Boolean({ default: true })),
								})
							: Type.Object({
									logo: IMAGE_LOGO_SCHEMA,
									shadow: Type.Optional(Type.Boolean({ default: true })),
								}),
					response: {
						200:
							format === 'svg'
								? Type.String()
								: Type.Unsafe<Buffer>({ type: 'string', contentMediaType: 'image/png' }),
						404: Type.Null(),
						500: Type.Null(),
					},
				},
			},
			async (request, reply) => {
				const accessoryName = request.params.name;
				const accessory = suiFrensAccessories.find((candidate) => candidate.name === accessoryName);

				if (!accessory) {
					return reply.status(404).send(null);
				}

				try {
					const renderedSvg = renderToStaticMarkup(
						<SuiFrenImageInline
							attributes={{
								mainColor: 'ffffff',
								secondaryColor: 'ffffff',
								expression: 'bigSmile',
								skin: 'basic',
								earShape: 'default',
							}}
							accessories={[accessory]}
							logo={renderImageLogo(request.query.logo)}
							shadow={request.query.shadow ?? true}
							incognito
						/>,
					);
					const image = await renderImage(
						renderedSvg,
						format,
						'width' in request.query && typeof request.query.width === 'number'
							? request.query.width
							: undefined,
					);
					reply.header('Content-Type', image.contentType);
					return await reply.send(image.body);
				} catch (error: unknown) {
					request.log.error({ err: error, accessoryName }, 'Failed to render accessory');
					return reply.status(500).send(null);
				}
			},
		);
	}
	done();
};
