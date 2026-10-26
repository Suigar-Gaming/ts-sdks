// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

type OptionalOptions<T> = { [K in keyof T]?: Exclude<T[K], undefined> };

/**
 * Creates a shallow copy of options with undefined fields omitted.
 *
 * Adapts SDK options to external APIs that require optional fields to be absent rather than
 * explicitly undefined with `exactOptionalPropertyTypes` enabled. Only own enumerable string-keyed
 * fields are copied. Values such as `null`, `false`, `0`, and empty strings are preserved; nested
 * objects are not filtered.
 *
 * @example
 * 	```ts
 * 	optionalOptions({ package: undefined, useGasCoin: false });
 * 	// => { useGasCoin: false }
 * 	```;
 *
 * @typeParam T - The input options shape.
 * @param options - The options to copy without modifying the original object.
 * @returns A new object whose fields are optional and exclude undefined from their value types.
 */
export function optionalOptions<T extends Record<string, unknown>>(options: T): OptionalOptions<T> {
	const result: Record<string, unknown> = {};
	for (const key of Object.keys(options)) {
		const value = options[key];
		if (value !== undefined) {
			if (key === '__proto__') {
				Object.defineProperty(result, key, {
					value,
					enumerable: true,
					configurable: true,
					writable: true,
				});
			} else {
				result[key] = value;
			}
		}
	}
	return result as OptionalOptions<T>;
}
