---
'@suigar/suifrens-display-system': patch
---

Keep accessory animation registration and soccer kit resolution correctly typed, including SVG refs and custom kits. Treat null and undefined optional rendering inputs as absent, and reuse a stable empty accessory-slot map for both species. Public exports and accessory artwork are unchanged.

Load deferred animation presets from their registered catalogue, sharing each catalogue load across requests and retrying failed loads independently.
