---
'@suigar/sdk': minor
---

Omit absent optional SDK configuration, package overrides, and transaction options when forwarding them to Sui clients and generated bindings, preserving defaults and compatibility with strict optional property checking. Build forwarded options directly from defined fields instead of copying and deleting undefined fields.

Allow explicit `undefined` for SDK-owned optional extension, transaction, and cache flags, treating it like an omitted option even with `exactOptionalPropertyTypes` enabled.
