---
'@suigar/mcp': patch
---

Allow session-wallet game execution to use a custom provider URL and partner attribution while continuing to reject custom SDK config overrides. Verify that the transaction contains exactly one MoveCall targeting the selected game's package and module before signing.
