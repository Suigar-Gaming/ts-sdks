# Migrating from the 1.x GitHub archive

Update the imports and props your application uses. See the [README](README.md) for installation and current usage.

## Installation and module format

After the beta is published, replace the GitHub archive dependency with the npm beta:

```bash
pnpm add @suigar/suifrens-display-system@beta
```

The package is ESM-only, so replace CommonJS `require` calls with `import`. React and React DOM remain peer dependencies, with support for React 18.2 and 19.

## Public imports and entry points

The root now exports only `SuiFrenImage`, `CapyImage` and `BullsharkImage`. Move other former root imports to their public subpaths, and use `/types` for all type-only imports. Do not import files from `src/` or `dist/` directly.

Before:

```ts
import { SuiFrenImage, accessories, colors } from '@suigar/suifrens-display-system';
```

After:

```ts
import { SuiFrenImage } from '@suigar/suifrens-display-system';
import { ACCESSORIES } from '@suigar/suifrens-display-system/accessories';
import { COLORS } from '@suigar/suifrens-display-system/colors';
import type { SuiFrenImageProps } from '@suigar/suifrens-display-system/types';
```

| Feature                                         | Current entry point |
| ----------------------------------------------- | ------------------- |
| External SVG renderer and species renderers     | Root package        |
| Self-contained inline renderer                  | `/image-inline`     |
| Accessory catalogue, slot lookup and VIP crowns | `/accessories`      |
| Runner and football outfit helpers              | `/kits`             |
| Animation provider, hooks and preset helpers    | `/animation`        |
| Battle components and duel hooks                | `/battle`           |
| Palette                                         | `/colors`           |
| Gene mappings and skin values                   | `/attributes`       |
| Expression lists                                | `/expressions`      |
| All public types                                | `/types`            |

The former `/vip-crowns` entry point is replaced by `/accessories`. The `/battle` and `/expressions` entry points remain available for runtime exports; import their types from `/types`.

## Export naming

Data constants and catalogues use `UPPER_SNAKE_CASE`. Functions and hooks use `camelCase`; components and types use `PascalCase`.

| Previous export       | Replacement             | Entry point    |
| --------------------- | ----------------------- | -------------- |
| `colors`              | `COLORS`                | `/colors`      |
| `accessories`         | `ACCESSORIES`           | `/accessories` |
| `vipCrownAccessories` | `VIP_CROWN_ACCESSORIES` | `/accessories` |
| `earGeneToEarShape`   | `EAR_GENE_TO_EAR_SHAPE` | `/attributes`  |

Component prop names such as `accessories` remain unchanged.

## External and inline SVG renderers

The root `SuiFrenImage` now uses cacheable external SVG accessories. Replace imports of `SuiFrenImage` from `/image-assets` with `SuiFrenImage` from the root:

```ts
import { SuiFrenImage } from '@suigar/suifrens-display-system';
```

If you used the previous root renderer for self-contained SVG markup, switch to the inline renderer for server-side SVG exports and consumers that cannot fetch external accessory assets:

```ts
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
```

## Color literals and palette keys

Use lowercase hexadecimal colors, with or without a leading `#`. Palette keys and typed appearance colors are lowercase: for example, replace `'6FBBEE'` with `'6fbbee'` and `'E6FBFF'` with `'e6fbff'`. Normalize stored or external palette keys before validating against `COLORS`. The Fastify example accepts either case and normalizes appearance colors to lowercase. Data export names such as `COLORS` remain uppercase.

## Species, skins and expression types

Replace the `SuiFrenType` enum with the `SuiFrenSpecies` string union from `/types`:

| Previous value          | Replacement   |
| ----------------------- | ------------- |
| `SuiFrenType.CAPY`      | `'capy'`      |
| `SuiFrenType.BULLSHARK` | `'bullshark'` |

```ts
import type { SuiFrenSpecies } from '@suigar/suifrens-display-system/types';

const species: SuiFrenSpecies = 'capy';
```

Import the shared `SuiFrenSkin` and `SuiFrenExpression` types from `/types` in place of species-specific types. Keep `earShape` on capy attributes and `finStyle` on bullshark attributes.

Use `SUIFREN_SKINS` from `/attributes` for skin values. Import `ALL_EXPRESSIONS`, `POSITIVE_EXPRESSIONS` and `NEGATIVE_EXPRESSIONS` from `/expressions` for expression lists.

## Animation configuration

Move top-level animation options into the `animation` prop on both image renderers:

| Previous prop             | New location               |
| ------------------------- | -------------------------- |
| `animationPreset`         | `animation.preset`         |
| `animationSequence`       | `animation.sequence`       |
| `animationPlayback`       | `animation.playback`       |
| `animationPlayState`      | `animation.playState`      |
| `animationDirection`      | `animation.direction`      |
| `animationTrigger`        | `animation.trigger`        |
| `animationStartAt`        | `animation.startAt`        |
| `animationHoldOnComplete` | `animation.holdOnComplete` |

Before:

```tsx
<SuiFrenImage attributes={attributes} animationPreset="walk" animationPlayback={{ loop: true }} />
```

