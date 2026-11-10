// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

const versionPattern = /^\d+\.\d+\.\d+$/;

export function withReleaseFilters(tags: Array<string>, releases: Array<string>): Array<string> {
	// CSF lists component tags before story tags. A later "!tag" removes that tag.
	const isActive = (tag: string) => tags.lastIndexOf(tag) > tags.lastIndexOf(`!${tag}`);
	const version = tags.find((tag) => versionPattern.test(tag) && isActive(tag));
	if (!version) return tags;
	if (isActive('beta') || isActive('unreleased')) {
		return tags.filter((tag) => !versionPattern.test(tag.replace(/^!/, '')));
	}

	const firstRelease = releases.indexOf(version);
	if (firstRelease < 0) throw new Error(`Unknown release tag ${version}`);
	return [...tags, ...releases.slice(firstRelease).map((release) => `v${release}`)];
}
