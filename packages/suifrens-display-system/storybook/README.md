# Suifrens Storybook

Try characters, accessories and outfits in Storybook. The story controls let you change gestures and animations.

## Setup

Run these commands from the repository root with the Node.js version in `.node-version` and the pnpm version in the root `package.json`:

```bash
pnpm install
pnpm --dir packages/suifrens-display-system run build
pnpm --filter @suigar/suifrens-storybook dev
```

Open [http://localhost:6006](http://localhost:6006). If Storybook is already running there, use that instance.

Storybook uses the library's built public exports. Rebuild the library after editing its source to update the preview.

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

Run every test project with coverage:

```bash
pnpm --filter @suigar/suifrens-storybook test:coverage
```

Open the coverage report at `packages/suifrens-display-system/storybook/coverage/index.html`.

See the [package README](../README.md) for the rendering API and public exports.
