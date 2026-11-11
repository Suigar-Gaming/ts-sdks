# SDK agent instructions

Applies to `packages/sdk/` and its descendants, in addition to the [workspace instructions](../../AGENTS.md). Commands below run from the repository root. Source paths below are repository-relative.

## Package and build

`@suigar/sdk` is an ESM-only TypeScript SDK for Suigar v2 on Sui. Use `suigar()` on a `ClientWithCoreApi`, such as `SuiGrpcClient`, as the main integration point. `tsdown` emits ESM into `packages/sdk/dist/`; `sui-ts-codegen generate` regenerates `packages/sdk/src/contracts/`. Runtime code depends on the generated bindings, so keep them in sync with the current Suigar packages. Do not hand-edit generated contract files.

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
pnpm --dir packages/sdk exec tsc -p test/tsconfig.json
pnpm --dir packages/sdk run lint
# Focused tests
pnpm --dir packages/sdk exec vitest run test/unit/transactions/coinflip.test.ts
pnpm --dir packages/sdk exec vitest run -t "builds a coinflip transaction with a configured package override"
```

## Public API and implementation patterns

1. Integrate through `suigar()` on an existing `SuiGrpcClient` or another `ClientWithCoreApi` implementation.
2. The package exposes `@suigar/sdk`, `@suigar/sdk/games`, and `@suigar/sdk/utils`. The package root exports `suigar`, `SuigarClient`, `SUIGAR_COINS`, `SUPPORTED_SUI_NETWORKS`, `SuigarNetwork`, and `SuigarCoin`. Derive supported coin iteration from `SUIGAR_COINS`; `SuigarCoin` is its element type. For game-related public types and constants such as `COIN_SIDES`, `PVP_COINFLIP_ACTIONS`, `GAMES`, `Game`, `StandardGame`, `PvPGame`, `CoinSide`, and `PvPCoinflipAction`, prefer `@suigar/sdk/games`. Prefer importing parser and helper utilities from `@suigar/sdk/utils`. Reusable SDK constants such as `DEFAULT_GAS_BUDGET_MIST`, `DEFAULT_QUERY_LIMIT`, `RANGE_POINT_LIMIT`, `DEFAULT_RANGE_SCALE`, and `DEFAULT_LIMBO_MULTIPLIER_SCALE` are available from `@suigar/sdk/utils`. Reuse them in app code when they fit. `DEFAULT_QUERY_LIMIT` is `50`, the reusable default page size for SDK queries; `getPvPCoinflipGames()` currently uses it when called without options. Utility function behavior:
   - `toBigInt()` accepts `bigint`, finite `number`, non-negative integer `string`, and `boolean` values. It throws `TypeError` for invalid input shapes and `RangeError` for negatives.
   - `toU8()` accepts a finite integer `number` or plain integer `string` in the `0..255` range. It throws `TypeError` for non-numeric input and `RangeError` for non-integer or out-of-range values.
   - `toU16()` accepts a finite integer `number` or plain integer `string` in the `0..65535` range. It uses the same `TypeError` and `RangeError` split as `toU8()`.
   - `parseCoinType()` throws `TypeError` when the first generic coin type cannot be parsed from the Move type string.
3. Standard games use `createGameBet`; PvP games use dedicated game properties such as `pvpCoinflip`, each with its own action builders. Raise `RangeError`s for unsupported game ids or unsupported configured coin types.
4. `packages/sdk/src/transactions/` converts app-facing options into generated Move calls from `packages/sdk/src/contracts/`.
5. Keep all game flows typed through `CreateGameBetOptions`, action-specific PvP options, and normalized config helpers.

## Client architecture

Read the client extension and affected transaction builder before changing behavior.

### Layers

1. Public SDK API: `suigar()` and `SuigarClient` exposed from the package root, with additional public subpaths for `games` and `utils`.
2. Client extension: `packages/sdk/src/client.ts` registers the extension on top of a `ClientWithCoreApi` and exposes serialization, BCS helpers, and transaction builders.
3. Transactions and contracts: `packages/sdk/src/transactions/` consumes network-resolved config, normalizes user input, and invokes generated Move wrappers from `packages/sdk/src/contracts/`.

Source files:

| Layer                       | File                                 |
| --------------------------- | ------------------------------------ |
| Public entrypoint           | `packages/sdk/src/index.ts`          |
| Extension and client API    | `packages/sdk/src/client.ts`         |
| Standard game builders      | `packages/sdk/src/transactions/*.ts` |
| Generated contracts and BCS | `packages/sdk/src/contracts/**`      |
| Public utility exports      | `packages/sdk/src/utils/*.ts`        |
| Internal helper modules     | `packages/sdk/src/helpers/*.ts`      |

### Standard and PvP flows

Keep the two transaction families separate:

- Standard games use `client.suigar.tx.createGameBet({ game, ...options })` for `coinflip`, `keno`, `limbo`, `plinko`, `range`, `soccer`, and `wheel`.
- PvP games use dedicated per-game transaction properties, such as `client.suigar.tx.pvpCoinflip`, and should keep PvP game rules separate from standard game flows.
- For unresolved PvP Coinflip lobbies, use `client.suigar.getPvPCoinflipGames(options?)`:
  - Calling it without options uses `DEFAULT_QUERY_LIMIT` (`50`); supply `limit: DEFAULT_QUERY_LIMIT` when also passing `cursor` or another query option.
  - Bulk-load lobby objects with `client.core.getObjects()`.
  - Skip per-object fetch or parse failures by default.
  - Reject on per-object fetch or parse failures only when `throwOnError: true` is passed.
  - Return each parsed game with a derived `coin_type` string from the Move object type.
- For one specific PvP Coinflip game object, use the exported generated helper, `client.suigar.bcs.PvPCoinflipGame.get({ client, objectId })`, when a product needs one live game object outside the registry list.

Keep standard and PvP option shapes separate. Do not route PvP Coinflip through the standard game builder.

### Config resolution

`packages/sdk/src/helpers/config.ts` normalizes config by:

- Resolving the network-scoped NFT V1 package id and optional MVR package overrides
- Normalizing the configured supported coin types for the active network
- Resolving price info object ids from the supported-coin mapping
- Throwing explicit errors when a required coin mapping is missing
- Providing the price info object id used by PvP Coinflip join

Treat unsupported network resolution and unsupported configured coin types as `RangeError` cases when documenting or testing these flows.

Invalid configuration or missing price-info object IDs throw `TypeError`. Operational failures retain `Error`. Keep generated error classes aligned with `@mysten/codegen`.

### Game parameters

`client.suigar.getGameParameters({ game, coinType, ...options })` requires a coin type. It reads the selected game's settings object from SweetHouse, then that coin's `Parameters<T>` object. It parses the result, converts Move float fields to JavaScript numbers (including nested Keno, Plinko and Wheel multipliers), and caches it for `cacheTtl`.

Standard game transactions must fail clearly if the chosen coin type has no required price info object configuration.

### Referral

- `client.suigar.tx.referral` uses `@suigar/referral` by default, or `packageIds.referral` when an override is configured.
- Use `client.suigar.view.referral` for simulated claimable amounts.

### NFT V1

- Use `packageIds.nftV1` and `objectIds.nftV1Factory` for lookups.
- Use `client.suigar.tx.nftV1.mint({ owner, specId })` to mint.
- Read the selected specification's SUI price from the configured factory when the transaction is built.

### Metadata and amounts

- Treat `stake` as the logical wager used in the Move call.
- Use `cashStake` only when the withdrawn balance should differ from the logical stake.
- Prefer `bigint` for all non-UI amount handling.
- Pass plain application values to supported bet transaction `metadata` and let the SDK encode them into byte arrays.
- The extension-level `partner` option must be a partner wallet address. Labels and slugs are invalid.
- When partner attribution is required, configure `suigar({ partner: '<wallet-address>' })` once during extension setup instead of passing partner data through transaction metadata.
- Prefer importing public constants and numeric helpers from `@suigar/sdk/utils` instead of duplicating SDK defaults in downstream apps.

## TypeScript and tests

- The shared configuration disables `isolatedDeclarations` because the current Move code generator does not emit compatible annotations. Keep all other shared strict checks enabled; do not edit `src/contracts` to fix declaration-isolation diagnostics.
- SDK-owned optional value options, including `config`, `partner`, `cacheTtl`, and transaction fields, accept explicit `undefined` (`field?: T | undefined`). Forward those values directly internally; use `optionalOptions` only for stricter external Sui or generated-binding APIs. Preserve the generic inference of the extension `name`. Do not widen nested config override values validated as concrete configuration.
- SDK source and tests must pass `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`.
- Keep tests in `packages/sdk/test/unit/`, grouped into `transactions/`, `helpers/`, and `utils/`, with client and public-export coverage alongside them. Reuse nearby fixtures and helpers.
- Run the additional test-project typecheck whenever SDK tests change; the main package typecheck excludes tests.

Follow the workspace release, documentation, and PR rules. SDK source changes require an `@suigar/sdk` entry in a branch changeset scoped to the relevant topic, with the release level matching any public type or behavior changes.
