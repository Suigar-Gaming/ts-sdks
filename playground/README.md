# Suigar Playground

This Next.js app runs on Sui `testnet` and uses UI styles and theme tokens based on the Suigar frontend. It imports the client extension from `@suigar/sdk`, game option types from `@suigar/sdk/games`, and parsing helpers from `@suigar/sdk/utils`. Wallet integration uses `@mysten/dapp-kit-core`, `@mysten/dapp-kit-react`, and `@mysten/sui`.

## What it covers

### Pages

- Standard game route: `/standard?game=coinflip`
- PvP route: `/pvp?game=pvp-coinflip&action=create`
- `/nft` reads the configured factory and shows which NFT specifications the connected wallet owns directly.
- Referral route: `/referral`, which simulates and submits commission and level-up USD reward claims for the connected referrer wallet

### Game controls

The game routes read the selected game from the query string.

- Shared supported-coin selector using `client.suigar.getConfig().coins`
- Connected-wallet balance cards for every supported coin type
- Per-game form components for standard and PvP Coinflip flows
- Standard game forms backed by `client.suigar.getGameParameters({ game, coinType })` for live on-chain stake ranges, per-game parameter bounds, and Keno/Plinko/Soccer/Wheel config selection
- Open settings at the top right of either controls card to inspect the typed `getGameParameters({ game, coinType })` result. The dialog shows the lookup request, raw payload, available configs, and expandable details for standard games and PvP Coinflip.
- The PvP selector lists `pvp-coinflip` first.
- Join and cancel cards use `client.suigar.getPvPCoinflipGames()` and each lobby’s `coin_type` for coin selection and display. Public lobbies are visible before you connect a wallet. A toggle lets you join private lobbies. The cancel list shows only the connected wallet’s lobbies. Cards use a compact multi-column layout and show the creator’s side, privacy status, and a copyable game ID.

### Transactions and events

- Live transaction-builder code preview
- Copyable NFT lookup and referral read/claim code previews that mirror the calls used by their respective routes
- The transaction execution card reads the connected wallet state from Mysten dApp Kit.
- Decoding of `BetResultEvent`, `PvPCoinflipGameCreatedEvent`, `PvPCoinflipGameResolvedEvent`, and `PvPCoinflipGameCancelledEvent`
- Oracle price formatting with `fromMoveFloat` and unified event decoding with `parseSuigarEvent` from `@suigar/sdk/utils`
- Shared persistent event table across route and game changes

## Development

The playground inherits the workspace's strict checks from `../tsconfig.shared.json`, including `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, and `noPropertyAccessFromIndexSignature`. Its local configuration retains Next.js bundler resolution and disables declaration emission.

From the repository root:

```bash
pnpm install
pnpm turbo run dev --filter='./playground'
```

Then open [http://localhost:3000](http://localhost:3000).

The app resolves the workspace-local `@suigar/sdk` package through `workspace:^`. Use the root Turbo command when you want the SDK dependency graph built first with `build:ci` before the app command starts.

Build the app:

```bash
pnpm turbo run build --filter='./playground'
```

Useful local checks:

```bash
pnpm --dir playground run lint
pnpm --dir playground run lint:fix
pnpm --dir playground run typecheck
```

## Notes

Input parsers use `TypeError` for malformed stake, bet-count, and Keno-pick values, and `RangeError` for stake precision limits and bet counts below one. Transaction and resource failures remain generic errors.

- After a transaction executes, the app refreshes the active wallet’s balance for each SDK-supported coin.
- The NFT page uses `client.core.listOwnedObjects()` with the SDK-configured NFT type, decodes objects with the SDK's NFT BCS helpers, and does not include NFTs held in a Kiosk.
- The referral page uses `client.suigar.view.referral` to simulate claimable amounts. A zero or unavailable amount disables its claim action; submitted claims are built through `client.suigar.tx.referral` and refresh afterward. Its copyable code preview includes both claimable-amount reads and unsigned claim builders.
- Stake inputs use human values such as `1` or `2.5` and are converted to atomic on-chain units before transaction creation where the selected action requires a stake.
- Standard game stake fields show the current on-chain min and max range for the selected coin, and the form clamps stake back into the allowed range when live parameters load or change.
- Standard games expose optional bet count; leave it empty to use the SDK default of `1`.
- Limbo clamps `targetMultiplier` to the on-chain `min_target_multiplier` and `max_target_multiplier` bounds. `getGameParameters({ game, coinType })` requires the selected coin type and returns those fields as JavaScript numbers.
- Range clamps inputs to the on-chain zone-size limits for the active scale. The field description shows the current RTP bounds.
- Keno, Plinko, Soccer, and Wheel switch to live config options when those on-chain parameters are available. The form only offers playable configs in the selector and automatically moves away from missing or disabled selections.

- Limbo uses the exported SDK default multiplier scale, so the form shows how `targetMultiplier` is converted with `Math.round(targetMultiplier * scale)`.
- Range point inputs are human values, not pre-scaled integers. The form derives the allowed max from the exported SDK constants `RANGE_POINT_LIMIT / scale`, so the default SDK scale allows `0` to `100`.
- For SDK pagination outside the current UI, import `DEFAULT_QUERY_LIMIT` from `@suigar/sdk/utils` instead of hard-coding `50`; it is the reusable default query page size, currently used by a no-argument `client.suigar.getPvPCoinflipGames()` call.
- The browser console logs the full decoded event payloads.
