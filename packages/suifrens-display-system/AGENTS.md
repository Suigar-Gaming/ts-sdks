# Suifrens agent instructions

Read the [workspace instructions](../../AGENTS.md) too. These rules apply to `packages/suifrens-display-system/`. Run commands from the repository root.

## Build and checks

`@suigar/suifrens-display-system` is an ESM-only React library. `tsdown` builds public entry points, declarations and SVG assets into `dist/`.

```bash
# Regenerate accessory assets and build
pnpm --dir packages/suifrens-display-system run build
# Build without regeneration
pnpm --dir packages/suifrens-display-system run build:ci
# Regenerate accessory assets only
pnpm --dir packages/suifrens-display-system run codegen
# Run after building: distribution tests import dist/
pnpm --dir packages/suifrens-display-system run test
pnpm --dir packages/suifrens-display-system run typecheck
pnpm --dir packages/suifrens-display-system run lint
# Check Storybook and examples with their package dependency
pnpm turbo run build test typecheck --filter='./packages/suifrens-display-system/examples/*' --filter='./packages/suifrens-display-system/storybook'
# Focused test
pnpm --dir packages/suifrens-display-system exec vitest run test/unit/components/capy/gestures.test.tsx
```

Documentation-only edits need formatting and diff checks.

## Source and compatibility

- Preserve public root and subpath exports, including `CapyImage` and `BullsharkImage` at the root.
- Check both species, React 18.2 and 19 refs, and inline and external SVG rendering. Cover public props, types, animations and asset URLs.
- Edit authored sources and regenerate assets with the package scripts. Do not hand-edit `dist/` or copy compiled files into consumers.
- Keep Storybook and the Fastify example using built public exports.
- Use PascalCase for React component filenames and kebab-case for other modules.
- Put shared types in `src/types/*.type.ts` and public exports in `src/types/index.ts`. Keep types used by one component below its imports.
- Keep character patterns and gestures in `src/components/shared/`; species shapes and pattern selection belong in `src/components/capy/` and `src/components/bullshark/`.
- Edit accessory artwork in `src/accessories/artwork/`. Single-layer assets use one SVG; layered assets use a folder with `default.svg` and optional `body.svg`, `left.svg` and `right.svg`. Crowns have their own viewport; kits use SVG templates. Regenerate `src/generated/` with `codegen` after artwork changes.
- Accessory codegen runs directly with Node and uses [SVGO](https://github.com/svg/svgo). Preserve IDs and group boundaries until limb extraction; plugins such as `cleanupIds` and `collapseGroups` can break that step. Use SVGO visitors to select groups and create symbols, and `prefixIds` for IDs, CSS and references. Keep SVG processing in the generator rather than importing runtime helpers from `src/` or manipulating XML with regular expressions.

## Tests and visual review

Keep behavior tests in `test/unit/` and compiled export, declaration and asset checks in `test/distribution/`. The package typecheck covers source, scripts and tests. Run the checks above for implementation changes, including Storybook and examples.

Show visual changes enlarged and at the size consumers will display them.

Storybook controls must affect the preview. Use `satisfies Meta<typeof Component>` and `StoryObj<typeof meta>` for component props, custom argument types for species previews, and `satisfies Meta` without a component for fixed demos. Hide Controls for fixed demos and catalogue docs.

For browser tests, install Chromium with `pnpm --filter @suigar/suifrens-storybook exec playwright install --only-shell chromium`. Run interactions and accessibility checks from the testing widget, or `pnpm --filter @suigar/suifrens-storybook test:coverage` for the full suite, including portrait screenshots. Coverage is in `storybook/coverage/index.html`.

## Release

Follow the workspace changeset and PR rules. Consumer-visible changes need an `@suigar/suifrens-display-system` changeset, with one topic per note. Version through the workspace Changesets workflow.

Before committing, pushing or opening a PR, present the package contents, check results and relevant renders for explicit owner approval of the current revision and scope.
