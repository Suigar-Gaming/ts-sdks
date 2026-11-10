# Suifrens agent instructions

Applies to `packages/suifrens-display-system/` and its descendants, in addition to the [workspace instructions](../../AGENTS.md). Commands below run from the repository root. Source paths below are repository-relative.

## Package structure and commands

`@suigar/suifrens-display-system` is an ESM-only React library for rendering and animating capys and bullsharks. `tsdown` writes the built public entry points, declarations and SVG assets to `packages/suifrens-display-system/dist/`.

- `src/components/`: species renderers and shared visual components.
- `src/image-inline/`: inline SVG renderer.
- `src/accessories/`: accessory definitions and artwork.
- `src/animation/`, `src/battle/`, `src/expressions/` and `src/kits/`: animation and appearance APIs.
- `src/types/`: shared types grouped by domain, with public exports in `src/types/index.ts`.
- `scripts/`: accessory asset generation.
- `test/`: unit and distribution tests.
- `storybook/`: private Storybook workspace, controls and interaction tests.
- `examples/fastify/`: private rendering server example.

```bash
# Regenerate accessory assets and build
pnpm --dir packages/suifrens-display-system run build
# Build without regeneration
pnpm --dir packages/suifrens-display-system run build:ci
# Regenerate accessory assets only
pnpm --dir packages/suifrens-display-system run codegen
# Validation, after building the package
pnpm --dir packages/suifrens-display-system run test
pnpm --dir packages/suifrens-display-system run typecheck
pnpm --dir packages/suifrens-display-system run lint
# Validate Storybook and the examples, including their package dependency
pnpm turbo run build test typecheck --filter='./packages/suifrens-display-system/examples/*' --filter='./packages/suifrens-display-system/storybook'
# Focused tests
pnpm --dir packages/suifrens-display-system exec vitest run test/unit/components/capy/gestures.test.tsx
```

## Public API and rendering compatibility

- Preserve the documented root and subpath exports. Keep the historical `CapyImage` and `BullsharkImage` root exports available.
- Check changes against both species, React 18.2 and 19 refs, and inline and external SVG rendering. Compatibility includes public props, types, animation behavior and emitted asset URLs.
- Edit authored sources and regenerate accessory assets through the package scripts. Do not hand-edit `dist/` or copy compiled files into consumers.
- Storybook and the Fastify example use public package exports. Keep them working as consumers of the built package.

## Source conventions

- Use kebab-case filenames for non-component modules and PascalCase for React components.
- Group shared types by domain in `src/types/*.type.ts` and expose public types through `src/types/index.ts`. Keep private types used by only one component directly below its imports.

## Tests and visual review

- Keep regression tests near the affected behavior under `test/unit/`. Use `test/distribution/` to check compiled exports, declarations and emitted assets.
- Build before running the full package test suite: distribution tests import the compiled package. The package typecheck checks source, scripts and tests.
- Follow the workspace testing conventions and run the package checks above for implementation changes. Validate Storybook and the examples with the CI command above. Documentation-only edits need formatting and diff checks.
- For visual changes, show the owner renders both enlarged and at the size consumers will display them.

## Review and release

Follow the workspace rules for changesets, documentation and PRs. Add an `@suigar/suifrens-display-system` changeset for consumer-visible changes, with each note covering one topic. Use the workspace Changesets workflow to version the package.

Before committing, pushing or opening a PR, present the package contents, check results and relevant renders for explicit owner approval of the current revision and scope.
