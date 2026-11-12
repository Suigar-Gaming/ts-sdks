# Workspace agent instructions

Read the scoped instructions before editing a package. Run commands from the repository root.

## Workspace and instruction map

This private pnpm workspace has three ESM-only publishable packages, an integration app, Storybook and a Fastify example:

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

## Shared code conventions

- Keep lint fixes small and preserve behavior and public exports. Compare the final diff with the original code and remove unnecessary aliases, guards, wrappers, extra passes, and helper extractions.
- Use `value == null` and `value != null` for missing-value checks. Keep strict comparisons when `null` and `undefined` have distinct meanings.
- Reuse existing guards, parsers, resolvers, and supported-value lists. Do not duplicate a helper or repeat schema validation for the same input at the same boundary.
- Keep shared catalogues and choice lists separate from transformation/resolution functions, following each package's established module layout. When runtime choices are needed, derive literal unions from canonical `as const` arrays and reuse those arrays for validation and iteration. Keep internal constants out of public entry points.
- Prefer inference and existing type guards to casts, non-null assertions, or temporary aliases introduced only for lint. Preserve deliberate `Object.create(null)` dictionaries rather than replacing them with prototype mutations or seeded copies.
- Do not widen known SDK or domain types to `unknown` to satisfy lint or incomplete test fixtures. Make fixtures conform to the real contract; reserve `unknown` for untyped inputs and recursive implementations whose exposed generic signature preserves the result type.
- Preserve asynchronous contracts: removing `async` must not turn a rejected promise into a synchronous throw. Do not add dummy awaits or unnecessary Promise wrappers. Final `.then()` callbacks used only for side effects may return implicitly; do not manufacture `: undefined` annotations and `return undefined` statements.
- Name custom hooks with the `use` prefix. Give Storybook render functions that call hooks a PascalCase component name.

## Lint fixes and verification

- Read `.oxlintrc.json` and the relevant scoped configuration before changing code. Keep rule keys alphabetically sorted in both `rules` and overrides, with comments attached to the rules they explain.
- Fix confirmed issues in code. Use shared rule options for repository-wide conventions. For a necessary local exception, use `// oxlint-disable-next-line rule-name -- reason` at the exact expression. Avoid bespoke per-file overrides and broad suppressions; keep generated-code exceptions in the shared configuration.
- Review automatic fixes against the original behavior, including return values, error propagation, effect cleanup, and intentional invalid test inputs. Do not hand-edit generated bindings, assets, or build outputs to fix lint; use the generator or the applicable generated-code configuration.
- For code or lint configuration changes, run `pnpm run lint` and `pnpm exec oxlint --deny-warnings --report-unused-disable-directives-severity error`, plus the affected packages' tests and typechecks. Documentation-only changes need formatting and diff checks.
- Finish library builds before distribution tests or consumer checks that read `dist/`. Do not run type-aware lint or typechecks alongside a build that cleans the same output; missing declarations can produce misleading diagnostics.
- Keep normal Git hooks enabled. Investigate React Doctor findings in the source before restructuring code or suppressing them. When committing in parts, keep configuration changes with their package and verify the staged snapshot; respect the user's commit exclusions.

## Shared testing conventions

- The packages use Vitest 5 in the Node.js environment. Run tests through the package scripts or from the package root so its Vitest config is loaded. For `-t` filters, match an individual test name or use `.*` between suite and test names.
- Add regression coverage near the affected behavior. Check observable results, argument normalization, configuration overrides, and actionable failures where relevant. Transaction tests should cover the applicable game or action and its generated contract-call arguments; keep standard and PvP flows separate.
- Reuse nearby test fixtures and helpers. Mock external services and generated contract boundaries where needed, but exercise the package's own behavior. Keep tests independent of live networks and real wallet credentials; wallet bridge tests may use local loopback servers and temporary storage.
- Keep one-off helpers inside the relevant test or `describe` scope; use module scope for shared fixtures and helpers. Prefer explicit `test.each` inputs and expected results to conditional assertions, and preserve intentionally invalid inputs such as an explicit `undefined` argument.
- Vitest clears mock call history before each test by default. If a test changes mock implementations, module state, environment variables, timers or resources, reset them explicitly. Clearing call history does not reset them. Keep `vi.mock`, `vi.unmock`, and `vi.hoisted` at module scope, and use `vi.doMock` for runtime mocking. Await asynchronous assertions.
- Run tests and typechecks for every affected package. Package-specific test typechecks and fixtures are documented in the scoped instructions.

## Releases and contributions

### Changeset conventions

- `patch`: Bug fixes or internal corrections that do not change the public API shape
- `minor`: New public methods, new supported fields or additive public type changes
- `major`: Breaking API changes, changed behavior contracts or removed support
- Changeset notes must describe only package behavior for the packages listed in the changeset frontmatter. Do not mention root-only, workspace-only, playground-only, or tooling-only changes unless they directly affect that package's published behavior.
- Do not edit changeset files inherited from `main` or unrelated previous work. Reuse a changeset on the current branch only when its package scope and topic match the new change; otherwise create a separate changeset.
- Split changesets by topic and by package when the changes differ. Dependency updates and type-safety changes require separate release notes. Use a package-specific changeset when the implementation or user-facing impact differs between libraries; list multiple packages together only when the same note accurately describes the same change for all of them.
- Keep each changeset to one topic and choose the release level for each listed package. Together, the branch changesets must cover every publishable package with source changes, including earlier work on the branch. Do not combine unrelated notes merely to keep one changeset per branch.

### Implementation checks

- Edit the relevant package under `packages/*/src/`.
- Branch changesets must cover every publishable package with source changes, including earlier work. Reuse a note only for the same package scope and topic; otherwise add one under the conventions above. Update the matching note when behavior changes.
- Regenerate SDK bindings with `pnpm --dir packages/sdk run codegen` when contract bindings or generated SDK sources change. Run other generation required by the affected package.
- Run tests and typechecks for every changed package using its scoped instructions.

Update documentation with the code:

- When publishable-package behavior, public types, generated bindings, examples, or integration guidance change, update the relevant documentation in the same task without waiting for an extra prompt.
- At minimum, review root `README.md`, the changed package's README where present, `AGENTS.md`, the relevant Suigar skills in `Suigar-Gaming/agent-skills`, and any other user-facing markdown that describes the changed behavior.
- Update skills that cover the changed SDK behavior in the same task.
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

Describe the package behavior change and include the required branch changesets. PRs with publishable-package source changes but no changeset are expected to fail merge checks and receive a PR comment.

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
