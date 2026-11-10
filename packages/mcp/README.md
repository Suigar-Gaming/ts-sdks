# `@suigar/mcp`

MCP server for agents working with Suigar's provably fair casino games on Sui, SweetHouse pools, NFTs, and referral claims.

- SDK-backed tools for reading Suigar config and live game metadata
- Referral claimable-amount reads and unsigned claim builders
- Unsigned transaction builders for standard Suigar games, PvP Coinflip, and SweetHouse
- `build`, `dry-run`, and `read-only` modes
- An MCP App inspector for compatible hosts
- Text and structured results for other MCP clients

Transactions are unsigned by default. With `mode: "execute"`, the paired Suigar browser wallet asks the user to approve the transaction. Selecting `executionWallet: "session"` signs and submits with the local session-wallet key stored in the operating-system keychain. Session execution returns the final transaction digest without an approval URL. Balance reads combine all result pages and format amounts using configured or on-chain coin metadata.

Malformed recovery phrases raise `TypeError`. Unsupported private-key schemes and oversized bridge requests raise `RangeError`. Wallet bridges and session setup validate 32-byte hexadecimal state tokens, then compare the decoded bytes with timing-safe equality. Setup pages display the error message. Operational failures, such as expired sessions or unavailable keychain storage, remain generic errors.

## Agent skills

