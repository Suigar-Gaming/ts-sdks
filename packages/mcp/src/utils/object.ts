// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

export type AnyRecord = Record<string, unknown>;

/** Recognizes non-null objects, including arrays, for generic object inspection. */
export function isRecord(value: unknown): value is AnyRecord {
	return value != null && typeof value === 'object';
}

/** Recognizes object-shaped payloads and excludes arrays. */
export function isNonArrayRecord(value: unknown): value is AnyRecord {
	return isRecord(value) && !Array.isArray(value);
}

export function asRecord(value: unknown): AnyRecord {
	return isRecord(value) ? value : {};
}
