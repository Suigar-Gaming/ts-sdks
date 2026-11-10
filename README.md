# Suigar TypeScript SDKs

Build Suigar transactions on Sui with the TypeScript SDK or MCP server, and render Suifrens with the React display library.

## Documentation

- [Suigar SDK documentation](https://suigar.com/docs/sdk)
- [Suigar MCP documentation](https://suigar.com/docs/mcp)
- [Sui TypeScript SDK documentation](https://sdk.mystenlabs.com/)

Package guides: [SDK](packages/sdk/README.md), [MCP](packages/mcp/README.md) and [Suifrens](packages/suifrens-display-system/README.md).

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

Each public npm package includes an entry under `skills/`: `suigar-sdk`, `suigar-mcp`, or `suifrens-display-system`. Compatible agents discover these entries and fetch the full instructions and references they need from `main` in the skills repository. Agent skills are not versioned with the packages. Packing the entries needs no install hook or network access.

Suigar agent skills live in `Suigar-Gaming/agent-skills`. The MCP skill explains how to install and configure `@suigar/mcp`, read Suigar config, game metadata, NFTs and claimable referral amounts, and build and simulate unsigned transactions, including SweetHouse transactions.

Install all Suigar skills with:

```bash
npx skills add Suigar-Gaming/agent-skills --global --yes
```

Install only the MCP skill with:

```bash
npx skills add Suigar-Gaming/agent-skills --skill suigar-mcp --global --yes
```

## Packages

- `@suigar/sdk` in `packages/sdk`: ESM-only TypeScript SDK for transactions involving Suigar's provably fair casino games on Sui, SweetHouse, NFTs and referrals.
- `@suigar/mcp` in `packages/mcp`: MCP stdio server and MCP App for reading Suigar config, game metadata, NFTs, and referral claim amounts, plus building unsigned Suigar and SweetHouse transactions through the SDK.
- [`@suigar/suifrens-display-system`](packages/suifrens-display-system/README.md) in `packages/suifrens-display-system`: React components for rendering Suifrens. Its beta will be published on npm.

The SDK and MCP packages are available on [npm](https://www.npmjs.com/search?q=%40suigar) and [JSR](https://jsr.io/@suigar).

## Development

Run these commands from the repository root.

Use `turbo` when a task needs generated files or build output. It runs the prerequisite tasks first.

### Setup

Use the Node.js version specified in [`.node-version`](.node-version). GitHub Actions reads the same file through the shared pnpm setup action.

```bash
pnpm install
pnpm run build
```

Dependency install scripts are disabled by default in `pnpm-workspace.yaml`. Review any new dependency's install or build script before approving it with `pnpm approve-builds`. Transitive dependencies cannot resolve untrusted git or tarball URLs.

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

Workspace packages inherit the strict checks in `tsconfig.shared.json`. It disables `isolatedDeclarations` because generated SDK bindings lack the required annotations and MCP relies on Zod to infer schema and handler types. SDK and MCP keep the other shared strict checks.

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

Apply automatic fixes with:

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
