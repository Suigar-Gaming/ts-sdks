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
	POSITIVE_CAPY_EXPRESSIONS,
	NEGATIVE_BULLSHARK_EXPRESSIONS,
} from '@suigar/suifrens-display-system/expressions';
```

The root renderer uses cacheable external SVG assets for accessories. If you need fully self-contained SVG markup (for example, for server-side SVG export), use the inline renderer:

```ts
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
```

The root exports `SuiFrenImage`, `CapyImage` and `BullsharkImage`. Import all public types, including their props, from `/types`.

### Migrating from the 1.x GitHub archive

Move former root imports to the matching subpath before installing the beta. Use `/types` for all type-only imports.

| 1.x subpath     | npm replacement                                  |
| --------------- | ------------------------------------------------ |
| `/image-assets` | Root `SuiFrenImage` for external SVG accessories |
| `/vip-crowns`   | `/accessories` for crown values                  |
| `/battle`       | `/battle` for battle components and hooks        |
| `/expressions`  | `/expressions` for expression lists              |

Use `/accessories` for the catalogue and slot lookup, `/kits` for runner and football outfit helpers, `/animation` for animation APIs, `/colors` for the palette and `/attributes` for gene mappings.

### Editing accessory artwork

Edit the SVG files in `src/accessories/artwork/`. Single-layer accessories use their own filename, such as `baseball-cap.svg`. Accessories with multiple layers have a folder where `default.svg` supplies the base drawing and optional `body.svg`, `left.svg` and `right.svg` supply the layers drawn separately during animation. Crowns have their own viewport. Running and football kits use SVG templates for their colors, lettering and patterns.

Run `pnpm run codegen` from the package directory after editing artwork to regenerate the import lists and external SVG symbols in `src/generated/`.

### Athletics outfits

`buildRunnerAccessories({ color: '#ec7da6', number: 3 })` from the `/kits` export supplies a native singlet, shorts, headband and running shoes for capys and bullsharks. Colors accept six-digit hex values and bibs accept integers 1–99; invalid inputs use safe defaults. Set `mirrorBib: true` when the consumer mirrors the whole character so the printed number stays readable. Shoes and shorts register each leg separately; ears and fins remain visible. Inline and asset rendering preserve the same configurable SVG geometry.

### Capy thumbs-up gesture

Pass `capyGesture="thumbs_up"` to `SuiFrenImage` or `SuiFrenImageInline` to raise the capy's near arm with an upright thumb. The native head/body, palette and canvas stay unchanged. Head-only portraits and bullsharks ignore this option; a held object takes precedence so its original grip is preserved. Direct `CapyImage` consumers use `gesture="thumbs_up"`.

### Registry distribution

During the beta, install with `pnpm add @suigar/suifrens-display-system@beta` after publication. Suigar continues to consume the historical GitHub archive throughout beta.
