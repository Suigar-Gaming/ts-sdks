# Suifrens Display System

Preserve the documented public entry points, both species, React 18.2 and 19 refs, and inline and external SVG rendering. Regenerate assets through the package build. Storybook controls live under `storybook/`, alongside `src/` and `test/`. The Fastify server lives under `examples/fastify/`. Both use public package exports.

Use kebab-case filenames for non-component modules and PascalCase for React components.

Group shared types by domain in `src/types/*.type.ts`. Keep the public `/types` exports in `src/types/index.ts`. Component-specific private types may sit directly below the imports.

Include a changeset for consumer-visible changes. Before committing, pushing or opening a PR, present the package contents, checks and renders for explicit owner approval of the current revision and scope. For visual changes include both enlarged and consumer-size renders.

Run the package build, tests, typecheck and example builds described in the CI workflow. Version the package through Changesets.
