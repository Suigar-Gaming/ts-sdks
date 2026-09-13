// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { Client } from '@modelcontextprotocol/client';
import {
	InMemoryTransport,
	ProtocolError,
	ProtocolErrorCode,
	type JSONRPCMessage,
} from '@modelcontextprotocol/server';
import { describe, expect, it } from 'vitest';
import {
	NFT_IMAGE_RESOURCE_DOMAINS,
	SUIGAR_MCP_APP_RESOURCE_URI,
} from '../../src/server/app-resource.js';
import { createSuigarMcpServer, serveSuigarMcpStdio } from '../../src/server/mcp-server.js';

const publicToolNames = [
	'build_coinflip_transaction',
	'build_keno_transaction',
	'build_limbo_transaction',
	'build_nft_v1_mint_transaction',
	'build_plinko_transaction',
	'build_pvp_coinflip_cancel_transaction',
	'build_pvp_coinflip_create_transaction',
	'build_pvp_coinflip_join_transaction',
	'build_range_transaction',
	'build_referral_commission_claim_transaction',
	'build_referral_level_up_usd_rewards_claim_transaction',
	'build_sweethouse_claim_own_redeem_request_after_delay_transaction',
	'build_sweethouse_deposit_transaction',
	'build_sweethouse_redeem_request_transaction',
	'build_soccer_transaction',
	'build_wheel_transaction',
	'fund_session_wallet',
	'get_referral_commission',
	'get_referral_level_up_usd_rewards',
	'get_wallet_balances',
	'list_wallet_coins',
	'get_execution_status',
	'get_session_wallet',
	'get_connection_status',
	'suigar_login',
	'suigar_logout',
	'setup_session_wallet',
	'read_config',
	'read_game_metadata',
	'list_nfts',
];

const sorted = (values: Array<string>) => [...values].sort();

