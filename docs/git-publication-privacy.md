# Publication privacy

Only the exact public name/contact pairs in `.github/publication-identities.json` may be used for new authors, committers, annotated taggers and attribution trailers. Personal contacts and civil names are kept out of this policy and public diagnostics. Any additional contributor identity requires owner approval; never add an exemption to admit a private identity.

Use the Node version from `.node-version`, then install the local hooks with `pnpm install --frozen-lockfile`. The hooks check the effective identity, commit messages and every incoming commit in a push, including an older unsafe commit followed by a clean latest commit. Existing hooks remain in place. Refresh remote refs before pushing a new branch.

The `Publication privacy` workflow checks incoming PR commits, PR title/body, push ranges and annotated taggers. All changes are inspected as raw Git objects; a mailmap does not remove old metadata. Missing comparison objects are fetched from the verified repository using read-only ephemeral credentials; unavailable history fails closed without disclosing values. Manual dispatch checks the selected branch delta against main. Existing third-party history common to the base is preserved; `--all` is an explicit historical audit and is not the incremental gate.

Before making `publication-privacy` required on main, verify a successful ordinary PR and any token-created version PR. The required check must come from GitHub Actions. Protect the workflow and allowlist through normal owner review; a caller does not choose an arbitrary publication identity or disable checks. A successful guard does not erase retained Git objects, old PR refs, forks, caches or published provenance.

Tests use synthetic identities and local Git fixtures only:

```sh
node --test scripts/validate-git-identities.test.mjs scripts/fetch-git-event-objects.test.mjs
node scripts/validate-git-identities.mjs --config
```

## Token-created version PRs

Changesets v2 uses the existing GitHub token and exposes the `pr-number` output. Its release job dispatches `publication-privacy.yaml` on the inspected same-repository `changeset-release/*` branch after creating or updating that PR; `actions: write` is confined to this release job, while existing publish permissions are retained. The dispatch cannot choose another repository, workflow, fork or base. The privacy job itself has only contents-read permission and does not install dependencies or publish anything.

Do not make the check mandatory until both a normal PR and this version-PR dispatch have completed successfully. This dispatch does not merge the PR or approve a release. The central merge helper currently requires its authenticated actor to be the PR author; a human account cannot use it to merge a bot-authored version PR. Retain that invariant and obtain an owner-approved publication path for such PRs rather than bypassing it.
