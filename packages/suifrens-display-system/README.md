# `@suigar/suifrens-display-system`

React components for rendering and animating Suifrens capys and bullsharks with accessories and outfits.

Mysten Labs created the original [SuiFrens Display System](https://github.com/MystenLabs/suifrens-display-system), including the original capy and bullshark renderers and their accessory artwork. Suigar adapted it in the [Suigar fork](https://github.com/Suigar-Gaming/suifrens-display-system) and now maintains this package in the SDK monorepo. Suigar added character gestures, animation playback, VIP crowns, and the runner and football kits. The original project and this adaptation use the [Apache License 2.0](LICENSE).

## Installation

After the npm beta is published:

```bash
pnpm add @suigar/suifrens-display-system@beta
```

Requires ESM imports and React and React DOM `^18.2.0 || ^19.0.0` as peer dependencies. Suigar uses the historical GitHub archive during the beta.

## Quick start

Pass the character's appearance to `SuiFrenImage`. A capy has `earShape`; a bullshark has `finStyle`.

```tsx
import { SuiFrenImage } from '@suigar/suifrens-display-system';
import type { CapyAttributes } from '@suigar/suifrens-display-system/types';

const attributes = {
	mainColor: '6FBBEE',
	secondaryColor: 'E6FBFF',
	skin: 'basic',
	expression: 'happy',
	earShape: 'default',
} satisfies CapyAttributes;

export function CapyAvatar() {
	return <SuiFrenImage attributes={attributes} renderSize={240} shadow />;
}
```

Color values are palette keys without a leading `#`. Use `BullsharkAttributes` with `finStyle: 'classic'` for a bullshark, keeping the shared color, skin and expression fields.

## Rendering and animation

`SuiFrenImage` uses cacheable external SVG accessories. For standalone SVG exports, use the inline renderer, which embeds built-in VIP crowns:

```tsx
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';

<SuiFrenImageInline attributes={attributes} renderSize={240} />;
```

Both renderers accept the same props. Use `detail="head"` for portraits, `accessories` for catalogue entries or custom `SuiFrenAccessory` objects, and `gesture` for `thumbs_up`, `thumbs_down` or `point`. Held objects take precedence over gestures; portraits are unchanged.

For ordinary accessories, `renderOptions.assetSrc` overrides catalogue artwork. The inline renderer references that source directly; use an SVG data URL for a standalone export.

Choose one animation source, `preset` or `sequence`:

```tsx
<SuiFrenImage
	attributes={attributes}
	renderSize={240}
	animation={{ preset: 'walk', playback: { iterations: 'infinite' } }}
/>
```

Omit `animation` or pass `null` for a static image. Playback defaults to one iteration at the authored speed. Set `playState` to control playback and change `trigger` to restart it. Import `AnimationConfig` and component props from `/types` for the remaining options.

## Public exports

The root exports `SuiFrenImage`, `CapyImage` and `BullsharkImage`. Import other features from their subpaths and all public types from `/types`.

| Entry point | Exports |
| --- | --- |
| `@suigar/suifrens-display-system` | External SVG image renderer and species components |
| `@suigar/suifrens-display-system/image-inline` | `SuiFrenImageInline` for inline SVG accessories |
| `@suigar/suifrens-display-system/accessories` | Accessory catalogue, slot lookup and VIP crowns |
| `@suigar/suifrens-display-system/animation` | Animation provider, hooks and preset helpers |
| `@suigar/suifrens-display-system/battle` | Battle sprite, health bar and duel script hook |
| `@suigar/suifrens-display-system/kits` | Runner and football outfit helpers |
| `@suigar/suifrens-display-system/colors` | Color palette |
| `@suigar/suifrens-display-system/attributes` | Ear gene mappings and skin values |
| `@suigar/suifrens-display-system/expressions` | Shared expression lists |
| `@suigar/suifrens-display-system/types` | Public props, attributes and configuration types |

## Documentation and agent skills

- [Migration from the 1.x GitHub archive](MIGRATION.md)
- [Changelog](CHANGELOG.md)
- [Rendering and accessories skill](https://github.com/Suigar-Gaming/agent-skills/tree/main/skills/suifrens-display)
- [Animation and duels skill](https://raw.githubusercontent.com/Suigar-Gaming/agent-skills/main/skills/suifrens-animation/SKILL.md)

The package includes [an agent skill](skills/suifrens-display-system/SKILL.md) that loads the full instructions from `main` in [Suigar-Gaming/agent-skills](https://github.com/Suigar-Gaming/agent-skills). Install the full skills with `npx skills add Suigar-Gaming/agent-skills`.

## Development

From the repository root, using the Node.js version in `.node-version`:

```bash
pnpm install
pnpm --dir packages/suifrens-display-system run build
pnpm --dir packages/suifrens-display-system run test
pnpm --dir packages/suifrens-display-system run typecheck
pnpm --dir packages/suifrens-display-system run lint
```

The build regenerates accessory assets with SVGO. Its plugins select the groups used for limb animation, prefix IDs and CSS references, and serialize each part as a symbol.
