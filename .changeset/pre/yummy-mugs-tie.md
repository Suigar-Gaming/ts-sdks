---
'@suigar/mcp': minor
'@suigar/sdk': minor
---

Update dependencies.

Use an internal type assertion for SDK package and object IDs. Invalid configuration or missing price-info object IDs throw `TypeError`.

Classify MCP wallet recovery phrase validation as `TypeError`, and unsupported private-key schemes and oversized wallet bridge requests as `RangeError`. Operational failures retain generic errors.
