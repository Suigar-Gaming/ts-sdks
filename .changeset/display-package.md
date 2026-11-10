---
'@suigar/suifrens-display-system': major
---

Distribute the React renderers, TypeScript declarations and external SVG assets on npm. Replace `/image-assets` or `/image` with the package root for external SVG accessories and `/vip-crowns` with `/accessories`. The root now exports the three image components only. For standalone SVG markup use `SuiFrenImageInline` from `/image-inline`. Import all public types from `/types`. Import battle components and hooks from `/battle`, expression lists from `/expressions`, outfit builders and team kits from `/kits`, and animation APIs from `/animation`.

Use the lowercase species values `bullshark` and `capy` for `SuiFrenType`. Rename the gesture value `thumbsUp` to `thumbs_up` in both `CapyImage.gesture` and `SuiFrenImage.capyGesture`.
