// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { readFile, writeFile } from 'node:fs/promises';
import deno from '../deno.json' with { type: 'json' };

const PACKAGE_JSON_FILENAME = 'package.json';
const JSR_JSON_FILENAME = 'jsr.json';

function hasErrorCode(error, code) {
	return error instanceof Error && 'code' in error && error.code === code;
}

async function readJson(path) {
	return JSON.parse(await readFile(path, 'utf8'));
}

async function replaceVersionInFile(path, version) {
	const source = await readFile(path, 'utf8');
	const versionPattern = /^(\s*"version"\s*:\s*")[^"]+(")/m;
	const nextSource = source.replace(versionPattern, `$1${version}$2`);

	if (nextSource === source && !versionPattern.test(source)) {
		throw new Error(`Missing version field in ${path.pathname}`);
	}

	if (nextSource !== source) {
		await writeFile(path, nextSource);
	}
}

for (const member of deno.workspace) {
	const packageDir = new URL(`../${member}/`, import.meta.url);
	const packageJsonPath = new URL(PACKAGE_JSON_FILENAME, packageDir);
	const jsrJsonPath = new URL(JSR_JSON_FILENAME, packageDir);
	const packageJson = await readJson(packageJsonPath);

	if (packageJson.private === true) {
		continue;
	}

	let jsrJson;
	try {
		jsrJson = await readJson(jsrJsonPath);
	} catch (error) {
		if (hasErrorCode(error, 'ENOENT')) {
			throw new Error(`Missing ${JSR_JSON_FILENAME} for public package ${packageJson.name}`);
		}

		throw error;
	}

	if (jsrJson.name !== packageJson.name) {
		throw new Error(
			`JSR package name ${jsrJson.name} does not match ${PACKAGE_JSON_FILENAME} name ${packageJson.name}`,
		);
	}

	if (jsrJson.version === packageJson.version) {
		continue;
	}

	await replaceVersionInFile(jsrJsonPath, packageJson.version);
}
