// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { FastifyPluginAsync } from 'fastify';
import { renderToStaticMarkup } from 'react-dom/server';
import Type from 'typebox';
import { accessories as suiFrensAccessories } from '@suigar/suifrens-display-system/accessories';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import { SuiLogo } from '../../components/logos/SuiLogo.js';

export const accessories: FastifyPluginAsync = async (fastify) => {
	fastify.withTypeProvider<TypeBoxTypeProvider>().get(
		'/accessories/:name/svg',
		{
			schema: {
				params: Type.Object({
					name: Type.String(),
				}),
				response: {
					200: Type.String(),
					404: Type.Null(),
					500: Type.Null(),
				},
			},
		},
		async (request, reply) => {
			const accessoryName = request.params.name;
			const accessory = suiFrensAccessories.find((accessory) => accessory.name === accessoryName);

			if (!accessory) {
				return reply.status(404).send(null);
			}

			const renderedSvg = renderToStaticMarkup(
				<SuiFrenImageInline
					attributes={{
						mainColor: 'FFFFFF',
						secondaryColor: 'FFFFFF',
						expression: 'bigSmile',
						skin: 'basic',
						earShape: 'default',
					}}
					accessories={[accessory]}
					logo={<SuiLogo />}
					shadow
					incognito
				/>,
			);
			reply.header('Content-Type', 'image/svg+xml');
			return reply.send(renderedSvg);
		},
	);
};
