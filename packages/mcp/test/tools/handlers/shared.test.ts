// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, expectTypeOf, it } from 'vitest';
import { type Game, GAMES } from '@suigar/sdk/games';
import { requireGame } from '../../../src/tools/handlers/shared.js';

describe('requireGame', () => {
	it.each(GAMES)('accepts and trims %s', (game) => {
		const result = requireGame(` ${game} `);
		expect(result).toBe(game);
		expectTypeOf(result).toEqualTypeOf<Game>();
	});

	it.each([undefined, null, '', ' ', 0])('rejects missing game %s', (value) => {
		expect(() => requireGame(value)).toThrow(new TypeError('Missing required field: game.'));
	});

	it('preserves the error for unsupported games', () => {
		expect(() => requireGame('slots')).toThrow(
			new RangeError(`Unsupported game: slots. Use one of: ${GAMES.join(', ')}.`),
		);
	});
});
