// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from 'vitest';
import {
	amountText,
	asRecord,
	dynamicEntries,
	formatValue,
	isRecord,
	labelFor,
	stringify,
	valueTone,
	visibleDefinitionEntries,
} from '../../../src/app/src/lib/format.js';

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

describe('stringify', () => {
	it('serializes bigint values as strings', () => {
		expect(stringify({ amount: 1n })).toContain('"amount": "1"');
	});
});

describe('formatValue', () => {
	it('formats labeled identifiers', () => {
		expect(formatValue({ label: 'Coinflip', id: 'coinflip' })).toBe('Coinflip (coinflip)');
	});

	it('formats identifiers and arrays', () => {
		expect(formatValue({ id: 'coinflip' })).toBe('coinflip');
		expect(formatValue(['one', 'two'])).toBe('one, two');
		expect(formatValue([])).toBeNull();
	});

	it('serializes other objects and preserves primitive values', () => {
		expect(formatValue({ network: 'testnet' })).toContain('"network": "testnet"');
		expect(formatValue('value')).toBe('value');
	});
});

describe('labelFor', () => {
	it('converts camel-case and snake-case keys to title labels', () => {
		expect(labelFor('gasBudgetMist')).toBe('Gas Budget Mist');
		expect(labelFor('coin_type')).toBe('Coin Type');
	});
});

describe('dynamicEntries', () => {
	it('uses display companions and omits hidden SDK fields', () => {
		expect(
			dynamicEntries({
				stake: '1000000',
				stake_display: '1 USDC',
				coin_type: '0x2::sui::SUI',
				metadata: {},
			}),
		).toEqual([['Stake', '1 USDC']]);
	});

	it('uses the raw value when no display companion exists', () => {
		expect(dynamicEntries({ network: 'testnet' })).toEqual([['Network', 'testnet']]);
	});
});

describe('amountText', () => {
	it('formats display and raw base-unit amounts', () => {
		expect(amountText({ display: '1 USDC', raw: '1000000' })).toBe('1 USDC (1000000 base units)');
	});

	it('returns values without amount metadata unchanged', () => {
		const value = '1000000';

		expect(amountText(value)).toBe(value);
	});
});

describe('visibleDefinitionEntries', () => {
	it('keeps entries with displayable values', () => {
		expect(
			visibleDefinitionEntries([
				['Present', 'value'],
				['Empty', ''],
				['Missing', null],
			]),
		).toEqual([['Present', 'value']]);
	});
});

describe('valueTone', () => {
	it('marks successful values as success', () => {
		expect(valueTone('Status', 'success')).toBe('success');
	});

	it('marks failed and error values as error', () => {
		expect(valueTone('Execution Error', 'pending')).toBe('error');
		expect(valueTone('Status', 'failed')).toBe('error');
		expect(valueTone('Status', false)).toBe('error');
	});

	it('returns null for neutral values', () => {
		expect(valueTone('Status', 'pending')).toBeNull();
	});
});
