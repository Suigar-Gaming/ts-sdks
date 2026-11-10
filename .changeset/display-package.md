---
'@suigar/suifrens-display-system': major
---

Distribute the React renderers, TypeScript declarations and external SVG assets on npm. Replace `/image-assets` or `/image` with the package root for external SVG accessories and `/vip-crowns` with `/accessories`. The root now exports the three image components only. For standalone SVG markup use `SuiFrenImageInline` from `/image-inline`. Import all public types from `/types`. Import battle components and hooks from `/battle`, expression lists from `/expressions`, outfit builders and team kits from `/kits`, and animation APIs from `/animation`.

Replace `SuiFrenType` with `SuiFrenSpecies` from `@suigar/suifrens-display-system/types` and use the lowercase values `'capy'` and `'bullshark'`. Rename `capyGesture` to `gesture` on the image renderers and `thumbsUp` to `thumbs_up`. Both species accept the shared `SuiFrenGesture` type. The thumbs-up pose is drawn for both species.

Configure image animations through the single `animation` prop. Move the former top-level animation props into this object, for example `animation={{ preset: 'idle', playState: 'idle' }}`.

Move outfit settings into `renderOptions.kit`. Use `type: 'runner'` for bib and color options, or `type: 'soccer'` for a country or custom team and its home/away side. Import `AccessoryKit` from `/types`.

Select exactly one animation source (`preset` or `sequence`). Replace `loop` with `iterations` and `autoPlay: false` with `playState: 'idle'`. Duel attacks group the attacker's side, preset and expression under `attacker`, and the opponent's damage, reaction preset, expression and delay under `target`.

Replace species-specific skin and expression types and lists with the shared `SuiFrenSkin`, `SuiFrenExpression`, `SUIFREN_SKINS` and expression lists.

Attack steps always target the opposite side. Remove `target.side` and rename victory steps’ `loops` to `iterations`. Explicit `assetSrc` overrides ordinary catalogue artwork in both image renderers.
