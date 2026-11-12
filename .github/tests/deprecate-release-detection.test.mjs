import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const workflow = readFileSync(
	new URL('../workflows/deprecate-previous-release.yaml', import.meta.url),
	'utf8',
);
const detection = workflow
	.split('      - name: Detect released packages\n')[1]
	?.split('\n      - name:')[0];
assert.ok(detection);
const script = detection
	.split('        run: |\n')[1]
	.split('\n')
	.map((line) => line.replace(/^ {10}/, ''))
	.join('\n');

function fixture(paths, exit = 0) {
	const cwd = mkdtempSync(join(tmpdir(), 'release-detection-'));
	const output = join(cwd, 'outputs');
	const marker = join(cwd, 'npm-must-not-run');
	writeFileSync(join(cwd, 'paths'), paths.join('\n'));
	writeFileSync(output, '');
	writeFileSync(
		join(cwd, 'git'),
		`#!/bin/sh
case "$1" in
  rev-parse) printf '%s\\n' "$FIXTURE_PARENT" ;;
  diff) [ "$FIXTURE_DIFF_EXIT" = 0 ] || exit "$FIXTURE_DIFF_EXIT"; cat "$FIXTURE_PATHS" ;;
  show)
    case "$2" in
      *:packages/sdk/package.json) printf '%s\\n' '{"name":"@suigar/sdk","version":"2.0.0-beta.48"}' ;;
      *:packages/mcp/package.json) printf '%s\\n' '{"name":"@suigar/mcp","version":"1.0.0-beta.34"}' ;;
      *) exit 91 ;;
    esac ;;
  *) exit 92 ;;
esac
`,
		{ mode: 0o700 },
	);
	writeFileSync(join(cwd, 'npm'), '#!/bin/sh\ntouch "$FIXTURE_NPM_MARKER"\nexit 93\n', {
		mode: 0o700,
	});
	const env = {
		...process.env,
		PATH: `${cwd}:${process.env.PATH}`,
		HEAD_SHA: 'a'.repeat(40),
		FIXTURE_PARENT: 'b'.repeat(40),
		FIXTURE_DIFF_EXIT: String(exit),
		FIXTURE_PATHS: join(cwd, 'paths'),
		GITHUB_OUTPUT: output,
		FIXTURE_NPM_MARKER: marker,
	};
	delete env.NODE_AUTH_TOKEN;
	delete env.NPM_DEPRECATE_TOKEN;
	const result = spawnSync('bash', ['-e', '-o', 'pipefail', '-c', script], {
		cwd,
		env,
		encoding: 'utf8',
		timeout: 10_000,
	});
	const values = Object.fromEntries(
		readFileSync(output, 'utf8')
			.split('\n')
			.filter(Boolean)
			.map((line) => {
				const i = line.indexOf('=');
				return [line.slice(0, i), line.slice(i + 1)];
			}),
	);
	return {
		result,
		values,
		npmRan: existsSync(marker),
		cleanup: () => rmSync(cwd, { recursive: true, force: true }),
	};
}

test('empty and CI-only diffs succeed with no released set and no mutation credentials or step', () => {
	for (const files of [
		[],
		['.github/workflows/publication-privacy.yaml', 'scripts/validate-git-identities.mjs'],
	]) {
		const f = fixture(files);
		try {
			assert.equal(f.result.status, 0, f.result.stderr);
			assert.equal(f.values.should_deprecate, 'false');
			assert.equal(f.values.released_packages, '[]');
			assert.equal(f.npmRan, false);
		} finally {
			f.cleanup();
		}
	}
	assert.doesNotMatch(detection, /NODE_AUTH_TOKEN|NPM_DEPRECATE_TOKEN|npm deprecate/);
	const mutation = workflow.split('      - name: Deprecate previous release\n')[1];
	assert.match(
		mutation,
		/if: steps\.release\.outputs\.should_deprecate == 'true' && steps\.release\.outputs\.released_packages != '\[\]'/,
	);
});

test('real package and changelog pairs retain the same detected packages and versions', () => {
	const f = fixture([
		'README.md',
		'packages/sdk/package.json',
		'packages/sdk/CHANGELOG.md',
		'packages/mcp/package.json',
		'packages/mcp/CHANGELOG.md',
		'packages/unpaired/package.json',
	]);
	try {
		assert.equal(f.result.status, 0, f.result.stderr);
		assert.equal(f.values.should_deprecate, 'true');
		assert.deepEqual(JSON.parse(f.values.released_packages), [
			{ dir: 'packages/mcp', name: '@suigar/mcp', version: '1.0.0-beta.34' },
			{ dir: 'packages/sdk', name: '@suigar/sdk', version: '2.0.0-beta.48' },
		]);
		assert.equal(f.npmRan, false);
	} finally {
		f.cleanup();
	}
});

test('a real git diff error propagates instead of becoming an empty successful release', () => {
	const f = fixture([], 17);
	try {
		assert.equal(f.result.status, 17);
		assert.deepEqual(f.values, {});
		assert.equal(f.npmRan, false);
	} finally {
		f.cleanup();
	}
});
