// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { registerAppResource } from '@modelcontextprotocol/ext-apps/server';
import {
	McpServer,
	SUPPORTED_PROTOCOL_VERSIONS,
	type Transport,
} from '@modelcontextprotocol/server';
import { serveStdio, StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import { VERSION } from '../version.js';
import {
	createSuigarMcpAppResourceMeta,
	createSuigarMcpAppResourceResult,
	SUIGAR_MCP_APP_RESOURCE_URI,
} from './app-resource.js';
import { registerSuigarTools } from './tool-registration.js';

const SUPPORTED_MCP_PROTOCOL_VERSIONS = ['2026-07-28', ...SUPPORTED_PROTOCOL_VERSIONS];

export function createSuigarMcpServer(): McpServer {
	const server = new McpServer({
		name: 'suigar',
		version: VERSION,
		description:
			'AI agent MCP server for Suigar provably fair on-chain Sui casino game, SweetHouse, NFT, and referral transactions.',
	});

	registerAppResource(
		server,
		'Suigar MCP Console',
		SUIGAR_MCP_APP_RESOURCE_URI,
		{
			title: 'Suigar MCP Console',
			description:
				'Compact MCP App UI for inspecting wallet balances and coin objects, Suigar config, game metadata, SweetHouse, NFT and referral data, and transaction plans, summaries, dry-runs, and serialized bytes.',
			_meta: createSuigarMcpAppResourceMeta(),
		},
		createSuigarMcpAppResourceResult,
	);

	const APP_TOOL_META = {
		ui: {
			resourceUri: SUIGAR_MCP_APP_RESOURCE_URI,
		},
	} as const;

	registerSuigarTools({ server, appToolMeta: APP_TOOL_META });

	return server;
}

export async function startSuigarMcpServer(): Promise<void> {
	serveSuigarMcpStdio();
}

export function serveSuigarMcpStdio(transport: Transport = new StdioServerTransport()) {
	const handle = serveStdio(createSuigarMcpServer, { transport });
	const onmessage = transport.onmessage;
	transport.onmessage = (message, extra) => {
		if ('method' in message && 'id' in message) {
			const requested = message.params?._meta?.['io.modelcontextprotocol/protocolVersion'];
			if (typeof requested === 'string' && !SUPPORTED_MCP_PROTOCOL_VERSIONS.includes(requested)) {
				void transport
					.send({
						jsonrpc: '2.0',
						id: message.id,
						error: {
							code: -32022,
							message: 'Unsupported protocol version',
							data: { requested, supported: SUPPORTED_MCP_PROTOCOL_VERSIONS },
						},
					})
					.catch((error: unknown) =>
						transport.onerror?.(error instanceof Error ? error : new Error(String(error))),
					);
				return;
			}
		}
		onmessage?.(message, extra);
	};
	return handle;
}
