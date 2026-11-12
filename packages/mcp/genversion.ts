// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { readFile, writeFile } from 'node:fs/promises';

const packageJsonPath = new URL('./package.json', import.meta.url);
const mcpConfigPath = new URL('./plugin/.mcp.json', import.meta.url);
const serverManifestPath = new URL('./server.json', import.meta.url);
const sourceVersionPath = new URL('./src/version.ts', import.meta.url);
const pluginManifestPaths = [
	new URL('./plugin/plugin.json', import.meta.url),
	new URL('./plugin/.claude-plugin/plugin.json', import.meta.url),
	new URL('./plugin/.codex-plugin/plugin.json', import.meta.url),
	new URL('./plugin/.cursor-plugin/plugin.json', import.meta.url),
];

const packageJson: unknown = JSON.parse(await readFile(packageJsonPath, 'utf8'));
if (
	packageJson == null ||
	typeof packageJson !== 'object' ||
	!('version' in packageJson) ||
	typeof packageJson.version !== 'string'
) {
	throw new TypeError('Missing package version.');
}
const versionPattern = /^(\s*"version"\s*:\s*")[^"]+(")/mu;
const mcpPackagePattern = /("@suigar\/mcp)(?:@[^"]+)?(")/u;
const serverPackageVersionPattern =
	/("identifier"\s*:\s*"@suigar\/mcp"\s*,\s*"version"\s*:\s*")[^"]+(")/u;

async function replaceInFile(
	filePath: URL,
	pattern: RegExp,
	replacement: string,
	missingMessage: string,
): Promise<void> {
	const source = await readFile(filePath, 'utf8');
	const nextSource = source.replace(pattern, replacement);

	if (nextSource === source && !pattern.test(source)) {
		throw new Error(`${missingMessage} in ${filePath.pathname}`);
	}

	if (nextSource !== source) {
		await writeFile(filePath, nextSource);
	}
}

const versionReplacement = `$1${packageJson.version}$2`;

await Promise.all(
	pluginManifestPaths.map((manifestPath) =>
		replaceInFile(manifestPath, versionPattern, versionReplacement, 'Missing version field'),
	),
);

await replaceInFile(
	mcpConfigPath,
	mcpPackagePattern,
	`$1@${packageJson.version}$2`,
	'Missing @suigar/mcp package specifier',
);

await replaceInFile(
	serverManifestPath,
	versionPattern,
	`$1${packageJson.version}$2`,
	'Missing version field',
);

await replaceInFile(
	serverManifestPath,
	serverPackageVersionPattern,
	`$1${packageJson.version}$2`,
	'Missing @suigar/mcp package version',
);

await replaceInFile(
	sourceVersionPath,
	/(export const VERSION = ')[^']+(';)/u,
	`$1${packageJson.version}$2`,
	'Missing source VERSION export',
);
