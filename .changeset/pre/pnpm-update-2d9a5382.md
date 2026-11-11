---
'@suigar/mcp': patch
'@suigar/sdk': patch
---

Update Sui and BCS dependencies. BCS serialization now rejects `NaN` and fractional values for `u8`, `u16`, and `u32`, as well as negative ULEB128 values, instead of silently encoding them.
