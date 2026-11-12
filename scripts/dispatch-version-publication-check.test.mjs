import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { dispatchVersionPublicationCheck } from './dispatch-version-publication-check.mjs';

const repository = 'Suigar-Gaming/ts-sdks';
const safe = {
	headRefName: 'changeset-release/main',
	baseRefName: 'main',
	isCrossRepository: false,
	state: 'OPEN',
};

test('dispatches only the privacy workflow on the inspected same-repository version branch', () => {
	const calls = [];
	dispatchVersionPublicationCheck('12', (command, args, options) => {
		calls.push({ command, args });
		assert.equal(options.timeout, 30_000);
		assert.equal(options.shell, undefined);
		return { status: 0, stdout: args[0] === 'pr' ? JSON.stringify(safe) : '' };
	});
	assert.deepEqual(calls, [
		{
			command: 'gh',
			args: [
				'pr',
				'view',
				'12',
				'--repo',
				repository,
				'--json',
				'headRefName,baseRefName,isCrossRepository,state',
			],
		},
		{
			command: 'gh',
			args: [
				'workflow',
				'run',
				'publication-privacy.yaml',
				'--repo',
				repository,
				'--ref',
				'changeset-release/main',
			],
		},
	]);
});

test('rejects invalid PR numbers, unrelated branches/bases/forks and private provider errors without dispatch', () => {
	for (const number of ['', '0', '-1', '1; echo PRIVATE', '9007199254740993']) {
		assert.throws(() =>
			dispatchVersionPublicationCheck(number, () => assert.fail('Must not execute')),
		);
	}
	for (const patch of [
		{ state: 'CLOSED' },
		{ baseRefName: 'test' },
		{ isCrossRepository: true },
		{ headRefName: 'feature' },
		{ headRefName: 'changeset-release/$(touch private)' },
		{ headRefName: 'changeset-release/../private' },
		{ headRefName: 'changeset-release/main/' },
	]) {
		let calls = 0;
		assert.throws(() =>
			dispatchVersionPublicationCheck('12', () => {
				calls++;
				return { status: 0, stdout: JSON.stringify({ ...safe, ...patch }) };
			}),
		);
		assert.equal(calls, 1);
	}
	assert.throws(
		() =>
			dispatchVersionPublicationCheck('12', () => ({
				status: 1,
				stderr: 'SYNTHETIC_PRIVATE_VALUE',
			})),
		(e) => !e.message.includes('SYNTHETIC_PRIVATE_VALUE'),
	);
});

test('Changesets v2 PR output triggers the dispatch with actions-write confined to the release job', () => {
	const workflow = readFileSync(
		new URL('../.github/workflows/changesets.yaml', import.meta.url),
		'utf8',
	);
	const release = workflow.split('\n  release:\n')[1].split('\n  publish-mcp-registry:')[0];
	const globalPermissions = workflow.split('\npermissions:\n')[1].split('\nconcurrency:')[0];
	assert.match(
		release,
		/(?:^|\n)    permissions:\n      actions: write\n      contents: write\n      pull-requests: write\n      id-token: write/,
	);
	assert.doesNotMatch(globalPermissions, /actions: write/);
	assert.match(release, /if: steps\.changesets\.outputs\['pr-number'\] != ''/);
	assert.match(release, /VERSION_PR: \$\{\{ steps\.changesets\.outputs\['pr-number'\] \}\}/);
	assert.match(release, /GH_TOKEN: \$\{\{ github\.token \}\}/);
	assert.match(release, /run: node scripts\/dispatch-version-publication-check\.mjs/);
});
