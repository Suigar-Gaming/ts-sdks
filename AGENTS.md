# Workspace agent instructions

These rules apply across the repository. Before editing a package, read its scoped instructions too. Run the commands below from the repository root.

## Workspace and instruction map

This private pnpm workspace contains three ESM-only publishable packages, a local integration app, a private Storybook workspace and a private Fastify example:

- [`packages/sdk/AGENTS.md`](packages/sdk/AGENTS.md): `@suigar/sdk`, public SDK APIs, transaction builders, generated Move bindings, configuration, and SDK tests.
- [`packages/mcp/AGENTS.md`](packages/mcp/AGENTS.md): `@suigar/mcp`, stdio protocol, tools, wallet bridges, inspector App, and MCP tests.
- [`packages/suifrens-display-system/AGENTS.md`](packages/suifrens-display-system/AGENTS.md): display rendering, compatibility and release validation.
- [`playground/AGENTS.md`](playground/AGENTS.md): private `@suigar/sdk-playground` Next.js integration app.

Shared dependencies and catalogs are in `pnpm-workspace.yaml`, and shared compiler options are in `tsconfig.shared.json`. Each workspace has its own source, scripts and tests. Build output goes in `dist/`. Keep package-specific instructions in that package's file.

Each instruction directory has a relative `CLAUDE.md -> AGENTS.md` symlink. Edit the corresponding `AGENTS.md`; do not create a separate copy of its instructions.

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

- The packages use Vitest 5 in the Node.js environment. Run tests through the package scripts or from the package root so its Vitest config is loaded. For `-t` filters, match an individual test name or use `.*` between suite and test names.
- Add regression coverage near the affected behavior. Check observable results, argument normalization, configuration overrides, and actionable failures where relevant. Transaction tests should cover the applicable game or action and its generated contract-call arguments; keep standard and PvP flows separate.
- Reuse nearby test fixtures and helpers. Mock external services and generated contract boundaries where needed, but exercise the package's own behavior. Keep tests independent of live networks and real wallet credentials; wallet bridge tests may use local loopback servers and temporary storage.
- Vitest clears mock call history before each test by default. If a test changes mock implementations, module state, environment variables, timers or resources, reset them explicitly. Clearing call history does not reset them. Keep `vi.mock`, `vi.unmock`, and `vi.hoisted` at module scope, and use `vi.doMock` for runtime mocking. Await asynchronous assertions.
- Run tests and typechecks for every affected package. Package-specific test typechecks and fixtures are documented in the scoped instructions.

## Release and contribution workflow

### Changeset conventions

- `patch`: Bug fixes or internal corrections that do not change the public API shape
- `minor`: New public methods, new supported fields or additive public type changes
- `major`: Breaking API changes, changed behavior contracts or removed support
- Changeset notes must describe only package behavior for the packages listed in the changeset frontmatter. Do not mention root-only, workspace-only, playground-only, or tooling-only changes unless they directly affect that package's published behavior.
- Do not edit changeset files inherited from `main` or unrelated previous work. Reuse a changeset on the current branch only when its package scope and topic match the new change; otherwise create a separate changeset.
- Split changesets by topic and by package when the changes differ. Dependency updates and type-safety changes require separate release notes. Use a package-specific changeset when the implementation or user-facing impact differs between libraries; list multiple packages together only when the same note accurately describes the same change for all of them.
- Keep each changeset to one topic and choose the release level for each listed package. Together, the branch changesets must cover every publishable package with source changes, including earlier work on the branch. Do not combine unrelated notes merely to keep one changeset per branch.

### Development workflow

1. Update or add code in the relevant package under `packages/*/src/`
2. If the branch modifies source files under any publishable package, ensure its `.changeset/*.md` files collectively cover every publishable package changed anywhere on the branch
3. Reuse an existing branch changeset for the same package scope and topic; create a separate changeset for a different topic or package-specific change, following the conventions above
4. When SDK contract bindings or generated SDK sources change, regenerate them with `pnpm --dir packages/sdk run codegen`; otherwise run any generation required by each changed package
5. Run tests for every changed package, for example `pnpm --dir packages/sdk run test` or `pnpm --dir packages/mcp run test`
6. Run type checking for every changed package, for example `pnpm --dir packages/sdk run typecheck` or `pnpm --dir packages/mcp run typecheck`
7. Add or update the matching branch changeset when user-visible package behavior changes, keeping each note scoped to one topic and the package or packages listed in its frontmatter

Update documentation with the code:

- When publishable-package behavior, public types, generated bindings, examples, or integration guidance change, update the relevant documentation in the same task without waiting for an extra prompt.
- At minimum, review root `README.md`, the changed package's README where present, `AGENTS.md`, the relevant Suigar skills in `Suigar-Gaming/agent-skills`, and any other user-facing markdown that describes the changed behavior.
- Update skills whose guidance covers the SDK behavior you changed. Do not wait for a separate request.
- If constants, helper locations, or public utility exports move, update docs and examples to use the public import path instead of internal file paths or copied values.
- When generated bindings or public runtime usage change, update examples and event-decoding guidance to match the generated API.
- If installation or client setup guidance changes, keep examples aligned with the current APIs such as `@mysten/sui/grpc`, explicit `network`, and ESM-only package requirements.

## AI skills

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

Use these Suigar skills when building a product with this SDK:

- `installation` for SDK setup, client extension wiring, and config
- `suigar-mcp` for installing, configuring, and operating the `@suigar/mcp` server and MCP App
- `create-standard-games` for standard game transactions
- `create-pvp-games` for PvP game flows
- `find-skills` to discover installable external skills when users ask for capabilities or workflows that may already exist

## Pull requests

When creating a PR:

- Summarize the SDK or transaction behavior change clearly
- If the branch modifies source files under any publishable package, make sure its `.changeset/*.md` files cover every changed publishable package, with separate notes for distinct topics and package-specific changes. Reuse a branch changeset only when its package scope and topic match
- PRs that change publishable-package source files without a changeset are expected to fail merge checks and receive a PR comment

Use this format for PR descriptions:

Under Notes, check the boxes that apply. The boxes are enough to report AI involvement or unchanged bindings. If bindings changed, explain the impact and include the regeneration command. Add details that help the reviewer assess the change.

```markdown
## Summary

Explain why the change is needed and what it does.

## Changes

Describe what changed. Mention updates to public APIs, transactions, dependencies, and changesets when they apply.

## Verification

List the checks you ran and whether they passed. If you skipped a check, say why.

## Notes

- [ ] AI helped write or review the code.
- [ ] Generated contract bindings changed.
- [ ] Compatibility issues, limitations, or follow-up work need attention.
```
