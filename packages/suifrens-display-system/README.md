# `@suigar/suifrens-display-system`

React components for rendering and animating Suifrens capys and bullsharks with accessories and outfits.

The capy and bullshark renderers and their accessory artwork come from Mysten Labs' [SuiFrens Display System](https://github.com/MystenLabs/suifrens-display-system). Suigar extended it in the [Suigar fork](https://github.com/Suigar-Gaming/suifrens-display-system) with gestures, animation playback, VIP crowns, and runner and football kits. The package now lives in this SDK monorepo. Both the original project and Suigar's adaptation use the [Apache License 2.0](LICENSE).

## Installation

After the npm beta is published:

```bash
pnpm add @suigar/suifrens-display-system@beta
```

Use ESM imports and install React and React DOM `^18.2.0 || ^19.0.0` as peer dependencies. During the beta, Suigar still uses the historical GitHub archive.

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

Colors are palette keys without a leading `#`. For a bullshark, use `BullsharkAttributes` with `finStyle: 'classic'`. The color, skin and expression fields stay the same. Import `SuiFrenAppearance` from `/types` to share those fields between species.

## Rendering and animation

`SuiFrenImage` uses cacheable external SVG accessories. For standalone SVG exports, use the inline renderer, which embeds built-in VIP crowns:

```tsx
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';

<SuiFrenImageInline attributes={attributes} renderSize={240} />;
```

Both renderers accept the same props. Set `detail="head"` for a portrait and pass catalogue entries or custom `SuiFrenAccessory` objects through `accessories`. The `gesture` prop accepts `thumbs_up`, `thumbs_down` or `point`. Held objects take precedence over gestures, and gestures don't affect portraits.

For ordinary accessories, set `renderOptions.assetSrc` to replace the catalogue artwork. The inline renderer uses that source directly, so use an SVG data URL when the export needs to stand alone.

Use `AnimationPresetName` from `/types` to validate built-in preset names, for example `const preset = 'walk' satisfies AnimationPresetName`. The type is derived from both preset catalogues. APIs accepting dynamic strings remain unchanged.

Choose one animation source, `preset` or `sequence`:

```tsx
<SuiFrenImage
	attributes={attributes}
	renderSize={240}
	animation={{ preset: 'walk', playback: { iterations: 'infinite' } }}
/>
```

Omit `animation` or pass `null` for a static image. Animations play once at their original speed by default. Set `playState` to control playback and change `trigger` to restart it. The types for the other options, including `AnimationConfig` and component props, are available from `/types`.

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

The included [agent skill](skills/suifrens-display-system/SKILL.md) loads its instructions from the `main` branch of [Suigar-Gaming/agent-skills](https://github.com/Suigar-Gaming/agent-skills). To install the full skills, run `npx skills add Suigar-Gaming/agent-skills`.

## Development

From the repository root, using the Node.js version in `.node-version`:

```bash
pnpm install
pnpm --dir packages/suifrens-display-system run build
pnpm --dir packages/suifrens-display-system run test
pnpm --dir packages/suifrens-display-system run typecheck
pnpm --dir packages/suifrens-display-system run lint
```
