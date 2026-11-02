# Workspace agent instructions

These instructions apply throughout the repository. Scoped instructions add package-specific rules; read the relevant file before editing that package. Commands below run from the repository root.

## Workspace and instruction map

This private pnpm workspace contains two ESM-only publishable packages and a local integration app:

- [`packages/sdk/AGENTS.md`](packages/sdk/AGENTS.md): `@suigar/sdk`, public SDK APIs, transaction builders, generated Move bindings, configuration, and SDK tests.
- [`packages/mcp/AGENTS.md`](packages/mcp/AGENTS.md): `@suigar/mcp`, stdio protocol, tools, wallet bridges, inspector App, and MCP tests.
- [`playground/AGENTS.md`](playground/AGENTS.md): private `@suigar/sdk-playground` Next.js integration app.

Shared dependencies and catalogs live in `pnpm-workspace.yaml`; shared compiler options live in `tsconfig.shared.json`. Package source, scripts, and tests live under their own workspace directory. `dist/` contains generated build output. Do not copy package-specific instructions into this file.

Each instruction directory has a relative `CLAUDE.md -> AGENTS.md` symlink. Update the corresponding `AGENTS.md` rather than creating a separate copy of its instructions.

## Workspace commands

```bash
pnpm install
pnpm run lint
pnpm run lint:fix
pnpm run changeset
pnpm run changeset:version
pnpm run release
```

Use each package's scoped instructions for build, code generation, tests, and typechecks.

## Shared testing conventions

- Both packages use Vitest 5 in the Node.js environment. Run tests through the package scripts or from the package root so its Vitest config is loaded. For `-t` filters, match an individual test name or use `.*` between suite and test names.
- Add regression coverage near the affected behavior. Check observable results, argument normalization, configuration overrides, and actionable failures where relevant. Transaction tests should cover the applicable game or action and its generated contract-call arguments; keep standard and PvP flows separate.
- Reuse nearby test fixtures and helpers. Mock external services and generated contract boundaries where needed, while exercising the package's own behavior. Keep tests independent of live networks and real wallet credentials; wallet bridge tests may use local loopback servers and temporary storage.
- Vitest clears mock call history before each test by default. Reset mock implementations, module state, environment variables, timers, and resources explicitly when a test changes them; clearing call history does not reset those. Keep `vi.mock`, `vi.unmock`, and `vi.hoisted` at module scope, and use `vi.doMock` for runtime mocking. Await asynchronous assertions.
- Run tests and typechecks for every affected package. Package-specific test typechecks and fixtures are documented in the scoped instructions.

## Release and contribution workflow

### Changeset Conventions

- **`patch`**: Bug fixes or internal corrections that do not change the public API shape
- **`minor`**: New public methods, new supported fields, or additive public type changes
- **`major`**: Breaking API changes, changed behavior contracts, or removed support
- Changeset notes must describe only package behavior for the packages listed in the changeset frontmatter. Do not mention root-only, workspace-only, playground-only, or tooling-only changes unless they directly affect that package's published behavior.
- Do not edit changeset files inherited from `main` or unrelated previous work. Reuse a changeset on the current branch only when its package scope and topic match the new change; otherwise create a separate changeset.
- Split changesets by topic and by package when the changes differ. Dependency updates and type-safety changes require separate release notes. Use a package-specific changeset when the implementation or user-facing impact differs between libraries; list multiple packages together only when the same note accurately describes the same change for all of them.
- Keep each changeset focused on one coherent release note, with the release level appropriate to each listed package. Across all branch changesets, cover every publishable package with source changes anywhere on the branch, including earlier work. Do not combine unrelated notes merely to keep one changeset per branch.

### Development Workflow

1. Update or add code in the relevant package under `packages/*/src/`
2. If the branch modifies source files under any publishable package, ensure its `.changeset/*.md` files collectively cover every publishable package changed anywhere on the branch
3. Reuse an existing branch changeset for the same package scope and topic; create a separate changeset for a different topic or package-specific change, following the conventions above
4. When SDK contract bindings or generated SDK sources change, regenerate them with `pnpm --dir packages/sdk run codegen`; otherwise run any generation required by each changed package
5. Run tests for every changed package, for example `pnpm --dir packages/sdk run test` or `pnpm --dir packages/mcp run test`
6. Run type checking for every changed package, for example `pnpm --dir packages/sdk run typecheck` or `pnpm --dir packages/mcp run typecheck`
7. Add or update the matching branch changeset when user-visible package behavior changes, keeping each note scoped to one topic and the package or packages listed in its frontmatter

Documentation is part of the deliverable:

- When publishable-package behavior, public types, generated bindings, examples, or integration guidance change, update the relevant documentation in the same task without waiting for an extra prompt.
- At minimum, review root `README.md`, the changed package's README where present, `AGENTS.md`, the relevant Suigar skills in `Suigar-Gaming/agent-skills`, and any other user-facing markdown that describes the changed behavior.
- Treat skill updates as automatic follow-up work when their guidance overlaps the changed SDK behavior; do not wait for the user to ask explicitly.
- If constants, helper locations, or public utility exports move, update docs and examples to use the public import path instead of internal file paths or copied values.
- If generated bindings or public runtime ergonomics change, make sure examples and event-decoding guidance stay aligned with the current generated API.
- If installation or client setup guidance changes, keep examples aligned with the current APIs such as `@mysten/sui/grpc`, explicit `network`, and ESM-only package requirements.

## AI Skills

Suigar agent skills live in the separate `Suigar-Gaming/agent-skills` repository.

Install the skills for an agent with the skills CLI:

```bash
npx skills add Suigar-Gaming/agent-skills
```

Install a single skill when only one workflow is needed:

```bash
npx skills add Suigar-Gaming/agent-skills --skill suigar-mcp
```

For Codex-specific installs, add the Codex agent flag without replacing the generic install commands above:

```bash
npx skills add Suigar-Gaming/agent-skills --agent codex --global --yes
```

```bash
npx skills add Suigar-Gaming/agent-skills --skill suigar-mcp --agent codex --global --yes
```

Use these Suigar skills when the task is about building a product on top of this SDK:

- `installation` for SDK setup, client extension wiring, and config
- `suigar-mcp` for installing, configuring, and operating the `@suigar/mcp` server and MCP App
- `create-standard-games` for standard game transactions
- `create-pvp-games` for PvP game flows
- `find-skills` to discover installable external skills when users ask for capabilities or workflows that may already exist

## Pull Requests

When creating a PR:

- Summarize the SDK or transaction behavior change clearly
- If the branch modifies source files under any publishable package, make sure its `.changeset/*.md` files cover every changed publishable package, with separate notes for distinct topics and package-specific changes. Reuse a branch changeset only when its package scope and topic match
- PRs that change publishable-package source files without a changeset are expected to fail merge checks and receive a PR comment
- Mention whether generated bindings changed
- Include tests run
- If the PR was primarily written by AI, mark that in the PR description
