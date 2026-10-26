// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

type OptionalOptions<T> = { [K in keyof T]?: Exclude<T[K], undefined> };

/** Omits undefined values at strict SDK and Sui API boundaries. */
export function optionalOptions<T extends Record<string, unknown>>(options: T): OptionalOptions<T> {
	const result = { ...options };
	for (const key of Object.keys(result)) {
		if (result[key] === undefined) {
			delete result[key];
		}
	}
	return result as OptionalOptions<T>;
}
