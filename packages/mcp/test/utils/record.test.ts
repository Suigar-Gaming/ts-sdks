// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from 'vitest';
import { asRecord, isNonArrayRecord, isRecord } from '../../src/utils/record.js';

describe('asRecord', () => {
	it('returns objects unchanged', () => {
		const value = { network: 'testnet' };

		expect(asRecord(value)).toBe(value);
	});

	it('returns an empty object for non-object values', () => {
		expect(asRecord(null)).toEqual({});
		expect(asRecord('value')).toEqual({});
	});
});

describe('isRecord', () => {
	it('recognizes objects and arrays', () => {
		expect(isRecord({})).toBe(true);
		expect(isRecord([])).toBe(true);
	});

	it('rejects null and primitive values', () => {
		expect(isRecord(null)).toBe(false);
		expect(isRecord('value')).toBe(false);
		expect(isRecord(1)).toBe(false);
	});
});

describe('isNonArrayRecord', () => {
	it('accepts records including objects without a prototype', () => {
		expect(isNonArrayRecord({ network: 'testnet' })).toBe(true);
		expect(isNonArrayRecord(Object.create(null))).toBe(true);
	});

	it('rejects arrays and non-object payloads', () => {
		for (const value of [[], [1], null, undefined, 'value', 1, true, () => ({})]) {
			expect(isNonArrayRecord(value)).toBe(false);
		}
	});
});
