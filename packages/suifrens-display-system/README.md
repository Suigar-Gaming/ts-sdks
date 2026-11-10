# `@suigar/suifrens-display-system`

React components for rendering and animating Suifrens capys and bullsharks, with accessories, gestures and configurable outfits.

## Agent skills

The npm package includes a lightweight agent skill at `skills/suifrens-display-system/SKILL.md`. It routes matching tasks to full instructions in [Suigar-Gaming/agent-skills](https://github.com/Suigar-Gaming/agent-skills) on `main`. Linked references are fetched only when needed.

You can also install the full skills with `npx skills add Suigar-Gaming/agent-skills`.

## Documentation

See the [migration guide](MIGRATION.md) when upgrading from the 1.x GitHub archive, and the [changelog](CHANGELOG.md) for released changes. Storybook includes controls and examples for both species; see [Development](#development) to run it locally.

## Installation

After the npm beta is published, install it with:

```bash
pnpm add @suigar/suifrens-display-system@beta
```

Requirements:

- React and React DOM `^18.2.0 || ^19.0.0`
- ESM imports

React and React DOM are peer dependencies. Suigar continues to consume the historical GitHub archive during the beta.

## Public exports

The root exports `SuiFrenImage`, `CapyImage` and `BullsharkImage`. Import other features from their public subpaths and all types from `/types`.

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

```ts
import { SuiFrenImage } from '@suigar/suifrens-display-system';
import { accessories } from '@suigar/suifrens-display-system/accessories';
import { earGeneToEarShape } from '@suigar/suifrens-display-system/attributes';
import { colors } from '@suigar/suifrens-display-system/colors';
import {
	POSITIVE_EXPRESSIONS,
	NEGATIVE_EXPRESSIONS,
} from '@suigar/suifrens-display-system/expressions';
import type { CapyAttributes } from '@suigar/suifrens-display-system/types';
```

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

## Rendering

`SuiFrenImage` uses cacheable external SVG assets for accessories. For self-contained SVG markup, such as a server-side SVG export, use `SuiFrenImageInline`:

```tsx
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';

<SuiFrenImageInline attributes={attributes} renderSize={240} />;
```

Built-in VIP crowns are embedded in the inline SVG and can be exported with the character as one file. Both image renderers accept the same props. The examples below reuse `attributes` from the quick start.

| Prop                 | Usage                                                                     |
| -------------------- | ------------------------------------------------------------------------- |
| `attributes`         | Required character appearance                                             |
| `accessories`        | Array of accessory metadata                                               |
| `detail`             | `'full'` (default) or `'head'`                                            |
| `renderSize`         | Square size as a number, or `{ width, height }`                           |
| `shadow`             | Draw a shadow below the character; defaults to `false`                    |
| `gesture`            | Static hand pose                                                          |
| `animation`          | Preset or custom sequence with playback settings; omit for a static image |
| `incognito`          | Render the character in incognito mode; defaults to `false`               |
| `logo`               | Custom React content rendered in the SVG                                  |
| `className`, `style` | Styling for the outer SVG                                                 |

Use `CapyImage` or `BullsharkImage` directly when composing your own SVG. Their props are available as `CapyImageProps` and `BullsharkImageProps` from `/types`.

## Animation

Choose a preset or a custom sequence through the `animation` prop:

```tsx
<SuiFrenImage
	attributes={attributes}
	renderSize={240}
	animation={{ preset: 'walk', playback: { iterations: 'infinite' } }}
/>
```

Select exactly one source: `preset` or `sequence`. Pass a custom `AnimationSequence` as `animation={{ sequence }}`. Omit `animation` or pass `null` for a static image.

Playback defaults to one iteration at the authored speed. Set `playback.iterations` to a count or `'infinite'`, `playback.speed` to a speed multiplier, and `playback.alternate` to reverse direction on every other iteration.

Use `playState` to control playback and change `trigger` to restart it. `direction`, `startAt`, `holdOnComplete` and `transitionMs` control direction, resting position, the final pose and blending between animations. These options all belong inside `animation`.

For custom animated components, import `AnimationProvider`, `AnimatedAccessory` and the animation hooks from `/animation`.

## Accessories and outfits

Pass selected catalogue entries or your own `SuiFrenAccessory` objects (from `/types`) through `accessories`:

```tsx
import { accessories } from '@suigar/suifrens-display-system/accessories';

const hats = accessories.filter((accessory) => accessory.name === 'baseball cap');

<SuiFrenImage attributes={attributes} accessories={hats} renderSize={240} />;
```

The `/accessories` entry point also exports `vipCrownAccessories`, `VIP_CROWN_ACCESSORY_NAMES` and `getAccessoriesByType` for slot lookup. VIP crown names use numbered ranks such as `bronze-1` and `platinum-3`; the final rank is `legend`. A missing slot returns `undefined`. Custom accessories need only `name`, `type`, `category` and `renderOptions`. Catalogue entries also include price, quantity, description and collection.

For ordinary accessories, `renderOptions.assetSrc` overrides the catalogue artwork in both renderers. The inline renderer references that source directly, so use a self-contained SVG data URL when exporting standalone markup.

### Runner outfits

```tsx
import { buildRunnerAccessories } from '@suigar/suifrens-display-system/kits';

const runnerAccessories = buildRunnerAccessories({ color: '#ec7da6', number: 3 });

<SuiFrenImage attributes={attributes} accessories={runnerAccessories} renderSize={240} />;
```

The helper creates a singlet, numbered bib, shorts, headband and running shoes for either species. Colors accept six-digit hex values and bibs accept integers 1 to 99. Invalid inputs use safe defaults.

Set `mirrorBib: true` if your application mirrors the whole character to keep the number readable. Shoes and shorts animate with each leg separately, while ears and fins stay visible. Inline and external SVG renderers use the same configurable geometry.

### Football outfits

The `/kits` entry point exports `SOCCER_TEAM_KITS`, `resolveSoccerCountryCode` and `resolveSoccerTeamKit`. Custom accessory metadata uses `renderOptions.kit` with `type: 'soccer'` and either a `country` or a custom `team`. For example, `kit: { type: 'soccer', country: 'FR', side: 'away' }` selects France's away kit. Import `AccessoryKit` from `/types` for the configuration type.

## Gestures

Use `gesture` for a static pose on either image renderer or directly on `CapyImage` and `BullsharkImage`:

```tsx
<SuiFrenImage attributes={attributes} gesture="thumbs_up" renderSize={240} />
```

Available values are `thumbs_up`, `thumbs_down` and `point`. Import `SuiFrenGesture` from `/types`.

Full-body capys and bullsharks pose their near arm when the hand is free. A held object keeps its native grip and takes precedence over the gesture. Head portraits are unchanged.

## Battle components

Import `SuiFrenBattleSprite`, `MinecraftHealthBar` and `useDuelScript` from `/battle`. The sprite combines a character with health display, while the hook runs scripts containing wait, pose, attack, death and victory steps. Public battle props and duel script types are available from `/types`.

## Development

Run these commands from the repository root. Use the workspace's Node.js version from `.node-version`.

```bash
pnpm install
pnpm --dir packages/suifrens-display-system run build
pnpm --dir packages/suifrens-display-system run test
pnpm --dir packages/suifrens-display-system run typecheck
pnpm --dir packages/suifrens-display-system run lint
```

Build without regenerating accessory assets:

```bash
pnpm --dir packages/suifrens-display-system run build:ci
```

### Storybook and Fastify example

Storybook lives in `storybook/`, alongside `src/` and `test/`. After building the library, run:

```bash
pnpm --filter @suigar/suifrens-storybook dev
```

The HTTP rendering server lives in `examples/fastify/`:

```bash
pnpm --filter @suigar/suifrens-fastify dev
```

Before fetching accessories, the Fastify SVG route validates the skin, palette colors, expression and species trait in the decoded on-chain attributes. It returns HTTP 500 for an invalid appearance and ignores extra trailing attributes.

### Character and accessory artwork

Both species use the SVG patterns in `src/components/shared/`, grouped by body part alongside shared gestures. Species-specific shapes and pattern selection remain in `src/components/capy/` and `src/components/bullshark/`.

Edit accessory SVGs in `src/accessories/artwork/`. Single-layer accessories use their own filename, such as `baseball-cap.svg`. For accessories with multiple layers, a folder contains `default.svg` for the base drawing and optional `body.svg`, `left.svg` and `right.svg` files for layers that animate separately. Crowns have their own viewport. Running and football kits use SVG templates for their colors, lettering and patterns.

Regenerate the import lists and external SVG symbols in `src/generated/` after editing artwork:

```bash
pnpm --dir packages/suifrens-display-system run codegen
```
