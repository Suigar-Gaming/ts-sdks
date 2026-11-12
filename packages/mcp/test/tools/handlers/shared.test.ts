// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, expectTypeOf, it } from 'vitest';
import { COIN_SIDES, type CoinSide } from '@suigar/sdk/games';
import { requireChoice } from '../../../src/tools/handlers/shared.js';

describe('requireChoice', () => {
	it.each(COIN_SIDES)('accepts %s and infers the choice type', (value) => {
		const side = requireChoice({ value, choices: COIN_SIDES, fieldName: 'side' });
		expect(side).toBe(value);
		expectTypeOf(side).toEqualTypeOf<CoinSide>();
	});

	it.each([undefined, null, '', 'edge', ' heads ', 0])('rejects invalid choice %s', (value) => {
		expect(() => requireChoice({ value, choices: COIN_SIDES, fieldName: 'side' })).toThrow(
			new TypeError('Invalid side. Choose one of: heads, tails.'),
		);
	});

	it('accepts an empty string when it is a supported choice', () => {
		expect(requireChoice({ value: '', choices: [''] as const, fieldName: 'choice' })).toBe('');
	});
});