describe('MCP server registration', () => {
	it('wires the root config tool, inspector tools, and app resource', () => {
		const server = createSuigarMcpServer() as unknown as {
			_registeredTools: Record<string, unknown>;
			_registeredResources: Record<string, unknown>;
		};

		expect(sorted(Object.keys(server._registeredTools))).toEqual(sorted(publicToolNames));
		expect(Object.keys(server._registeredResources)).toContain(SUIGAR_MCP_APP_RESOURCE_URI);
	});

	it('exposes all public tools through MCP tools/list', async () => {
		const server = createSuigarMcpServer();
		const client = new Client({ name: 'suigar-test', version: '0.0.0' });
		const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

		try {
			await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
			const result = await client.listTools();
			const serverVersion = client.getServerVersion();
			const serverCapabilities = client.getServerCapabilities();

			expect(sorted(result.tools.map((tool) => tool.name))).toEqual(sorted(publicToolNames));
			expect(client.getServerCapabilities()?.tools).toEqual({
				listChanged: true,
			});
			expect(serverCapabilities?.resources).toEqual({ listChanged: true });
			expect(serverVersion?.description).toContain(
				'AI agent MCP server for Suigar provably fair on-chain Sui casino game',
			);

			for (const tool of result.tools) {
				expect(tool.execution).toBeUndefined();
			}

			const readConfigTool = result.tools.find((tool) => tool.name === 'read_config');
			const readGameMetadataTool = result.tools.find((tool) => tool.name === 'read_game_metadata');
			expect(readConfigTool).toMatchObject({
				title: 'Read Suigar Config',
			});
			expect(readConfigTool?.inputSchema).toMatchObject({
				type: 'object',
				additionalProperties: false,
			});
			expect(readConfigTool?.outputSchema).toMatchObject({
				type: 'object',
			});
			expect(readGameMetadataTool).toMatchObject({
				title: 'Read Suigar Game Metadata',
			});
			expect(readGameMetadataTool?._meta).toMatchObject({
				ui: { resourceUri: SUIGAR_MCP_APP_RESOURCE_URI },
			});
			const getSessionWalletTool = result.tools.find((tool) => tool.name === 'get_session_wallet');
			expect(getSessionWalletTool).toMatchObject({
				title: 'Get Session Wallet',
				_meta: {
					ui: { resourceUri: SUIGAR_MCP_APP_RESOURCE_URI },
					'ui/resourceUri': SUIGAR_MCP_APP_RESOURCE_URI,
				},
			});
			const listNftsTool = result.tools.find((tool) => tool.name === 'list_nfts');
			expect(listNftsTool).toMatchObject({
				title: 'List Suigar NFTs',
				_meta: {
					ui: { resourceUri: SUIGAR_MCP_APP_RESOURCE_URI },
					'ui/resourceUri': SUIGAR_MCP_APP_RESOURCE_URI,
				},
			});
		} finally {
			await client.close();
			await server.close();
		}
	});

	it.each(['legacy', 'modern'] as const)(
		'serves valid calls and distinguishes errors for %s clients',
		async (era) => {
			const client = new Client(
				{ name: 'suigar-test', version: '0.0.0' },
				{
					versionNegotiation: { mode: era === 'modern' ? { pin: '2026-07-28' } : 'legacy' },
				},
			);
			const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
			const handle = serveSuigarMcpStdio(serverTransport);
			try {
				await client.connect(clientTransport);
				const config = await client.callTool({
					name: 'read_config',
					arguments: { network: 'testnet' },
				});
				expect(config.isError).not.toBe(true);
				expect(config.structuredContent).toMatchObject({ network: 'testnet' });
				expect(config.content).toEqual(
					expect.arrayContaining([expect.objectContaining({ type: 'text' })]),
				);

				const failure = await client.callTool({
					name: 'read_config',
					arguments: { config: { coins: { sui: { coinType: 'invalid' } } } },
				});
				expect(failure.isError).toBe(true);
				expect(failure.structuredContent).toMatchObject({ errors: expect.any(Array) });

				const missingTool = client.callTool({ name: 'missing_tool', arguments: {} });
				await expect(missingTool).rejects.toBeInstanceOf(ProtocolError);
				await expect(missingTool).rejects.toMatchObject({ code: ProtocolErrorCode.InvalidParams });
				const invalidInput = await client.callTool({
					name: 'read_config',
					arguments: { network: 'invalid' },
				});
				expect(invalidInput).toMatchObject({
					isError: true,
					content: [{ type: 'text', text: expect.stringContaining('network') }],
				});

				// A failed call must not poison the connection or mix inputs across concurrent calls.
				const networks = ['mainnet', 'testnet', 'mainnet', 'testnet'] as const;
				const results = await Promise.all(
					networks.map((network) =>
						client.callTool({
							name: 'read_config',
							arguments: { network },
						}),
					),
				);
				for (const [index, result] of results.entries()) {
					expect(result.isError).not.toBe(true);
					expect(result.structuredContent).toMatchObject({ network: networks[index] });
				}
			} finally {
				await client.close();
				await handle.close();
			}
		},
	);

	it('preserves app resource metadata for legacy clients', async () => {
		const server = createSuigarMcpServer();
		const client = new Client({ name: 'suigar-test', version: '0.0.0' });
		const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

		try {
			await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

			const result = await client.listResources();
			const appResource = result.resources.find(
				(resource) => resource.uri === SUIGAR_MCP_APP_RESOURCE_URI,
			);

			expect(appResource).toMatchObject({
				name: 'Suigar MCP Console',
				title: 'Suigar MCP Console',
				mimeType: 'text/html;profile=mcp-app',
				_meta: {
					ui: {
						csp: {
							connectDomains: [],
							resourceDomains: [...NFT_IMAGE_RESOURCE_DOMAINS],
						},
						prefersBorder: true,
					},
				},
			});
		} finally {
			await client.close();
			await server.close();
		}
	});
});

