# Suifrens Display System

React components for rendering capys and bullsharks with inline or cacheable external SVG accessories. Supports React and React DOM 18.2 and 19.

### Recommended imports

For the smallest consumer bundles, prefer subpath imports for runtime values instead of the root entry:

```ts
import { accessories } from '@suigar/suifrens-display-system/accessories';
import { earGeneToEarShape } from '@suigar/suifrens-display-system/attributes';
import { colors } from '@suigar/suifrens-display-system/colors';
import {
	POSITIVE_CAPY_EXPRESSIONS,
	NEGATIVE_BULLSHARK_EXPRESSIONS,
} from '@suigar/suifrens-display-system/expressions';
import { SuiFrenImage } from '@suigar/suifrens-display-system/image';
```

The `/image` entry uses cacheable external SVG assets for accessories. If you need fully self-contained SVG markup (for example, for server-side SVG export), use the compatibility entry:

```ts
import { SuiFrenImage } from '@suigar/suifrens-display-system/image-inline';
```

The root package entry still works, but it intentionally exposes the full public API and is heavier for bundlers to analyze.

### Athletics outfits

`buildRunnerAccessories({ color: '#ec7da6', number: 3 })` from the root or `/accessories` export supplies a native singlet, shorts, headband and running shoes for capys and bullsharks. Colors accept six-digit hex values and bibs accept integers 1–99; invalid inputs use safe defaults. Set `mirrorBib: true` when the consumer mirrors the whole character so the printed number stays readable. Shoes and shorts register each leg separately; ears and fins remain visible. Inline and asset rendering preserve the same configurable SVG geometry.

### Capy thumbs-up gesture

Pass `capyGesture="thumbsUp"` to `SuiFrenImage` (inline or asset entry) to raise the capy's near arm with an upright thumb. The native head/body, palette and canvas stay unchanged. Head-only portraits and bullsharks ignore this option; a held object takes precedence so its original grip is preserved. Direct `CapyImage` consumers use `gesture="thumbsUp"`.

### Registry distribution

During the beta, install with `pnpm add @suigar/suifrens-display-system@beta` after publication. Suigar continues to consume the historical GitHub archive throughout beta.
