---
'@suigar/sdk': minor
---

Export `SUIGAR_COINS` from `@suigar/sdk` and `COIN_SIDES` and `PVP_COINFLIP_ACTIONS` from `@suigar/sdk/games`. Derive `SuigarCoin`, `CoinSide`, and `PvPCoinflipAction` from these readonly lists so validation and iteration use the same choices as the types.

Represent game details for a union of games as a union of their detail shapes. Accept minimal event envelopes in the event parsers and reject unsupported game identifiers before decoding.

Treat null and undefined object contents as missing. Preserve null-prototype registries and promise rejection behavior when validating optional inputs.
