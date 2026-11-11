# @suigar/suifrens-display-system

## 2.0.0-beta.0

### Major Changes

- [#189](https://github.com/Suigar-Gaming/ts-sdks/pull/189) [`8afe73e`](https://github.com/Suigar-Gaming/ts-sdks/commit/8afe73ec253d08903e7c7583e215042ceafec46c) - Distribute the React renderers, TypeScript declarations and external SVG assets on npm. Replace `/image-assets` or `/image` with the package root for external SVG accessories and `/vip-crowns` with `/accessories`. The root now exports the three image components only. For standalone SVG markup use `SuiFrenImageInline` from `/image-inline`. Import all public types from `/types`. Import battle components and hooks from `/battle`, expression lists from `/expressions`, outfit builders and team kits from `/kits`, and animation APIs from `/animation`.

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

  Rename data exports to `COLORS`, `ACCESSORIES`, `VIP_CROWN_ACCESSORIES` and `EAR_GENE_TO_EAR_SHAPE`. Functions, hooks, components and prop names retain their existing casing. Use lowercase hexadecimal colors and palette keys; normalize existing external keys before validating against `COLORS`.

### Patch Changes

- [#189](https://github.com/Suigar-Gaming/ts-sdks/pull/189) [`8afe73e`](https://github.com/Suigar-Gaming/ts-sdks/commit/8afe73ec253d08903e7c7583e215042ceafec46c) - Include an agent skill in each npm package that loads the relevant full Suigar skills, references and related skills from `main` in `Suigar-Gaming/agent-skills`.

## 1.2.2

### Patch Changes

- 2526ff5: Prevent mirrored arms, hands and sleeves from briefly collapsing at quarter-turn animation endpoints.

## 1.2.1

### Patch Changes

- dd2f7e9: Make the capy thumbs-up pose compact and forward-facing, with a shorter integrated thumb and a continuous limb outline. Move the posed arm slightly down and left, with its wrist directed toward the belly. Preserve the normal resting pose, head portraits, bullsharks, held-object grips, native palette and foreground layering.

## 1.2.0

### Minor Changes

- 6f283d6: Add an optional native capy thumbs-up gesture to inline and asset renderers. Keep the original head, body, colors and shoulder registration; head portraits and held-object grips remain unchanged.

## 1.1.2

### Patch Changes

- 0ace5d9: Fit running headbands to each species. Keep the capy ribbon short and curved across the front of both ear roots, lower at the near ear and rising just beyond the far ear, in full-body and head-only renders. Keep the forehead, eyes and muzzle clear, with compact tied ends behind the near ear.
- 019ebb1: Anchor native capy and bullshark arm rotations at their shoulder seams instead of SVG origins. Raised arms, patterns and held accessories remain attached to the torso during celebrations and other arm animations.
- f474fb4: Fit cream runner-singlet binding to the native garment contour: retain the neckline and add continuous inset side/hem piping beneath the animated arms. Replace detached side stripes and shoulder marks with fabric edges registered to capys and bullsharks. Keep bibs, colors and limb registration unchanged.
- da5bb39: Let left-hand objects render in the foreground with the gripping arm so raised trophies stay visible in front of the head on both species. Preserve the microphone animation's existing automatic layering.

  Register foreground native arms and their patterns when they mount during a pose change, so held objects and the gripping hand continue to animate together.

## 1.1.1

### Patch Changes

- d009895: Fit runner uniforms to the native body and foot silhouettes. Close shirt/short seams, remove doubled outlines and detached trim, and simplify headband joins. Keep both species, readable bibs and independent native limb animation.

## 1.1.0

### Minor Changes

- ffcfed5: Add configurable runner singlets with numbered bibs, shorts, headbands and running shoes for capys and bullsharks. Export buildRunnerAccessories with validated kit colors and bib numbers, plus an option to compensate for mirrored bibs. Both inline and asset renderers preserve native animated joint registration.

## 1.0.7

### Patch Changes

- 2e4f6f6: Restore the original avatar body placement and facial alignment with or without a crown. Keep the native SVG canvas unchanged. Let complete crown artwork overflow for unframed characters, while framed avatars keep their established crop. This also corrects Capy eyes and other nested SVG artwork that were scaled by the enlarged crown canvas in v1.0.6.

## 1.0.6

### Patch Changes

- 02a8bea: Display complete VIP crowns, including tall tips and side ornaments, on Capy and Bullshark. Remove export masks that cut through crown artwork, preserve crown size and placement with matching padded image bounds, and give crowned portraits room for head-bound motion in both renderers.

## 1.0.5

### Patch Changes

- 3018e9f: Fix individual goth boots to render only the selected boot without clipping. Correct bullshark fin animation registration and its attachment pivot, detect transformed accessory roots, and deduplicate fallback registrations. Rebuild animation registrations when switching between capy and bullshark in both inline and asset renderers.

## 1.0.4

### Patch Changes

- ebd68e1: Prepare release versions and changelogs through automated Changesets pull requests, and publish the compiled GitHub archive after the version pull request is merged. Validate feature changes with pending changesets; release packing is not required.
- 5033892: Fix automated GitHub release preparation by invoking Changesets versioning without shell operators being forwarded as command arguments.

## 1.0.3

### Patch Changes

- Distribute compiled ESM entry points, TypeScript declarations and SVG assets as a versioned GitHub Release archive, without consumer build scripts or development dependencies. Restore the historical `CapyImage` and `BullsharkImage` root exports when replacing Suigar's copied distribution with the source build. That source build uses thicker clothing outlines and arm animation markers; team palettes and native geometry remain unchanged.

  Track subsequent releases with Changesets-generated versions and changelog entries, and include the changelog in the release archive.