The package includes [an agent skill](skills/suigar-mcp/SKILL.md) that loads full instructions from `main` in [Suigar-Gaming/agent-skills](https://github.com/Suigar-Gaming/agent-skills). It fetches references as needed.

Install the full skills with `npx skills add Suigar-Gaming/agent-skills`.

## Install

Requires Node.js `^24.0.0 || ^26.0.0`.

Install for all detected coding agents with [add-mcp](https://www.npmjs.com/package/add-mcp):

```bash
npx add-mcp @suigar/mcp@latest --name suigar
```

Add `-y` to skip the installer prompts. Restart or reload your MCP client after installation.

### Manual configuration

Add the stdio server to your MCP client:

```json
{
	"mcpServers": {
		"suigar": {
			"command": "npx",
			"args": ["-y", "@suigar/mcp@latest"]
		}
	}
}
```

### Package installation

Install the package directly when you need to import its programmatic API or run a local copy:

```bash
npm install @suigar/mcp
```

The package is also published on JSR for programmatic imports:

```bash
pnpm add jsr:@suigar/mcp
```

The server registers tools and resources through the MCP server and MCP Apps APIs. It targets MCP [`2026-07-28`](https://modelcontextprotocol.io/specification/2026-07-28). The server and bundled App use MCP SDK 2 and ext-apps 2 and support MCP Apps 1.x hosts.

Older clients that use initialization are also supported. Call `startSuigarMcpServer()` to start stdio, or `createSuigarMcpServer()` to get an `McpServer` from `@modelcontextprotocol/server` v2.

### Plugins

The package also ships `plugin/` manifests for plugin-capable hosts:

- `plugin/.codex-plugin/plugin.json` for Codex
- `plugin/.claude-plugin/plugin.json` for Claude Code
- `plugin/.cursor-plugin/plugin.json` for Cursor
- `plugin/plugin.json` for Antigravity-style plugin discovery

The Codex, Claude, and Cursor manifests use the bundled `.mcp.json` MCP config, which registers the `npx -y @suigar/mcp@<package-version>` stdio server. `packages/mcp/package.json` supplies the version for plugin manifests, the MCP config package specifier and package-local JSR configs. Run `pnpm run codegen:version` to sync them; `pnpm run changeset:version` also runs it.

Repository marketplace catalogs support GitHub installation and local plugin testing:

- `.agents/plugins/marketplace.json` for ChatGPT desktop and Codex
- `.claude-plugin/marketplace.json` for Claude Code
- `.cursor-plugin/marketplace.json` for Cursor multi-plugin repository discovery

For Codex, install the marketplace from GitHub, then install the `suigar-mcp` plugin:

```bash
codex plugin marketplace add Suigar-Gaming/ts-sdks
codex plugin add suigar-mcp@suigar
```

For Claude Code, use the equivalent GitHub marketplace flow:

```bash
claude plugin marketplace add Suigar-Gaming/ts-sdks
claude plugin install suigar-mcp@suigar
```

Inside an interactive Claude Code session, use `/plugin marketplace add Suigar-Gaming/ts-sdks` and `/plugin install suigar-mcp@suigar` instead. For local development, replace `Suigar-Gaming/ts-sdks` with `.` in either marketplace-add command. ChatGPT desktop local testing works by opening the repository, restarting the app, opening the Plugins directory in Work mode or Codex, then installing `suigar-mcp` from the `Suigar` source.

For Cursor, the repository includes both the plugin manifest and a root `.cursor-plugin/marketplace.json` for multi-plugin repository flows. During local development, you can also copy or symlink `packages/mcp/plugin` into Cursor's local plugin directory and reload Cursor. If you only need MCP tools, configure `npx -y @suigar/mcp` directly. You do not need a plugin wrapper.

### Local development

The package uses the shared strict TypeScript checks with `isolatedDeclarations` disabled so Zod can infer schema and handler types. Run these commands from the repository root.

```bash
pnpm turbo run build --filter=@suigar/mcp
node packages/mcp/dist/bin.mjs
```

This builds the local workspace dependencies, MCP server, and bundled MCP App. Run the generated stdio entrypoint from the repository root for manual client testing.

## Tools

- `setup_session_wallet`
- `get_session_wallet`
- `fund_session_wallet`
- `suigar_login`
- `suigar_logout`
- `get_connection_status`
- `read_config`
- `read_game_metadata`
- `list_nfts`
- `get_wallet_balances`
- `list_wallet_coins`
- `get_execution_status`
- `get_referral_commission`
- `get_referral_level_up_usd_rewards`
- `build_referral_commission_claim_transaction`
- `build_referral_level_up_usd_rewards_claim_transaction`
- `build_nft_v1_mint_transaction`
- `build_sweethouse_deposit_transaction`
- `build_sweethouse_redeem_request_transaction`
- `build_sweethouse_claim_own_redeem_request_after_delay_transaction`
- `build_coinflip_transaction`
- `build_keno_transaction`
- `build_limbo_transaction`
- `build_plinko_transaction`
- `build_soccer_transaction`
- `build_wheel_transaction`
- `build_range_transaction`
- `build_pvp_coinflip_create_transaction`
- `build_pvp_coinflip_join_transaction`
- `build_pvp_coinflip_cancel_transaction`

All tools return text in `content` alongside `structuredContent`. Known tools return `isError: true` for invalid inputs and handler failures. Handler errors include text and structured details. An unknown tool name raises a JSON-RPC invalid-params error (`-32602`).

Hosts that support MCP Apps can display config, live game parameters, the NFT catalog and wallet holdings, referral rewards, SweetHouse plans, and transaction details in the bundled App.

### Wallet tools

- Paired browser wallet
  - `suigar_login`, `suigar_logout`, and `get_connection_status` manage the paired browser wallet.
  - `suigar_login` and `suigar_logout` start the same local `npx -y @suigar/mcp ...` CLI flows used for command-line wallet management, so the pairing page for mainnet or testnet opens in the default browser without copying and pasting a URL.
  - `suigar_login` and `suigar_logout` accept `webUrl`, `timeoutMs`, `maxBodyBytes`, `open`, and `noOpen` inputs matching the CLI bridge options.
  - `get_wallet_balances` and `list_wallet_coins` read aggregate balances or paginated coin objects. Both also accept an explicit address.
  - `get_execution_status` checks an `execute`-mode transaction's browser approval result.
- Local session wallet
  - `setup_session_wallet` opens a local, one-time setup page to create or recover one persistent session wallet shared by mainnet and testnet.
  - Set `SUIGAR_MCP_SESSION_SETUP_TIMEOUT_MS` to control how long local setup pages remain available. The built-in default is `600000`.
  - It does not require a paired browser wallet, and its recovery phrase never passes through MCP.
  - The local setup page can also import a standard `suiprivkey...` export. It never passes through MCP or the session-wallet JSON file.
  - Store the signing key in the operating-system keychain without a separate application passphrase. Do not use custom encrypted files. Use a dedicated wallet with a small balance to limit the funds the session can spend.
  - MCP keeps one active session wallet. Restarting MCP automatically uses that same keychain entry; importing or recovering another wallet requires explicit replacement confirmation. Keep the original recovery phrase/private-key backup to restore it later.
  - `get_session_wallet` returns the public address, formatted balances, and a funding QR code. If a wallet is paired on the selected network, it also returns a prefilled funding URL.
  - `fund_session_wallet` requires a paired wallet and opens a prefilled mcp-website transfer form. The user chooses an owned coin and amount, then reviews and signs the transfer in their browser.
  - In an App-capable host, it displays a dedicated Session Wallet view with balances for the selected network, a funding QR code, and a paired-wallet funding link when available. If no wallet exists, the same view provides the local setup link.
  - Fund only the amount the user is willing to delegate to the local MCP process.
  - For game tools, use `mode: "execute", executionWallet: "session"` to make the session wallet the sender and submit immediately. `owner` is optional in this mode; if supplied, it must match the session-wallet address. Fund it for both the wager and gas. You can set a custom provider URL and partner; custom SDK config overrides are rejected. Before signing, the server verifies that the built transaction calls only the selected Suigar game package.
- Command-line wallet management
  - Run `npx -y @suigar/mcp login --network testnet` (or `mainnet`), `status`, `logout`, or `clean`.
  - Login uses a short-lived, localhost-only browser pairing flow and stores non-secret network-specific metadata in `~/.suigar-mcp/credentials.json` with owner-only permissions.
  - `status` shows the current connection. `logout --all` disconnects every stored network and opens both logout pages when using the default Suigar mainnet and testnet web origins. `clean` deletes the local credential file without opening a browser.
  - Set `SUIGAR_MCP_BRIDGE_WEB_URL` or pass `--web-url` to use a local or custom connection-page origin.
  - Set `SUIGAR_MCP_BRIDGE_TIMEOUT_MS` or pass `--timeout-ms` to control how long login, logout, and approval bridges wait before expiring. The default is `300000`.
  - Set `SUIGAR_MCP_BRIDGE_MAX_BODY_BYTES` or pass `--max-body-bytes` to control the maximum browser callback JSON body size. The default is `16384`.
  - Bridge URLs open automatically by default. Pass `--no-open` for CLI login or logout when you only want the URL or URLs printed.
  - The MCP client discovers tools through the protocol.

### Read tools

- `read_config`, `read_game_metadata`, `list_nfts`, wallet balance/coin reads, execution status, and the referral amount reads are read-only.
- SDK-backed reads accept shared network, provider, SDK config, and partner inputs.
- `read_game_metadata` also requires `game`. NFT and referral reads also require an `owner` address or SuiNS name.
- Referral reads simulate the SDK's real claim transaction and return `0` when it cannot be claimed or simulated.
- `get_referral_commission` accepts an optional `coinType` (defaulting to configured SUI); level-up USD rewards use configured USDC.

In hosts that support Apps, the NFT view has separate tables for the catalog and owned NFTs. It shows HTTPS NFT images as thumbnails and keeps unavailable or unsupported image URLs as text. Referral reads open a Referral Rewards view showing the referrer, reward type, coin type and simulated claimable amount.

### Transaction tools

All transaction tools accept the shared config inputs and support these `mode` values:

- `read-only`: resolves SDK config and returns the intended Move target, type arguments, required inputs, and notes.
- `build`: returns unsigned transaction bytes as base64 plus a transaction summary with resolved shared inputs and game-specific `gameInputs` such as coinflip `side`, Keno `configId` and `picks`, limbo `targetMultiplier`, plinko/wheel `configId`, and range points.
- `dry-run`: simulates the unsigned transaction through Mysten client APIs and returns a JSON-safe raw `dryRun` result plus a stable `dryRunSummary`. Failed dry-runs include an `errors` array extracted from the failed transaction status.
- `execute`: by default opens a paired-wallet approval request. Set `executionWallet: "session"` for game tools to have MCP sign and execute immediately with the local session wallet instead.

Transaction summaries include the configured gas budget as raw MIST plus a SUI display value when `gasBudget` is provided or present on the built transaction.

Dry-run summaries include:

- `success` and `error`
- Gas computation, storage, rebate, non-refundable storage fee, and net gas delta as raw base units plus decimal-formatted display values
- Balance changes as raw base units plus decimal-formatted display values
- Decoded event fields when available, including standard `BetResultEvent` game details such as `player_bet`, `coin_outcome`, `stake_amount`, and `outcome_amount`; the MCP App renders all parsed result fields it receives, so non-coinflip games expose their own parsed result keys as well

### Shared transaction inputs

For `build`, `dry-run`, and paired-wallet `execute`, provide `owner`, a raw Sui address, SuiNS name such as `name.sui`, or SuiNS subname such as `sub.name.sui`. The server resolves SuiNS owners through the configured network before building or dry-running the unsigned transaction. In session execution (`mode: "execute", executionWallet: "session"`), MCP uses the local session-wallet address and no owner is required. `read-only` can be used to inspect a tool's requirements before providing an owner.

`coinType` defaults to configured SUI. Transaction `stake`, `cashStake`, and SweetHouse `amount` inputs are currency amounts in the chosen coin, not base-unit integers. For example, `stake: 1` or `amount: 1` means `1` SUI or `1` USDC depending on the resolved coin type. The server converts these amounts to base units using the configured coin `decimals` before calling the SDK transaction builders.

Set the optional `gasBudget` in MIST. Bet builders also accept `metadata`. Use JSON-compatible strings, numbers, or booleans for metadata values and send large integers as strings. Tools that source native SUI coins, including native SUI bets and NFT V1 mint, accept `useGasCoin`. PvP Coinflip cancel neither creates a bet coin nor writes metadata, so it accepts neither `metadata` nor `useGasCoin`.

When `betCount` is provided for Keno, Limbo, Plinko, Range, Soccer, or Wheel, the MCP server reads the active on-chain parameters and rejects a value above that game's declared maximum. Coinflip does not declare a maximum bet count.

### Workflow-specific inputs

| Workflow | Required inputs | Optional inputs | Notes |
| --- | --- | --- | --- |
| Coinflip | `side` | None |  |
| Keno | `configId`, `picks` | None | `picks` is an array of board positions. |
| Limbo | `targetMultiplier` | None |  |
| Plinko, Wheel | `configId` | None |  |
| Soccer | `configId`, `countryId`, `shotZoneId` | None |  |
| Range | `leftPoint`, `rightPoint` | `outOfRange` |  |
| PvP Coinflip Create | `creatorSide` | `isPrivate` |  |
| PvP Coinflip Join | `gameId` | None | Reads the game's stake when building the transaction. |
| PvP Coinflip Cancel | `gameId` | None | Does not accept `metadata` or `useGasCoin`. |
| Referral Commission Claim | `owner` | `coinType` | `coinType` defaults to configured SUI. |
| Referral Level-up USD Rewards Claim | `owner` | None | Uses configured USDC. |
| NFT V1 Mint | `owner`, `specId` | `useGasCoin` | Resolves the specification's SUI price from the configured NFT factory when built. |
| SweetHouse Deposit | `owner`, `amount` | `coinType`, `useGasCoin` | Deposits into the public pool and returns staked coins to `owner`. |
| SweetHouse Redeem Request | `owner`, `amount` | `coinType` | Spends staked coins from `owner` and creates a redeem request. |
| SweetHouse Delayed Redeem Claim | `owner`, `requestId` | `coinType` | Must be signed by the address that created the redeem request. |

## Config

`network` defaults to `testnet`. Only `mainnet` and `testnet` are supported.

Before forwarding config overrides to the SDK, the server skips nested fields set to `undefined` and keeps concrete values, including zero.

Optional `config` input follows the public SDK extension override shape:

```ts
{
	packageIds?: {
		nftV1?: string;
		core?: string;
		referral?: string;
		coinflip?: string;
		keno?: string;
		limbo?: string;
		plinko?: string;
		pvpCoinflip?: string;
		range?: string;
		soccer?: string;
		wheel?: string;
	};
	objectIds?: {
		sweetHouse?: string;
		nftV1Factory?: string;
	};
	coins?: {
		sui?: { coinType?: string; decimals?: number; priceInfoObjectId?: string };
		usdc?: { coinType?: string; decimals?: number; priceInfoObjectId?: string };
	};
}
```

Game, referral, and core calls use the `@suigar/*` MVR package names by default. Optional `packageIds` entries override those package names when needed; `nftV1` remains configured by network because it is not resolved from MVR.

Pass the partner wallet address as the top-level `partner` option. The server forwards it through `suigar({ partner })`.
