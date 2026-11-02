# SDK agent instructions

Applies to `packages/sdk/` and its descendants, in addition to the [workspace instructions](../../AGENTS.md). Commands below run from the repository root. Source paths below are repository-relative.

## Package and build

`@suigar/sdk` is an ESM-only TypeScript SDK for Suigar v2 on Sui. Its primary integration surface is `suigar()` on a `ClientWithCoreApi`, such as `SuiGrpcClient`. `tsdown` emits ESM into `packages/sdk/dist/`; `sui-ts-codegen generate` regenerates `packages/sdk/src/contracts/`. Generated bindings are runtime-critical and must stay aligned with the current Suigar packages. Do not hand-edit generated contract files.

```bash
# Regenerate contract bindings and build
pnpm --dir packages/sdk run build
# Build without regeneration
pnpm --dir packages/sdk run build:ci
# Regenerate bindings only
pnpm --dir packages/sdk run codegen
# Validation
pnpm --dir packages/sdk run test
pnpm --dir packages/sdk run typecheck
pnpm --dir packages/sdk exec tsc --noEmit -p test/tsconfig.json
pnpm --dir packages/sdk run lint
# Focused tests
pnpm --dir packages/sdk exec vitest run test/unit/transactions/coinflip.test.ts
pnpm --dir packages/sdk exec vitest run -t "builds a coinflip transaction with a configured package override"
```

## Public API and implementation patterns

1. **Client extension first**: Prefer integrating through `suigar()` on an existing client such as `SuiGrpcClient` or any other `ClientWithCoreApi` implementation instead of bypassing the extension layer.
2. **Public package exports**: The package exposes `@suigar/sdk`, `@suigar/sdk/games`, and `@suigar/sdk/utils`. The package root exports `suigar`, `SuigarClient`, `SUPPORTED_SUI_NETWORKS`, `SuigarNetwork`, and `SuigarCoin`. Game-related public types and constants such as `GAMES`, `Game`, `StandardGame`, `PvPGame`, `CoinSide`, and `PvPCoinflipAction` should prefer `@suigar/sdk/games`, and parser or helper utilities should prefer `@suigar/sdk/utils`. Reusable SDK constants such as `DEFAULT_GAS_BUDGET_MIST`, `DEFAULT_QUERY_LIMIT`, `RANGE_POINT_LIMIT`, `DEFAULT_RANGE_SCALE`, and `DEFAULT_LIMBO_MULTIPLIER_SCALE` are part of the intended `@suigar/sdk/utils` integration surface and should not be redefined in app code when the SDK export is suitable. `DEFAULT_QUERY_LIMIT` is `50`, the reusable default page size for SDK queries; `getPvPCoinflipGames()` currently uses it when called without options. Utility function behavior:
   - `toBigInt()` accepts `bigint`, finite `number`, non-negative integer `string`, and `boolean` values. It throws `TypeError` for invalid input shapes and `RangeError` for negatives.
   - `toU8()` accepts a finite integer `number` or plain integer `string` in the `0..255` range. It throws `TypeError` for non-numeric input and `RangeError` for non-integer or out-of-range values.
   - `toU16()` accepts a finite integer `number` or plain integer `string` in the `0..65535` range. It uses the same `TypeError` and `RangeError` split as `toU8()`.
   - `parseCoinType()` throws `TypeError` when the first generic coin type cannot be parsed from the Move type string.
3. **Transaction builders by game family**: Standard games use `createGameBet`; PvP games use dedicated game properties such as `pvpCoinflip`, each with its own action builders. Unsupported game ids and unsupported configured coin types surface as `RangeError`s.
4. **Generated contract wrappers**: `packages/sdk/src/transactions/` adapts app-facing options into generated Move calls from `packages/sdk/src/contracts/`.
5. **Type safety**: All game flows are strongly typed through `CreateGameBetOptions`, action-specific PvP options, and normalized config helpers.

## Client architecture

The SDK is organized around a client extension plus typed transaction builders. Understanding that separation is important before changing behavior.

### Layered Design

The integration has three practical layers:

1. **Public SDK surface** - `suigar()` and `SuigarClient` exposed from the package root, with additional public subpaths for `games` and `utils`.
2. **Client extension implementation** - `packages/sdk/src/client.ts` registers the extension on top of a `ClientWithCoreApi` and exposes serialization, BCS helpers, and transaction builders.
3. **Transaction and contract layer** - `packages/sdk/src/transactions/` consumes network-resolved config, normalizes user input, and invokes generated Move wrappers from `packages/sdk/src/contracts/`.

Key files:

| Layer                       | File                                 |
| --------------------------- | ------------------------------------ |
| Public entrypoint           | `packages/sdk/src/index.ts`          |
| Extension and client API    | `packages/sdk/src/client.ts`         |
| Standard game builders      | `packages/sdk/src/transactions/*.ts` |
| Generated contracts and BCS | `packages/sdk/src/contracts/**`      |
| Public utility exports      | `packages/sdk/src/utils/*.ts`        |
| Internal helper modules     | `packages/sdk/src/helpers/*.ts`      |

