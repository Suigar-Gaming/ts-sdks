// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { ObjectError } from '@mysten/sui/client';
import type { FastifyPluginAsync } from 'fastify';
import { renderToStaticMarkup } from 'react-dom/server';
import Type from 'typebox';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import { getSuiFrenAttributesAndAccessories } from '../client/sui-client.js';
import { IMAGE_LOGO_SCHEMA, renderImageLogo } from '../lib/image-logo.js';
import { renderImage } from '../lib/render-image.js';

export const suifrens: FastifyPluginAsync = async (fastify) => {
	for (const format of ['svg', 'png'] as const) {
		fastify.withTypeProvider<TypeBoxTypeProvider>().get(
			`/suifrens/:suifrenId/${format}`,
			{
				schema: {
					params: Type.Object({
						suifrenId: Type.String(),
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
				const suifrenId = request.params.suifrenId;
				try {
					const { attributes, equippedAccessories } =
						await getSuiFrenAttributesAndAccessories(suifrenId);
					const renderedSvg = renderToStaticMarkup(
						<SuiFrenImageInline
							attributes={attributes}
							accessories={equippedAccessories}
							logo={renderImageLogo(request.query.logo)}
							shadow={request.query.shadow ?? true}
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
					return reply.send(image.body);
				} catch (e: unknown) {
					if (e instanceof ObjectError && (e.reason === 'deleted' || e.reason === 'notFound')) {
						return reply.status(404).send(null);
					}
					request.log.error({ err: e, suifrenId }, 'Failed to render SuiFren');
					return reply.status(500).send(null);
				}
			},
		);
	}
};