After:

```tsx
<SuiFrenImage
	attributes={attributes}
	animation={{ preset: 'walk', playback: { iterations: 'infinite' } }}
/>
```

If you already use the `animation` object, keep it and apply the playback renames below. Replace the former top-level `animationAutoPlay={false}` with `animation.playState: 'idle'`.

Select exactly one source: `preset` or `sequence`. To use your own sequence, pass `animation={{ sequence }}`. Omit `animation` or pass `null` for a static image.

## Playback state and iteration counts

`autoPlay` and `playback.loop` are removed. Update existing animation configurations:

| Previous option        | Replacement                          |
| ---------------------- | ------------------------------------ |
| `autoPlay: false`      | `playState: 'idle'`                  |
| `autoPlay: true`       | Omit `playState` to start by default |
| `playback.loop: true`  | `playback.iterations: 'infinite'`    |
| `playback.loop: count` | `playback.iterations: count`         |
| `playback.loop: false` | `playback.iterations: 1`, or omit it |

An iteration is one directional pass. `alternate: true` reverses direction on every other iteration. Keep `speed` and `alternate` inside `playback`.

```tsx
<SuiFrenImage
	attributes={attributes}
	animation={{
		preset: 'walk',
		playState: 'idle',
		playback: { iterations: 2, alternate: true, speed: 1 },
	}}
/>
```

## Duel attack and victory steps

In attack steps, put the acting fighter's settings in `attacker` and the impact settings in `target`. The target is always the fighter opposite `attacker.side`; remove the old explicit target side.

| Previous attack field | Replacement           |
| --------------------- | --------------------- |
| `attacker`            | `attacker.side`       |
| `preset`              | `attacker.preset`     |
| `attackerExpression`  | `attacker.expression` |
| `damage`              | `target.damage`       |
| `hitPreset`           | `target.preset`       |
| `hitDelayMs`          | `target.delayMs`      |
| `targetExpression`    | `target.expression`   |
| `afterMs`             | Remains on the step   |

Before:

```ts
const attack = {
	type: 'attack',
	label: 'Left punches',
	attacker: 'left',
	preset: 'punch',
	attackerExpression: 'angry',
	target: 'right',
	damage: 2,
	hitPreset: 'hit',
	hitDelayMs: 140,
};
```

After:

```ts
import type { DuelAttackStep } from '@suigar/suifrens-display-system/types';

const attack = {
	type: 'attack',
	label: 'Left punches',
	attacker: { side: 'left', preset: 'punch', expression: 'angry' },
	target: { damage: 2, preset: 'hit', delayMs: 140 },
} satisfies DuelAttackStep;
```

For victory steps, rename `loops` to `iterations`. The default remains five iterations. The delay after the step remains `afterMs`.

## Shared gesture prop

Rename `capyGesture` to `gesture` and the value `'thumbsUp'` to `'thumbs_up'`:

```tsx
// Before
<SuiFrenImage attributes={attributes} capyGesture="thumbsUp" />

// After
<SuiFrenImage attributes={attributes} gesture="thumbs_up" />
```

Both species, the inline renderer and the direct `CapyImage` and `BullsharkImage` components accept this prop. Import `SuiFrenGesture` from `/types`. A held object takes precedence over the gesture; head portraits are unchanged.

## Accessory asset overrides

For ordinary accessories, an explicit `renderOptions.assetSrc` now overrides catalogue artwork in both renderers. Review custom accessories that previously depended on the catalogue ignoring that override.

The inline renderer references the supplied source directly. Use a self-contained SVG data URL for that source when exporting standalone markup; a remote URL still requires a fetch by the consumer.

## Runner and football outfit configuration

Outfit settings now belong in `renderOptions.kit`, with a type that identifies the outfit. Replace `renderOptions.runnerKit` with `renderOptions.kit`, adding `type: 'runner'`:

```ts
// Before
const renderOptions = {
	runnerKit: { color: '#ec7da6', number: 3, mirrorBib: true },
};

// After
const renderOptions = {
	kit: { type: 'runner', color: '#ec7da6', number: 3, mirrorBib: true },
};
```

For football, use `kit: { type: 'soccer', country: 'FR', side: 'away' }`, or supply a custom `team` in place of `country`. Select either `country` or `team`.

Import the public `AccessoryKit` type from `/types`. Runner helpers such as `buildRunnerAccessories` and `resolveRunnerKit` move from `/accessories` to `/kits`:

```ts
import { buildRunnerAccessories } from '@suigar/suifrens-display-system/kits';

const accessories = buildRunnerAccessories({ color: '#ec7da6', number: 3 });
```

## VIP crown names

Update stored crown names and catalogue lookups to use numeric tiers: for example, `bronze-i` becomes `bronze-1` and `platinium-ii` becomes `platinum-2`. Bronze, silver, gold, platinum and diamond have tiers 1 to 3. Master has tiers 1 to 2. The final crown is `legend`.

## Check your application

Run your application's typecheck and build. Check both species in each renderer you use: static images, animation playback, custom accessories and exported SVGs. For duels, check damage timing and victory iteration counts.