### Standard vs PvP Flows

There are two transaction families and they must not be mixed:

- **Standard games** use `client.suigar.tx.createGameBet({ game, ...options })` for `coinflip`, `keno`, `limbo`, `plinko`, `range`, `soccer`, and `wheel`.
- **PvP games** use dedicated per-game transaction properties, such as `client.suigar.tx.pvpCoinflip`, and should keep PvP game rules separate from standard game flows.
- **PvP Coinflip unresolved lobby lookups** use `client.suigar.getPvPCoinflipGames(options?)`:
  - Calling it without options uses `DEFAULT_QUERY_LIMIT` (`50`); supply `limit: DEFAULT_QUERY_LIMIT` when also passing `cursor` or another query option.
  - Bulk-load lobby objects with `client.core.getObjects()`.
  - Skip per-object fetch or parse failures by default.
  - Reject on per-object fetch or parse failures only when `throwOnError: true` is passed.
  - Return each parsed game with a derived `coin_type` string from the Move object type.
- **Specific PvP Coinflip game object lookups** should use the exported generated helper, `client.suigar.bcs.PvPCoinflipGame.get({ client, objectId })`, when a product needs one live game object outside the registry list.

When making changes:

- Read both the client entrypoint and the relevant transaction builder before changing behavior.
- Keep standard and PvP option shapes separate.
- Do not route PvP Coinflip through the standard game builder.

### Config Resolution

Config is normalized in `packages/sdk/src/helpers/config.ts`. This layer is responsible for:

- Resolving the network-scoped NFT V1 package id and optional MVR package overrides
- Normalizing the configured supported coin types for the active network
- Resolving price info object ids from the supported-coin mapping
- Throwing explicit errors when a required coin mapping is missing
- Providing the price info object id used by PvP Coinflip join

Treat unsupported network resolution and unsupported configured coin types as `RangeError` cases when documenting or testing these flows.

Invalid configuration or missing price-info object IDs throw `TypeError`. Operational failures retain `Error`. Keep generated error classes aligned with `@mysten/codegen`.

### Game Parameters

`client.suigar.getGameParameters({ game, coinType, ...options })` requires a coin type. It reads the selected game's settings object from SweetHouse, then that coin's `Parameters<T>` object. It parses the result, decodes Move float fields into JavaScript numbers—including nested Keno, Plinko, and Wheel multipliers—and caches it for `cacheTtl`.

This is a core invariant: standard game transactions must fail clearly when the required price info object configuration is not available for the chosen coin type.

### Referral

- `client.suigar.tx.referral` uses `@suigar/referral` by default, or `packageIds.referral` when an override is configured.
- Use `client.suigar.view.referral` for simulated claimable amounts.

### NFT V1

- Use `packageIds.nftV1` and `objectIds.nftV1Factory` for lookups.
- Use `client.suigar.tx.nftV1.mint({ owner, specId })` to mint.
- Read the selected specification's SUI price from the configured factory when the transaction is built.

### Metadata and Amount Handling

- Treat `stake` as the logical wager used in the Move call.
- Use `cashStake` only when the withdrawn balance should differ from the logical stake.
- Prefer `bigint` for all non-UI amount handling.
- Pass plain application values to supported bet transaction `metadata` and let the SDK encode them into byte arrays.
- Treat the extension-level `partner` option as a partner wallet address, not a label or slug.
- When partner attribution is required, configure `suigar({ partner: '<wallet-address>' })` once during extension setup instead of passing partner data through transaction metadata.
- Prefer importing public constants and numeric helpers from `@suigar/sdk/utils` instead of duplicating SDK defaults in downstream apps.

## TypeScript and tests

- The shared configuration disables `isolatedDeclarations` because the current Move code generator does not emit compatible annotations. Keep all other shared strict checks enabled; do not edit `src/contracts` to fix declaration-isolation diagnostics.
- SDK-owned optional value options, including `config`, `partner`, `cacheTtl`, and transaction fields, accept explicit `undefined` (`field?: T | undefined`). Forward those values directly internally; use `optionalOptions` only for stricter external Sui or generated-binding APIs. Preserve the generic inference of the extension `name`. Do not widen nested config override values validated as concrete configuration.
- SDK source and tests must pass `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`.
- Keep tests in `packages/sdk/test/unit/`, grouped into `transactions/`, `helpers/`, and `utils/`, with client and public-export coverage alongside them. Reuse nearby fixtures and helpers.
- Run the additional test-project typecheck whenever SDK tests change; the main package typecheck excludes tests.

Follow the workspace release, documentation, and PR rules. SDK source changes require an `@suigar/sdk` entry in a branch changeset scoped to the relevant topic, with the release level matching any public type or behavior changes.
