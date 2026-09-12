---
'@suigar/mcp': major
---

Migrate the server and bundled MCP App to ext-apps 2 and the split MCP SDK 2 packages. The exported `createSuigarMcpServer()` now returns the v2 `McpServer`; programmatic consumers must migrate SDK imports and cannot mix v1 SDK classes or types with it. Unknown tool calls now reject with a JSON-RPC invalid-params error instead of returning a tool error result. Existing MCP Apps 1.x hosts remain compatible, and the bundled App uses the official React types and composable event listeners instead of deprecated handler setters.
