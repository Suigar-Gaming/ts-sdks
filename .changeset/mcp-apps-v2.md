---
'@suigar/mcp': major
---

Migrate the server and bundled MCP App to ext-apps 2 and the split MCP SDK 2 packages. The exported `createSuigarMcpServer()` now returns the v2 `McpServer`; programmatic consumers must migrate SDK imports and cannot mix v1 SDK classes or types with it. Unknown tool calls now reject with a JSON-RPC invalid-params error instead of returning a tool error result. Existing MCP Apps 1.x hosts remain compatible, and the bundled App uses the official React types and composable event listeners instead of deprecated handler setters.

Support MCP 2026-07-28 through SDK-managed stdio negotiation and discovery, including per-request metadata, complete-result discriminators, and cache hints, while retaining compatibility with legacy initialization-based clients.

Preserve existing MCP App host context when the host sends partial updates, and respect host-provided safe-area padding across inspector views.

Remove App event listeners on unmount or App replacement, and show the connecting state until the host handshake completes.
