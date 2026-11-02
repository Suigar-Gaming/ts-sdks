# Suigar TypeScript SDKs

Use the TypeScript SDK and MCP server to interact with Suigar contracts on Sui.

## Documentation

- [Suigar SDK documentation](https://suigar.com/docs/sdk)
- [Suigar MCP documentation](https://suigar.com/docs/mcp)
- [Sui TypeScript SDK documentation](https://sdk.mystenlabs.com/)

See also the local [SDK](packages/sdk/README.md) and [MCP](packages/mcp/README.md) guides.

## Install the MCP server

Install Suigar MCP for all detected coding agents with [add-mcp](https://www.npmjs.com/package/add-mcp):

```bash
npx add-mcp @suigar/mcp@latest --name suigar
```

Add `-y` to skip the installer prompts. Restart or reload your MCP client after installation.

To configure an MCP client manually, use:

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

## Agent skills

The `Suigar-Gaming/agent-skills` repository contains the Suigar agent skills. The MCP skill covers installation and configuration of `@suigar/mcp`. It explains how to read Suigar config, game metadata, NFTs, and claimable referral amounts, and how to build and simulate unsigned transactions, including SweetHouse transactions.

Install all Suigar skills with:

```bash
npx skills add Suigar-Gaming/agent-skills --global --yes
```

Install only the MCP skill with:

```bash
npx skills add Suigar-Gaming/agent-skills --skill suigar-mcp --global --yes
```

## Packages

- `@suigar/sdk` in `packages/sdk`: ESM-only TypeScript SDK for Suigar provably fair on-chain Sui casino game, SweetHouse, NFT, and referral transactions.
- `@suigar/mcp` in `packages/mcp`: MCP stdio server and MCP App for reading Suigar config, game metadata, NFTs, and referral claim amounts, plus building unsigned Suigar and SweetHouse transactions through the SDK.

Both packages are available on [npm](https://www.npmjs.com/search?q=%40suigar) and [JSR](https://jsr.io/@suigar).

## Development

Run these commands from the repository root.

Use `turbo` when a task needs generated files or build output. It runs the prerequisite tasks first.

### Setup

Use the Node.js version specified in [`.node-version`](.node-version). GitHub Actions reads the same file through the shared pnpm setup action.

```bash
pnpm install
pnpm run build
```

Dependency install scripts are disabled by default in `pnpm-workspace.yaml`. If a new dependency needs an install or build script, explicitly review it before approving it with `pnpm approve-builds`. Transitive dependencies are also blocked from resolving untrusted git or tarball URLs.

### Building

```bash
pnpm run build
# or
pnpm turbo run build
```

### Unit tests

```bash
pnpm run test
# or
pnpm turbo run test
```

### Type checking

Workspace packages inherit the strict checks in `tsconfig.shared.json`. This shared configuration disables `isolatedDeclarations` because the generated SDK bindings lack the required annotations and the MCP relies on Zod schema/handler inference. Both packages retain the other shared strict checks.

```bash
pnpm run typecheck
# or
pnpm turbo run typecheck
```

### Linting

This repo uses Oxlint and Oxfmt for linting and formatting.

```bash
pnpm run lint
```

To apply automatic fixes, run the following command.

```bash
pnpm run lint:fix
```

To run Oxlint and Oxfmt individually, use:

```bash
pnpm run oxlint
pnpm run oxfmt
pnpm run oxlint:fix
pnpm run oxfmt:fix
```