const modernMeta = {
	'io.modelcontextprotocol/protocolVersion': '2026-07-28',
	'io.modelcontextprotocol/clientCapabilities': {},
	'io.modelcontextprotocol/clientInfo': { name: 'suigar-test', version: '0.0.0' },
};

// Inspect wire responses without client-side normalization or an initialize handshake.
function createProtocolConnection() {
	const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
	const handle = serveSuigarMcpStdio(serverTransport);
	let requestId = 0;
	return {
		async request(
			method: string,
			params: Record<string, unknown> = {},
			meta: Record<string, unknown> = modernMeta,
		) {
			const id = ++requestId;
			const response = new Promise<JSONRPCMessage>((resolve) => {
				clientTransport.onmessage = (message) => {
					if ('id' in message && message.id === id) resolve(message);
				};
			});
			await clientTransport.send({
				jsonrpc: '2.0',
				id,
				method,
				params: { ...params, _meta: meta },
			});
			return response;
		},
		close: () => handle.close(),
	};
}

describe('MCP 2026-07-28 stdio protocol', () => {
	it('discovers the server and serves complete, cacheable results without initialization', async () => {
		const connection = createProtocolConnection();
		try {
			expect(await connection.request('server/discover')).toMatchObject({
				result: {
					resultType: 'complete',
					supportedVersions: ['2026-07-28'],
					capabilities: { tools: {}, resources: {} },
					_meta: { 'io.modelcontextprotocol/serverInfo': { name: 'suigar' } },
				},
			});
			for (const method of ['tools/list', 'resources/list', 'resources/templates/list']) {
				expect(await connection.request(method)).toMatchObject({
					result: {
						resultType: 'complete',
						ttlMs: 0,
						cacheScope: 'private',
						_meta: { 'io.modelcontextprotocol/serverInfo': { name: 'suigar' } },
					},
				});
			}
			expect(
				await connection.request('tools/call', {
					name: 'read_config',
					arguments: { network: 'testnet' },
				}),
			).toMatchObject({
				result: {
					resultType: 'complete',
					structuredContent: { network: 'testnet' },
				},
			});
			expect(await connection.request('resources/read', { uri: 'ui://missing' })).toMatchObject({
				error: { code: -32602 },
			});
		} finally {
			await connection.close();
		}
	});

	it('requires request metadata and rejects unsupported versions', async () => {
		const connection = createProtocolConnection();
		try {
			expect(
				await connection.request(
					'server/discover',
					{},
					{
						...modernMeta,
						'io.modelcontextprotocol/protocolVersion': '2099-01-01',
					},
				),
			).toMatchObject({
				error: {
					code: -32022,
					data: {
						requested: '2099-01-01',
						supported: expect.arrayContaining(['2026-07-28']),
					},
				},
			});
			expect(await connection.request('tools/list')).toHaveProperty('result');
			expect(await connection.request('tools/list', {}, {})).toMatchObject({
				error: { code: -32602 },
			});
			expect(
				await connection.request(
					'tools/list',
					{},
					{ ...modernMeta, 'io.modelcontextprotocol/protocolVersion': '2099-01-01' },
				),
			).toMatchObject({ error: { code: -32022 } });
			expect(
				await connection.request(
					'tools/list',
					{},
					{
						'io.modelcontextprotocol/protocolVersion': '2026-07-28',
					},
				),
			).toMatchObject({ error: { code: -32602 } });
			expect(await connection.request('tools/list')).toHaveProperty('result');
		} finally {
			await connection.close();
		}
	});

	it('continues to accept the legacy initialization handshake through the stdio entry', async () => {
		const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
		const handle = serveSuigarMcpStdio(serverTransport);
		const client = new Client({ name: 'legacy-test', version: '0.0.0' });
		try {
			await client.connect(clientTransport);
			expect(sorted((await client.listTools()).tools.map((tool) => tool.name))).toEqual(
				sorted(publicToolNames),
			);
		} finally {
			await client.close();
			await handle.close();
		}
	});
});
