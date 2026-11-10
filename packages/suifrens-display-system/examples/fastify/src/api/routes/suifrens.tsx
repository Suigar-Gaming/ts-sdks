// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { ObjectError } from '@mysten/sui/client';
import type { FastifyPluginAsync } from 'fastify';
import { renderToStaticMarkup } from 'react-dom/server';
import Type from 'typebox';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import { getSuiFrenAttributesAndAccessories } from '../client/sui-client.js';

export const suifrens: FastifyPluginAsync = async (fastify) => {
	fastify.withTypeProvider<TypeBoxTypeProvider>().get(
		'/suifrens/:suifrenId/svg',
		{
			schema: {
				params: Type.Object({
					suifrenId: Type.String(),
				}),
				response: {
					200: Type.String(),
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
						logo={null}
						shadow
					/>,
				);
				reply.header('Content-Type', 'image/svg+xml');
				return reply.send(renderedSvg);
			} catch (e: unknown) {
				if (e instanceof ObjectError && (e.reason === 'deleted' || e.reason === 'notFound')) {
					return reply.status(404).send(null);
				}
				request.log.error({ err: e, suifrenId }, 'Failed to render SuiFren');
				return reply.status(500).send(null);
			}
		},
	);
};
