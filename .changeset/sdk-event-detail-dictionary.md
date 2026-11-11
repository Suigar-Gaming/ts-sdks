---
'@suigar/sdk': patch
---

Decode game details into an object with a null prototype and read only own schema properties. Preserve unknown keys such as `__proto__`, `constructor` and `toString` as string details instead of treating inherited properties as decoders. Use `Object.hasOwn(details, key)` to check returned keys; this also applies to `gameDetails` from `parseSuigarEvent`.

Return resolved coin metadata in a null-prototype dictionary too. Supported coin entries and overrides are unchanged; use `Object.hasOwn(config.coins, key)` for own-key checks.
