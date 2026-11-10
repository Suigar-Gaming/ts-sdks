# Suifrens Display System

React components for rendering capys and bullsharks with inline or cacheable external SVG accessories. Supports React and React DOM 18.2 and 19.

### Recommended imports

Import each feature from its public entry point:

```ts
import { SuiFrenImage } from '@suigar/suifrens-display-system';
import { accessories } from '@suigar/suifrens-display-system/accessories';
import { earGeneToEarShape } from '@suigar/suifrens-display-system/attributes';
import { colors } from '@suigar/suifrens-display-system/colors';
import {
	POSITIVE_EXPRESSIONS,
	NEGATIVE_EXPRESSIONS,
} from '@suigar/suifrens-display-system/expressions';
```

The root renderer uses cacheable external SVG assets for accessories. If you need fully self-contained SVG markup (for example, for server-side SVG export), use the inline renderer:

```ts
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
```

The root exports `SuiFrenImage`, `CapyImage` and `BullsharkImage`. Import all public types, including their props, from `/types`.

### Migrating from the 1.x GitHub archive

Move former root imports to the matching subpath before installing the beta. Use `/types` for all type-only imports. Replace `SuiFrenType` with `SuiFrenSpecies` from `@suigar/suifrens-display-system/types` and use the lowercase values `'capy'` and `'bullshark'`.

Configure both `SuiFrenImage` and `SuiFrenImageInline` through the single `animation` prop. Move `animationPreset` to `animation.preset` or `animationSequence` to `animation.sequence`. Select exactly one source. Move the remaining options into the same object as `playback`, `playState`, `direction`, `trigger`, `startAt` and `holdOnComplete`. Omit `animation` or pass `null` for a static image.

```tsx
<SuiFrenImage
	attributes={attributes}
	animation={{ preset: 'walk', playback: { iterations: 'infinite' } }}
/>
```

| 1.x subpath     | npm replacement                                  |
| --------------- | ------------------------------------------------ |
| `/image-assets` | Root `SuiFrenImage` for external SVG accessories |
| `/vip-crowns`   | `/accessories` for crown values                  |
| `/battle`       | `/battle` for battle components and hooks        |
| `/expressions`  | `/expressions` for expression lists              |

Use `/accessories` for the catalogue and slot lookup, `/kits` for runner and football outfit helpers, `/animation` for animation APIs, `/colors` for the palette and `/attributes` for gene mappings.

Replace `autoPlay: false` with `playState: 'idle'`. Omit `playState` to start playback by default. Replace `playback.loop: true` with `playback.iterations: 'infinite'`, a numeric loop count with `iterations: count`, and `false` with one iteration (the default).

Duel attacks group the acting fighter's side, preset and expression under `attacker`. The other fighter is always the target. Put the damage, reaction preset, expression and impact delay under `target`. The delay after the attack remains on the step. For victory steps, replace `loops` with `iterations` (default: five).

```ts
import type { DuelAttackStep } from '@suigar/suifrens-display-system/types';

const attack = {
	type: 'attack',
	label: 'Left punches',
	attacker: { side: 'left', preset: 'punch', expression: 'angry' },
	target: { damage: 2, preset: 'hit', delayMs: 140 },
} satisfies DuelAttackStep;
```

Both species share the same skin and expression values. Replace the species-specific skin and expression types with `SuiFrenSkin` and `SuiFrenExpression` from `/types`. Use `SUIFREN_SKINS` from `/attributes` and `ALL_EXPRESSIONS`, `POSITIVE_EXPRESSIONS` or `NEGATIVE_EXPRESSIONS` from `/expressions`.

For ordinary accessories, an explicit `renderOptions.assetSrc` overrides catalogue artwork in both renderers. The inline renderer references that source directly; use a self-contained SVG data URL when exporting standalone markup.

Accessory outfit settings now live under `renderOptions.kit`. Replace `runnerKit` with `kit: { type: 'runner', color, number, mirrorBib }`. For football, use `kit: { type: 'soccer', country: 'FR', side: 'away' }` or supply a custom `team` in place of `country`. The public `AccessoryKit` type is available from `/types`.

### Shared character artwork

SVG pattern components used by both species live in `src/components/shared/`, grouped by body part, alongside shared gestures. Species-specific shapes and pattern selection remain in `src/components/capy/` and `src/components/bullshark/`.

### Editing accessory artwork

Edit the SVG files in `src/accessories/artwork/`. Single-layer accessories use their own filename, such as `baseball-cap.svg`. Accessories with multiple layers have a folder where `default.svg` supplies the base drawing and optional `body.svg`, `left.svg` and `right.svg` supply the layers drawn separately during animation. Crowns have their own viewport. Running and football kits use SVG templates for their colors, lettering and patterns.

Run `pnpm run codegen` from the package directory after editing artwork to regenerate the import lists and external SVG symbols in `src/generated/`.

### Athletics outfits

`buildRunnerAccessories({ color: '#ec7da6', number: 3 })` from the `/kits` export supplies a native singlet, shorts, headband and running shoes for capys and bullsharks. Colors accept six-digit hex values and bibs accept integers 1–99; invalid inputs use safe defaults. Set `mirrorBib: true` when the consumer mirrors the whole character so the printed number stays readable. Shoes and shorts register each leg separately; ears and fins remain visible. Inline and asset rendering preserve the same configurable SVG geometry.

### Gestures

Use `gesture="thumbs_up"` or `gesture="thumbs_down"` on either image renderer or directly on `CapyImage` and `BullsharkImage`. For existing calls, rename `capyGesture` to `gesture` and the value `thumbsUp` to `thumbs_up`. The shared `SuiFrenGesture` type is available from `/types`.

Full-body capys and bullsharks raise their near arm when the hand is free. A held object keeps its native grip and takes precedence over the gesture. Head portraits are unchanged.

### Running the examples

Build the library once with `pnpm --filter @suigar/suifrens-display-system build`. Then run `pnpm --filter @suigar/suifrens-storybook dev` for Storybook or `pnpm --filter @suigar/suifrens-fastify dev` for the HTTP server.

The Fastify SVG route validates the skin, palette colors, expression and species trait from the decoded on-chain attributes before fetching accessories. An invalid appearance returns HTTP 500. Extra trailing attributes are ignored.

### Registry distribution

During the beta, install with `pnpm add @suigar/suifrens-display-system@beta` after publication. Suigar continues to consume the historical GitHub archive throughout beta.
