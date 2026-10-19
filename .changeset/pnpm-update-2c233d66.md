---
'@suigar/mcp': patch
'@suigar/sdk': patch
---

Update dependencies.

MCP wallet bridges and session setup share strict state validation and timing-safe comparison using Sui hex utilities, removing the direct `@scure/base` dependency.
