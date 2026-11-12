#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const repository = 'Suigar-Gaming/ts-sdks';

export function dispatchVersionPublicationCheck(number, run = spawnSync) {
	if (!/^[1-9][0-9]*$/.test(number ?? '') || !Number.isSafeInteger(Number(number))) {
		throw new Error('Expected a version pull request number.');
	}
	const execute = (args) => {
		const result = run('gh', args, { encoding: 'utf8', timeout: 30_000, maxBuffer: 1024 * 1024 });
		if (result.error || result.status !== 0)
			throw new Error('Version publication check dispatch failed. Values withheld.');
		return result.stdout;
	};
	let pr;
	try {
		pr = JSON.parse(
			execute([
				'pr',
				'view',
				number,
				'--repo',
				repository,
				'--json',
				'headRefName,baseRefName,isCrossRepository,state',
			]),
		);
	} catch {
		throw new Error('Unable to inspect the version pull request. Values withheld.');
	}
	if (
		pr.state !== 'OPEN' ||
		pr.baseRefName !== 'main' ||
		pr.isCrossRepository !== false ||
		typeof pr.headRefName !== 'string' ||
		!/^changeset-release\/[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(pr.headRefName) ||
		pr.headRefName.includes('..') ||
		pr.headRefName.endsWith('/')
	)
		throw new Error(
			'Only the same-repository version pull request targeting main may be dispatched.',
		);
	execute([
		'workflow',
		'run',
		'publication-privacy.yaml',
		'--repo',
		repository,
		'--ref',
		pr.headRefName,
	]);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	try {
		dispatchVersionPublicationCheck(process.env.VERSION_PR);
		console.log('[publication-privacy] Version branch check dispatched.');
	} catch {
		console.error(
			'[publication-privacy] Version check dispatch failed; diagnostic values withheld.',
		);
		process.exitCode = 1;
	}
}
