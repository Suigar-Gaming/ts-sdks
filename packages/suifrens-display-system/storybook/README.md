# Suifrens Storybook

Use Storybook to try characters, accessories and outfits, and adjust gestures and animations with the story controls.

## Setup

From the repository root, using the Node.js version in `.node-version` and pnpm version in the root `package.json`:

```bash
pnpm install
pnpm --dir packages/suifrens-display-system run build
pnpm --filter @suigar/suifrens-storybook dev
```

Open [http://localhost:6006](http://localhost:6006). If Storybook is already running there, use that instance.

Storybook loads the library through its public exports from the build output. Rebuild the library after editing its source to see your changes.

## Static build

```bash
pnpm --filter @suigar/suifrens-storybook build
```

The build writes the static site to `packages/suifrens-display-system/storybook/storybook-static/`.

## Checks

Run the typecheck and unit tests:

```bash
pnpm --filter @suigar/suifrens-storybook typecheck
pnpm --filter @suigar/suifrens-storybook test
```

Install Chromium before running browser tests:

```bash
pnpm --filter @suigar/suifrens-storybook exec playwright install --only-shell chromium
pnpm --filter @suigar/suifrens-storybook test:stories
pnpm --filter @suigar/suifrens-storybook test:visual
```

To run all test projects and collect coverage:

```bash
pnpm --filter @suigar/suifrens-storybook test:coverage
```

Open the coverage report at `packages/suifrens-display-system/storybook/coverage/index.html`.

See the [package README](../README.md) for the rendering API and public exports.
