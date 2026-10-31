# Playground agent instructions

Applies to `playground/` and its descendants, in addition to the [workspace instructions](../AGENTS.md). Commands below run from the repository root.

## Purpose and commands

`@suigar/sdk-playground` is a private Next.js integration app demonstrating the public SDK. Its `tsconfig.json` inherits `tsconfig.shared.json` and retains Next.js settings for bundler resolution, DOM libraries, and no emission. Keep the shared strict checks enabled. App-owned optional props can explicitly accept `undefined` when forwarded between components; retain the stricter types of external APIs. See its [README](README.md) for the current pages and wallet flows.

```bash
pnpm --dir playground run dev
pnpm --dir playground run build
pnpm --dir playground run typecheck
pnpm --dir playground run lint
```

## SDK integration

- Use `suigar()` on the existing client and the public `@suigar/sdk`, `@suigar/sdk/games`, and `@suigar/sdk/utils` entrypoints. Do not import SDK internals or copy transaction builders into the app.
- Standard bets go through `client.suigar.tx.createGameBet`; PvP flows use dedicated properties such as `client.suigar.tx.pvpCoinflip`.
- Prefer SDK constants and numeric helpers over copied defaults. Use `bigint` for on-chain amounts, converting human-readable stake inputs to atomic units at the UI boundary.
- Configure partner wallet attribution through `suigar({ partner })`, and pass plain application values as transaction metadata.
- Use `client.suigar.getConfig()` for supported coins and object ids, and the SDK's BCS helpers for object and event decoding.
- Preserve the app's testnet configuration. Keep code previews aligned with the current public SDK APIs, ESM requirements, explicit network selection, and `@mysten/sui/grpc` setup.
- Read the [SDK instructions](../packages/sdk/AGENTS.md) before changing SDK source to support a playground feature. Follow the relevant Suigar application skills listed in the workspace instructions.

Playground-only changes do not need a publishable-package changeset. Changes to SDK or MCP source still follow the workspace's branch changeset and documentation rules.
