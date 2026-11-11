---
'@suigar/suifrens-display-system': major
---

Distribute the React renderers, TypeScript declarations and external SVG assets on npm. Replace `/image-assets` or `/image` with the package root for external SVG accessories and `/vip-crowns` with `/accessories`. The root now exports the three image components only. For standalone SVG markup use `SuiFrenImageInline` from `/image-inline`. Import all public types from `/types`. Import battle components and hooks from `/battle`, expression lists from `/expressions`, outfit builders and team kits from `/kits`, and animation APIs from `/animation`.

Publish unminified ESM modules with `unbundle: true`, using tsdown's default platform and file extensions for browser and server consumers.

Replace `SuiFrenType` with `SuiFrenSpecies` from `@suigar/suifrens-display-system/types` and use the lowercase values `'capy'` and `'bullshark'`. Rename `capyGesture` to `gesture` on the image renderers and `thumbsUp` to `thumbs_up`. Both species accept the shared `SuiFrenGesture` type and support `thumbs_up`, `thumbs_down` and `point` in inline and external SVG rendering. Held objects keep their native grip and take precedence over gestures; head portraits are unchanged.

Configure image animations through the single `animation` prop. Move the former top-level animation props into this object, for example `animation={{ preset: 'idle', playState: 'idle' }}`.

Move outfit settings into `renderOptions.kit`. Use `type: 'runner'` for bib and color options, or `type: 'soccer'` for a country or custom team and its home/away side. Import `AccessoryKit` from `/types`.

Select exactly one animation source (`preset` or `sequence`). Replace `loop` with `iterations` and `autoPlay: false` with `playState: 'idle'`. Duel attacks group the attacker's side, preset and expression under `attacker`, and the opponent's damage, reaction preset, expression and delay under `target`.

Replace species-specific skin and expression types and lists with the shared `SuiFrenSkin`, `SuiFrenExpression`, `SUIFREN_SKINS` and expression lists.

Attack steps always target the opposite side. Remove `target.side` and rename victory steps' `loops` to `iterations`. Explicit `assetSrc` overrides ordinary catalogue artwork in both image renderers.

Use the new `SuiFrenAccessory` type for custom accessories with only visual fields. Catalogue entries keep their full metadata. Slot lookups preserve the input type and can return `undefined`.

Use numeric tiers in VIP crown names and spell the platinum rank `platinum`: for example, rename `bronze-iii` to `bronze-3` and `platinium-ii` to `platinum-2`. The inline renderer embeds built-in VIP crowns in standalone SVG exports.

Pause JavaScript animations immediately when a character mounts outside the viewport margin, matching native playback. Move the microphone arm higher during speaking animations for both species. Share identical arm, body, head and left-leg SVG patterns without changing their rendering.

Reduce generated accessory SVG sizes while preserving animation groups and references. Fix path distortion caused by rounding SVG numbers with text replacements. Scope accessory IDs and references through SVGO, including CSS rules, quoted URLs, XLink and animation start/end references.

Export `SuiFrenAppearance` for shared species appearance fields and `AnimationPresetName` for the built-in core and battle preset names. Derive preset names from the catalogues while preserving dynamic string lookup APIs.
