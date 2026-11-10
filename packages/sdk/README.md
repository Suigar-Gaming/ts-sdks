# `@suigar/sdk`

Use this TypeScript SDK to build transactions for Suigar's provably fair casino games on Sui, SweetHouse pools, NFTs, and referral claims.

## Agent skills

The npm package includes a lightweight agent skill at `skills/suigar-sdk/SKILL.md`. It routes matching tasks to full instructions in [Suigar-Gaming/agent-skills](https://github.com/Suigar-Gaming/agent-skills) on `main`. Linked references are fetched only when needed.

You can also install the full skills with `npx skills add Suigar-Gaming/agent-skills`.

## Documentation

See the full SDK documentation at [suigar.com/docs/sdk](https://suigar.com/docs/sdk).

For Sui client, transaction and network APIs, see the [Sui TypeScript SDK docs](https://sdk.mystenlabs.com/).

## Installation

```bash
npm install --save @suigar/sdk @mysten/sui @mysten/bcs
```

The SDK is also published on JSR:

```bash
pnpm add jsr:@suigar/sdk
```

Runtime requirements:

- Node.js `^24.0.0 || ^26.0.0`
- ESM project configuration (`"type": "module"`)
- `@mysten/sui@2`
- `@mysten/bcs@2`

This SDK targets Sui TypeScript SDK 2.0+ only. Follow the official [Sui 2.0 migration guide](https://sdk.mystenlabs.com/sui/migrations/sui-2.0) if your app still uses the pre-2.0 client API.

## Public exports

You can pass `undefined` for the optional extension fields `config`, `partner`, and `cacheTtl`, and for optional SDK transaction fields, even with `exactOptionalPropertyTypes` enabled. For example, `suigar({ partner: undefined })` and `createGameBet({ ...betOptions, betCount: undefined, metadata: undefined })` use the defaults for omitted options. If you supply a nested configuration override, its value must be valid.

The package has three public entrypoints:

- `@suigar/sdk` for the extension factory, runtime client class, and core SDK types
- `@suigar/sdk/games` for game-specific public types
- `@suigar/sdk/utils` for public parser, constants, and numeric helpers

Import the extension factory, client class, and core types from the package root.

```ts
import {
	suigar,
	SuigarClient,
	SUPPORTED_SUI_NETWORKS,
	type SuigarCoin,
	type SuigarNetwork,
} from '@suigar/sdk';
```

After registering the extension, access individual transaction builders through `client.suigar.tx`.

Import utilities from the utils subpath:

```ts
import {
	DEFAULT_GAS_BUDGET_MIST,
	DEFAULT_LIMBO_MULTIPLIER_SCALE,
	DEFAULT_QUERY_LIMIT,
	DEFAULT_RANGE_SCALE,
	fromMoveFloat,
	fromMoveI64,
	isMoveFloat,
	isMoveI64,
	parseCoinType,
	parseGameDetails,
	parseSuigarEvent,
	RANGE_POINT_LIMIT,
	toBigInt,
	toU8,
	toU16,
	toU32,
} from '@suigar/sdk/utils';
```

Numeric helper behavior:

- `DEFAULT_QUERY_LIMIT` is `50`, the reusable SDK default page size for paginated queries; `getPvPCoinflipGames()` currently uses it when called without options
- `toBigInt(value)` accepts `bigint`, finite `number`, non-negative integer `string`, and `boolean` inputs and returns a normalized non-negative `bigint` while throwing `TypeError` for invalid input shapes and `RangeError` for negative values
- `toU8(value)` accepts a finite integer `number` or plain integer `string` in the inclusive `0..255` range, throwing `TypeError` for non-numeric input and `RangeError` for booleans, fractional values, or out-of-range integers
- `toU16(value)` accepts a finite integer `number` or plain integer `string` in the inclusive `0..65535` range, throwing `TypeError` for non-numeric input and `RangeError` for booleans, fractional values, or out-of-range integers
- `toU32(value)` accepts a finite integer `number` or plain integer `string` in the inclusive `0..4294967295` range, throwing `TypeError` for non-numeric input and `RangeError` for booleans, fractional values, or out-of-range integers
- `fromMoveI64(value)` converts a generated Move `i64` wrapper into a JavaScript `number`
- `fromMoveFloat(value)` converts a generated Move float struct into a JavaScript `number`; `getGameParameters()` already applies this conversion to all float fields, including nested game configs
- `isMoveI64(value)` checks whether an unknown value has the generated Move `i64` shape
- `isMoveFloat(value)` checks whether an unknown value has the generated Move float shape
- `parseCoinType(type)` extracts the normalized first generic coin type from a Move object type string and throws `TypeError` when no coin type can be parsed
- `parseGameDetails({ game, gameDetails })` decodes standard `BetResultEvent.game_details` byte arrays into the expected string, number, bigint, boolean, and address values while preserving the original on-chain keys

Import game-specific types from the `games` subpath:

```ts
import { GAMES } from '@suigar/sdk/games';
import type {
	CoinflipTransactionOptions,
	CoinSide,
	CreatePvPCoinflipTransactionOptions,
	Game,
	PvPCoinflipAction,
	PvPGame,
	StandardGame,
} from '@suigar/sdk/games';
```

The game subpath exports:

- `@suigar/sdk/games`: `GAMES`, `Game`, `StandardGame`, `PvPGame`, `CoinSide`, `PvPCoinflipAction`, `CreateGameBetOptions`, `CoinflipTransactionOptions`, `KenoTransactionOptions`, `LimboTransactionOptions`, `PlinkoTransactionOptions`, `RangeTransactionOptions`, `SoccerTransactionOptions`, `WheelTransactionOptions`, `CreatePvPCoinflipTransactionOptions`, `JoinPvPCoinflipTransactionOptions`, `CancelPvPCoinflipTransactionOptions`

Call SDK methods on the registered extension.

```ts
const client = new SuiGrpcClient({ baseUrl, network }).$extend(suigar());

client.suigar.serializeTransactionToBase64({ transaction });
client.suigar.getConfig();
client.suigar.getPvPCoinflipGames(...);
client.suigar.tx;
client.suigar.bcs;
```

## Quick start

```ts
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { suigar } from '@suigar/sdk';

const client = new SuiGrpcClient({
	baseUrl: 'https://fullnode.testnet.sui.io:443',
	network: 'testnet',
}).$extend(suigar());

const tx = client.suigar.tx.createGameBet({
	game: 'coinflip',
	owner: '0x123',
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	side: 'heads',
});

const base64 = await client.suigar.serializeTransactionToBase64({
	transaction: tx,
});
```

## Extension registration

### `suigar(options?)`

Creates a named Sui client extension. By default, it registers under `client.suigar`.

The extension constructor throws `RangeError` when the connected client network is not one of the SDK's supported Sui networks.

### Partner setup

Set `partner` to the wallet address that should receive on-chain attribution. The SDK prepends this address to supported bet metadata.

```ts
const client = new SuiGrpcClient({ baseUrl, network }).$extend(
	suigar({ partner: '0xpartner_wallet_address' }),
);

client.suigar;
```

A slug, label, or display name is invalid here.

You can rename the extension:

```ts
const client = new SuiGrpcClient({ baseUrl, network }).$extend(suigar({ name: 'games' }));

client.games.tx;
client.games.bcs;
```

## Config

`suigar(options?)` resolves config from:

- MVR-backed package names for generated game, referral, and core bindings
- The internal NFT V1 package id by network, plus optional package id overrides
- Internal supported coin metadata by network
- The connected client network
- The extension name

Supported override areas:

- `name`
- `partner`
- `cacheTtl`
- `config.packageIds`
- `config.objectIds`
- `config.coins`

Invalid configuration or missing price-info object IDs throw `TypeError`.

Use `config` to change the NFT V1 package id, override an MVR-backed package id, change singleton object ids or adjust supported `sui`/`usdc` coin metadata before the next SDK release. Game, referral, and core bindings use `@suigar/*` MVR names by default; optional `packageIds` entries override those defaults when needed. `packageIds.nftV1` remains configured by network because it is not resolved from MVR. Each coin entry includes its price-info object id.

Both supported coin keys accept the same partial metadata shape:

```ts
coins?: {
	sui?: { coinType?: string; decimals?: number; priceInfoObjectId?: string };
	usdc?: { coinType?: string; decimals?: number; priceInfoObjectId?: string };
};
```

```ts
const client = new SuiGrpcClient({ network, baseUrl }).$extend(
	suigar({
		config: {
			coins: {
				usdc: {
					coinType: '0xPACKAGE::usdc::USDC',
					decimals: 6,
					priceInfoObjectId: '0xPYTH_PRICE_INFO',
				},
			},
		},
	}),
);
```

When `partner` is configured, the SDK writes that wallet address into supported on-chain bet metadata vec-maps. Builders also accept `metadata`. If you supply reserved keys such as `partner` or `referrer` manually, the SDK ignores them and logs a warning.

`cacheTtl` controls the SDK cache for on-chain reads such as parsed game parameters. It is expressed in milliseconds and defaults to 30 minutes.

## Client API

The registered extension has these methods and properties:

- `getConfig()`
- `getGameParameters({ game, coinType, ...options })`
- `serializeTransactionToBase64({ transaction, ...options })`
- `getPvPCoinflipGames(options?)`
- `bcs`
- `tx`
- `view`

### `getConfig()`

Returns the resolved SDK configuration for the connected network.

Use it to check the NFT V1 package ID, MVR package overrides, object IDs, and supported coin metadata when debugging.

It includes:

- `packageIds` (`nftV1` plus any configured MVR package overrides)
- `objectIds`
- `coins`

```ts
const config = client.suigar.getConfig();
console.log(config.packageIds);
console.log(config.coins.sui.coinType);
```

### `getGameParameters({ game, coinType, ...options })`

Returns the on-chain `Parameters<T>` object for any supported game and coin type. The return type is inferred from `game`. `coinType` is required because each game has a distinct parameters object for every supported coin.

The SDK reads the selected game's settings from the configured SweetHouse object, then fetches the coin-specific `Parameters<T>` object. Use the result to display or validate current stake limits, house edge and game-specific config bounds. The extension caches the parsed result for `cacheTtl`.

Float parameter fields such as `min_target_multiplier`, `max_target_multiplier`, `min_rtp`, and `max_rtp` are returned as normal JavaScript numbers. This also applies to float multipliers nested in Plinko and Wheel configs.

```ts
const parameters = await client.suigar.getGameParameters({
	game: 'coinflip',
	coinType: '0x2::sui::SUI',
});

console.log(parameters.min_stake);
```

Pass `ignoreCache: true` to refresh the on-chain read and replace the cached value.

### `serializeTransactionToBase64({ transaction, ...options })`

Builds a transaction with the configured Sui client and returns base64-encoded transaction bytes.

Use the result to send a transaction to a wallet, API or external signer.

```ts
const base64 = await client.suigar.serializeTransactionToBase64({
	transaction: tx,
});
```

### `getPvPCoinflipGames(options?)`

Lists unresolved PvP Coinflip games from the configured PvP registry for use in a lobby.

The SDK reads the registry's dynamic fields on the active network and fetches the games in bulk with `client.core.getObjects()`. When a match is joined and resolved, the Move contract removes the registry entry and deletes the live `Game` object.

By default, the lookup skips objects it cannot fetch or parse, including deleted games. Pass `throwOnError: true` to reject the lookup if any object fails.

Each returned entry includes the parsed game fields plus a derived `coin_type` string from the underlying Move object type.

When called without options, this returns the first `DEFAULT_QUERY_LIMIT` entries (`50`). Pass supported `listDynamicFields()` options, such as `limit`, `cursor` or `signal`, through `options`. Include `limit: DEFAULT_QUERY_LIMIT` when you want the SDK default page size alongside another option.

```ts
import { DEFAULT_QUERY_LIMIT } from '@suigar/sdk/utils';

const games = await client.suigar.getPvPCoinflipGames({
	limit: DEFAULT_QUERY_LIMIT,
});

for (const game of games) {
	console.log(game.id);
	console.log(game.coin_type);
}
```

```ts
const games = await client.suigar.getPvPCoinflipGames({
	limit: 20,
	throwOnError: true,
});
```

## `tx`

Transaction builders live under `client.suigar.tx`.

### Standard games

Use `createGameBet({ game, ...options })` for:

- `coinflip`
- `keno`
- `limbo`
- `plinko`
- `range`
- `soccer`
- `wheel`

```ts
const tx = client.suigar.tx.createGameBet({
	game: 'coinflip',
	owner: '0x123',
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	side: 'tails',
});
```

Shared option shape:

- `owner: string`
- `coinType: string`
- `stake: number | bigint`
- `cashStake?: number | bigint`
- `betCount?: number | bigint`
- `metadata?: Record<string, string | number | boolean | bigint | Uint8Array | number[] | null | undefined>`
- `gasBudget?: number | bigint`
- `useGasCoin?: boolean`

Shared behavior:

- `stake` is the logical stake passed into the Move call
- `cashStake` controls the withdrawn balance and defaults to `stake`
- `betCount` defaults to `1`
- `metadata` is encoded into `keys` and `values` byte arrays
- `partner` configured via `suigar({ partner })` is prepended automatically to metadata as the partner wallet address
- `metadata.partner` and `metadata.referrer` are reserved and ignored with a warning
- The SDK resolves the price info object from the configured supported-coin mapping
- Bet coin inputs are built from the owner's balance with Mysten coin intent helpers, using `coinType`, `cashStake`, and optional `useGasCoin`; omit `useGasCoin` to use Mysten's default behavior
- The reward object is transferred back to `owner`

Error behavior:

- `RangeError` when `gameId` is unsupported
- `RangeError` when `coinType` is not in the resolved supported-coin config for the active network
- `RangeError` when a Keno, Plinko, or Wheel `configId` is not a `u8` integer (`0..255`)
- `RangeError` when a Keno `picks` value is not a `u8` integer (`0..255`)
- `RangeError` when a Soccer `configId` or `shotZoneId` is not a `u8` integer (`0..255`), or its `countryId` is not a `u16` integer (`0..65535`)
- `TypeError` when those selection values are not finite numbers or plain integer strings

Per-game options:

- `coinflip`: `side: 'heads' | 'tails'`
- `keno`: `configId: number`, `picks: number[]`
- `limbo`: `targetMultiplier: number`, `scale?: number`
- `plinko`: `configId: number`
- `range`: `leftPoint: number`, `rightPoint: number`, `outOfRange?: boolean`, `scale?: number`
- `soccer`: `configId: number`, `countryId: number`, `shotZoneId: number`
- `wheel`: `configId: number`

Examples:

```ts
const limboTx = client.suigar.tx.createGameBet({
	game: 'limbo',
	owner: '0x123',
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	targetMultiplier: 2.5,
});

const rangeTx = client.suigar.tx.createGameBet({
	game: 'range',
	owner: '0x123',
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	leftPoint: 25,
	rightPoint: 75,
	outOfRange: false,
});
```

Scaling and selection limits:

- `limbo` converts `targetMultiplier` with `Math.round(targetMultiplier * scale)`
- With the default `limbo` scale `100`, exposed as `DEFAULT_LIMBO_MULTIPLIER_SCALE`, a target multiplier of `2.5` becomes `250` on-chain
- `range` converts each point with `Math.round(value * scale)`
- `range` points are bounded by the contract limit exposed as `RANGE_POINT_LIMIT`
- With the default `range` scale `1_000_000`, exposed as `DEFAULT_RANGE_SCALE`, valid UI values are `0` to `100`
- `keno`, `plinko`, `soccer`, and `wheel` `configId` values must fit in `u8`; Keno `picks` values must fit in `u8`; `soccer` `countryId` must fit in `u16`, and `shotZoneId` must fit in `u8`
- If you set `scale` to `10_000_000`, valid UI values become `0` to `10`
- Do not pre-scale `range` points before passing them to the SDK; pass the human value and let the SDK scale it once

### PvP games

#### PvP Coinflip

Use the action-specific `pvpCoinflip` builders for PvP Coinflip flows:

- `createGame`
- `joinGame`
- `cancelGame`

Create:

```ts
const tx = client.suigar.tx.pvpCoinflip.createGame({
	owner: '0x123',
	coinType: '0x2::sui::SUI',
	stake: 1_000_000_000n,
	side: 'heads',
	isPrivate: false,
});
```

Join:

```ts
const tx = client.suigar.tx.pvpCoinflip.joinGame({
	owner: '0x123',
	coinType: '0x2::sui::SUI',
	gameId: '0xGAME_ID',
});
```

Cancel:

```ts
const tx = client.suigar.tx.pvpCoinflip.cancelGame({
	owner: '0x123',
	coinType: '0x2::sui::SUI',
	gameId: '0xGAME_ID',
});
```

PvP Coinflip create builds the stake coin from the owner's balance with Mysten coin intent helpers. Join derives the stake from `gameId` and uses the configured price info object id for `coinType`. Omit `useGasCoin` to use Mysten's default coin intent behavior. Cancel does not build a bet coin or write metadata.

PvP Coinflip shared options:

- `owner: string`
- `coinType: string`
- `gasBudget?: number | bigint`

PvP Coinflip create/join shared options:

- `metadata?: Record<string, string | number | boolean | bigint | Uint8Array | number[] | null | undefined>`
- `useGasCoin?: boolean`

Action-specific options:

- `createGame`: `stake`, `side`, `isPrivate?`
- `joinGame`: `gameId`
- `cancelGame`: `gameId`

Error behavior:

- `RangeError` when `coinType` is not in the resolved supported-coin config for the active network

### SweetHouse

SweetHouse public pool transaction builders live under `client.suigar.tx.sweetHouse`:

- `deposit`
- `redeemRequest`
- `claimOwnRedeemRequestAfterDelay`

Deposit:

```ts
const usdcType = client.suigar.getConfig().coins.usdc.coinType;

const deposit = client.suigar.tx.sweetHouse.deposit({
	owner: '0x123',
	coinType: usdcType,
	amount: 10_000_000n,
});
```

Redeem:

```ts
const redeem = client.suigar.tx.sweetHouse.redeemRequest({
	owner: '0x123',
	coinType: usdcType,
	amount: 10_000_000n,
});
```

Delayed fallback claim:

```ts
const claim = client.suigar.tx.sweetHouse.claimOwnRedeemRequestAfterDelay({
	owner: '0x123',
	coinType: usdcType,
	requestId: '0xREDEEM_REQUEST_ID',
});
```

Deposit amounts are in the underlying coin's base units, so `10_000_000n` is 10 USDC for the default configured USDC coin. Redeem request amounts are staked coin base units for the same pool. Each builder resolves the core package id and SweetHouse shared object from SDK configuration. `deposit` transfers the returned staked coin back to `owner`, while `redeemRequest` spends staked coins from `owner` and creates a redeem request. The signer must be `owner`; delayed self-claims must be signed by the same address that created the redeem request.

### Referral claims

Referrers can claim commission for any supported wager coin. They can also claim USD-denominated level-up rewards in the configured dollar coin (`coins.usdc`). Each builder sets `owner` as the transaction sender and transfers the claim coin to that address.

```ts
const commissionClaim = client.suigar.tx.referral.claimCommission({
	owner: '0xREFERRER',
	coinType: '0x2::sui::SUI',
});

const levelUpClaim = client.suigar.tx.referral.claimLevelUpUsdRewards({
	owner: '0xREFERRER',
});
```

The owner must sign the transaction: the Move contract derives the referrer from the transaction sender. `claimLevelUpUsdRewards` supplies the configured USDC type and its Pyth price-info object automatically. A claim can still abort when no referrer or coin-specific balance exists, the rakeback pool lacks funds, or the oracle check fails.

Use `view.referral` to simulate the complete claim transaction and return its atomic payout without changing chain state:

```ts
const commissionAmount = await client.suigar.view.referral.getCommission({
	owner: '0xREFERRER',
	coinType: '0x2::sui::SUI',
});
const levelUpUsdcAmount = await client.suigar.view.referral.getLevelUpUsdRewards({
	owner: '0xREFERRER',
});
```

The deployed referral contract does not expose public balance getters. These simulated reads execute the same pool and oracle checks as a real claim, so they can fail for the same reasons and can change before execution.

### NFT V1

#### Reading NFTs

- Use `packageIds.nftV1` as the network-specific NFT V1 package ID.
- Derive the owned-NFT type with `client.suigar.bcs.NftV1.typeTag({ package: client.suigar.getConfig().packageIds.nftV1 })` instead of constructing the Move type manually.
- Use `objectIds.nftV1Factory` to fetch the NFT V1 catalog with `content: true`, then decode it with `client.suigar.bcs.NftV1Factory.parse(object.content)`.
- Decode owned NFTs with `client.suigar.bcs.NftV1.parse(object.content)`.

#### Minting

Mint an NFT V1 directly to the transaction sender with a factory specification ID. The transaction resolves the configured factory for that specification's SUI price when built, then resolves the NFT package and SweetHouse object from SDK configuration:

```ts
const transaction = client.suigar.tx.nftV1.mint({
	owner: accountAddress,
	specId: '0xNFT_SPEC_ID',
});
```

## `bcs`

BCS helpers live under `client.suigar.bcs`.

Available helpers:

- `PvPCoinflipGame`
- `BetResultEvent`
- `PvPCoinflipGameCreatedEvent`
- `PvPCoinflipGameResolvedEvent`
- `PvPCoinflipGameCancelledEvent`
- `ReferrerClaimCommissionBalanceEvent`
- `ReferrerClaimLevelUpUsdRewardsEvent`
- `RedeemRequestCreatedEvent`

These are generated Move event decoders. Use them to parse Suigar event payloads from transaction results. The `@suigar/sdk/utils` subpath also exposes parser helpers for generated BCS values:

- `PvPCoinflipGame` parses a PvP Coinflip game object's `content`
- `fromMoveI64(float.exp)` converts a generated Move `i64` exponent to a JavaScript number
- `fromMoveFloat(float)` converts a generated Move `Float` struct to a JavaScript number
- `parseCoinType(type)` extracts the normalized coin type from generic Move object type strings such as PvP Coinflip `Game<T>` and throws `TypeError` when the type string does not include a first generic coin type
- `parseGameDetails({ game, gameDetails })` decodes `BetResultEvent.game_details` entries into the expected string, number, bigint, boolean, and address values

### Parse PvP Coinflip game objects

Use the generated BCS helper when you want to fetch and parse a game object:

```ts
const game = await client.suigar.bcs.PvPCoinflipGame.get({
	client,
	objectId: '0xGAME_ID',
});

console.log(game.json);
```

### Parse standard bet results

Call the Sui client's `signAndExecuteTransaction` with a wallet or keypair signer, then wait for the finalized result before parsing events. In this example, `client` is the configured SDK client, `accountAddress` is the connected wallet address, and `signer` implements the Sui signing interface:

```ts
const tx = client.suigar.tx.createGameBet({
	game: 'coinflip',
	owner: accountAddress,
	coinType: client.suigar.getConfig().coins.usdc.coinType,
	stake: 10_000_000n,
	side: 'heads',
});

const execution = await client.signAndExecuteTransaction({
	transaction: tx,
	signer,
});

if (execution.$kind === 'FailedTransaction') {
	throw new Error(execution.FailedTransaction.status.error?.message);
}

const finalResult = await client.waitForTransaction({
	digest: execution.Transaction.digest,
	include: {
		effects: true,
		events: true,
	},
});

if (finalResult.$kind === 'FailedTransaction') {
	throw new Error(finalResult.FailedTransaction.status.error?.message);
}

console.log(finalResult.Transaction.digest);

const transactionResult = finalResult.Transaction;

const betResults = [];

for (const event of transactionResult.events ?? []) {
	try {
		const decoded = client.suigar.bcs.BetResultEvent.parse(event.bcs);
		betResults.push(decoded);
	} catch {
		// Ignore non-BetResultEvent payloads.
	}
}
```

Parsed fields include:

- `player`
- `coin_type`
- `stake_amount`
- `unsafe_oracle_usd_coin_price`
- `adjusted_oracle_usd_coin_price`
- `outcome_amount`
- `game_details`
- `metadata`

`game_details` and `metadata` decode as `VecMap<string, vector<u8>>`-shaped data, so values come back as byte arrays. Use `parseSuigarEvent(event)` from `@suigar/sdk/utils` to identify and decode supported Suigar events. For a `BetResultEvent`, it also returns decoded, game-specific `gameDetails`.

```ts
import { parseSuigarEvent } from '@suigar/sdk/utils';

const suigarEvent = parseSuigarEvent(event);

if (suigarEvent?.event.type === 'BetResultEvent') {
	console.log(suigarEvent.event.data.outcome_amount);
	console.log(suigarEvent.gameDetails.payout_amount);
}
```

`parseGameDetails` preserves the on-chain keys and only changes the value representation. For example, coinflip details keep keys such as `player_bet` and `coin_outcome`; range details keep keys such as `roll_value`, `win`, and `payout_multiplier`.

`suigarEvent.gameDetails` narrows based on the event game. For example, when `suigarEvent.game === 'coinflip'` it narrows to:

- `{ player_bet: string; coin_outcome: string }`

`parseGameEvent(event)` remains available when only the normalized game and raw Move event name are needed. It returns:

- `{ game: 'coinflip' | 'keno' | 'limbo' | 'plinko' | 'range' | 'soccer' | 'wheel', event: 'BetResultEvent' }` for standard bet result events
- `{ game: 'pvp-coinflip', event: 'BetResultEvent' | 'GameCreatedEvent' | 'GameResolvedEvent' | 'GameCancelledEvent' }` for PvP Coinflip events
- `null` for unsupported event names or non-Suigar event payloads

When the extension is configured with `partner`, decoded event `metadata` will contain that partner wallet address under the `partner` entry.

When decoding events:

- Execute or wait for the transaction with `include: { events: true }`
- Unwrap the core API union with `result.$kind`, `result.Transaction`, and `result.FailedTransaction`
- Parse emitted events from the unwrapped transaction result
- Use `event.bcs` for consistent decoding across transports
- Use `parseSuigarEvent(event)` when you want the decoded payload and game details in one step
- `waitForTransaction({ digest, include: { effects: true, events: true } })` is useful when you want the finalized transaction result before decoding
- Pass the individual event payload to the decoder.

### Parse SweetHouse redeem requests

SweetHouse emits `RedeemRequestCreatedEvent` when a redeem request is created. Decode the event payload and read `request_id` to obtain the request ID needed by `client.suigar.tx.sweetHouse.claimOwnRedeemRequestAfterDelay`:

Only the transaction owner, `accountAddress`, needs to sign.

```ts
const redeem = client.suigar.tx.sweetHouse.redeemRequest({
	owner: accountAddress,
	coinType: client.suigar.getConfig().coins.usdc.coinType,
	amount: 10_000_000n,
});

const execution = await client.signAndExecuteTransaction({
	transaction: redeem,
	signer,
});

if (execution.$kind === 'FailedTransaction') {
	throw new Error(execution.FailedTransaction.status.error?.message);
}

const finalResult = await client.waitForTransaction({
	digest: execution.Transaction.digest,
	include: {
		effects: true,
		events: true,
	},
});

if (finalResult.$kind === 'FailedTransaction') {
	throw new Error(finalResult.FailedTransaction.status.error?.message);
}

const transactionResult = finalResult.Transaction;
const redeemRequests = [];

for (const event of transactionResult.events ?? []) {
	try {
		const decoded = client.suigar.bcs.RedeemRequestCreatedEvent.parse(event.bcs);
		redeemRequests.push({
			requestId: decoded.request_id,
			player: decoded.player,
			coinType: decoded.coin_type.name,
			amount: decoded.staked_amount,
			createdAtMs: decoded.created_at_ms,
		});
	} catch {
		// Ignore non-SweetHouse RedeemRequestCreatedEvent payloads.
	}
}
```

The decoded event contains `request_id`, `player`, `coin_type.name`, `staked_amount`, and `created_at_ms`. `staked_amount` is in the selected staked coin's base units.

### Parse PvP Coinflip events

Use the matching helper for each PvP Coinflip event payload found in `transactionResult.events`:

- `client.suigar.bcs.PvPCoinflipGameCreatedEvent`
- `client.suigar.bcs.PvPCoinflipGameResolvedEvent`
- `client.suigar.bcs.PvPCoinflipGameCancelledEvent`

## Development

The SDK uses the shared strict TypeScript checks, including `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`. The shared configuration disables `isolatedDeclarations` because the current Move code generator does not emit the required explicit type annotations. Do not edit `src/contracts` manually to satisfy that check.

From the repository root:

```bash
pnpm install
pnpm --dir packages/sdk run build
pnpm --dir packages/sdk run typecheck
pnpm --dir packages/sdk run test
```

Build without regenerating contract bindings:

```bash
pnpm --dir packages/sdk run build:ci
```

Refresh package configuration and regenerate Move contract bindings:

```bash
pnpm --dir packages/sdk run codegen
```

Run linting and formatting checks:

```bash
pnpm --dir packages/sdk run lint
pnpm --dir packages/sdk run lint:fix
```
