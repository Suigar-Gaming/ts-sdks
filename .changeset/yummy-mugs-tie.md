---
'@suigar/mcp': minor
'@suigar/sdk': minor
---

Update dependencies.

Refactor SDK package and object ID validation to use an internal type assertion. Invalid package IDs, object IDs, and partner addresses now throw `TypeError` with configuration-specific messages, including non-string partner values supplied by JavaScript callers.
