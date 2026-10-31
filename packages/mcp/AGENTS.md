# MCP agent instructions

Applies to `packages/mcp/` and its descendants, in addition to the [workspace instructions](../../AGENTS.md). Commands below run from the repository root. Source paths below are repository-relative.

## Package structure and commands

`@suigar/mcp` is an ESM-only stdio MCP server with a bundled inspector App. Package output is built with `tsdown`; Vite produces the single-file App under `packages/mcp/dist/`.

- `packages/mcp/src/server/`: server construction, tool registration, and App resource registration.
- `packages/mcp/src/tools/handlers/`: SDK-backed tool handlers.
- `packages/mcp/src/tools/schemas/`: tool input and output schemas.
- `packages/mcp/src/runtime/`: SDK client setup and transaction runtime support.
- `packages/mcp/src/wallet/`: wallet bridges and session setup.
- `packages/mcp/src/app/`: inspector UI.

```bash
# Build the SDK dependency, server, and bundled App
pnpm turbo run build --filter=@suigar/mcp
# Run the built stdio server for manual testing
node packages/mcp/dist/bin.mjs
# Validation
pnpm --dir packages/mcp run test
pnpm --dir packages/mcp run typecheck
pnpm --dir packages/mcp run lint
```

## Architecture and protocol invariants

`packages/mcp` exposes a local stdio MCP server plus a bundled MCP App resource. It should stay thin over `@suigar/sdk` and `@mysten/sui`.

- Use ext-apps 2 with MCP SDK 2: `@modelcontextprotocol/server`, `@modelcontextprotocol/server/stdio`, and `@modelcontextprotocol/client`. Prefer shared types, errors, and transports exported by `@modelcontextprotocol/server`; reserve `@modelcontextprotocol/client` for client-specific APIs. The client package is a development dependency for tests and the bundled App build; core is supplied transitively by the SDK packages. Use the published ext-apps React types. Register tools with complete Standard JSON Schema schemas (such as Zod objects) and preserve schema/handler type inference.
- Target MCP 2026-07-28 and use SDK 2 `serveStdio` for stdio version negotiation, retaining legacy initialization compatibility. Let the SDK validate request metadata and supply discovery, result discriminators, server identity, and cache hints. Keep tool listings deterministic and application state explicit in tool arguments. Test modern wire responses as well as legacy clients.
- Unknown tool calls reject with a protocol invalid-params error; schema-validation failures return `isError: true`. Keep Suigar handler failures actionable with both text and structured error details.
- Always return both text `content` and `structuredContent`.
- Keep tool errors actionable and include the field/config/network detail needed for an agent to retry.
- Keep SDK-style MCP config documentation aligned with `SuigarConfigOverrides`: both `coins.sui` and `coins.usdc` accept optional `coinType`, `decimals`, and `priceInfoObjectId` metadata.
- Merge partial MCP App host-context updates with the existing context and apply host-provided safe-area insets to every inspector screen.
- Wallet bridge and session setup state comparisons use `sameState()` from `packages/mcp/src/utils/crypto.ts`; keep hex decoding and strict 32-byte state validation in that shared helper.
- The MCP App is an inspector UI only. It must not sign or execute transactions, and it should include restrictive `_meta.ui.csp` metadata.
- Do not reintroduce explicit coin object sourcing or copied transaction builders unless the SDK adds a public API for that behavior.
- If a new MCP behavior requires an SDK change, add the SDK change, tests, docs, and an `@suigar/sdk` changeset entry in the same task.
- Build transactions through `client.suigar.tx`, inspect configuration through `client.suigar.getConfig()`, and avoid imports from private Suigar workspace packages.

## Tests and cross-package changes

- The shared configuration disables `isolatedDeclarations` to preserve schema/handler inference for Zod tools and avoid declaration-only annotations throughout the inspector App, tests, and build configuration. Keep the remaining shared strict checks enabled, including `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, and `noPropertyAccessFromIndexSignature`.
- Normalize absent optional tool config fields before forwarding nested configuration overrides to the SDK; do not widen SDK config validation or use casts to bypass schema/handler types.
- Keep tests in `packages/mcp/test/`, grouped into `tools/handlers/`, `tools/schemas/`, `runtime/`, `server/`, `wallet/`, `app/`, and `utils/`, with CLI and package-export coverage alongside them.
- Wallet bridge tests may use local loopback servers and temporary storage; keep tests independent of live networks and real wallet credentials.
- Follow the shared Vitest mock-reset, async assertion, regression coverage, and validation rules in the workspace instructions.
- If MCP behavior needs an SDK change, read the [SDK instructions](../sdk/AGENTS.md), update the SDK, its tests and docs, and cover both publishable packages with changesets, separating their notes when the changes differ as required by the workspace conventions.

Follow the workspace release, documentation, and PR rules. Review the `suigar-mcp` skill in `Suigar-Gaming/agent-skills` when installation, configuration, tool usage, or App guidance changes.
