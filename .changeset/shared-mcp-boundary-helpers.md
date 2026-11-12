---
'@suigar/mcp': patch
---

Validate saved session-wallet metadata and browser callback payloads before using them, ignoring malformed wallet entries. Keep tool schemas and handler types aligned, and validate network and coin-side inputs against the SDK's supported choices. Invalid coin-side errors identify the field and its allowed values.

Handle rejected local HTTP request handlers without unhandled promises. Use nullish checks for absent inputs while preserving JSON null values and promise rejection behavior in tools.
