// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { type Game, GAMES } from '@suigar/sdk/games';

export function requireChoice<T extends string>({
	value,
	choices,
	fieldName,
	createError,
}: {
	value: unknown;
	choices: ReadonlyArray<T>;
	fieldName: string;
	createError?: () => Error;
}): T {
	const choice = choices.find((candidate) => candidate === value);
	if (choice != null) {
		return choice;
	}
	throw (
		createError?.() ?? new TypeError(`Invalid ${fieldName}. Choose one of: ${choices.join(', ')}.`)
	);
}

export function requireString({ value, fieldName }: { value: unknown; fieldName: string }): string {
	if (typeof value === 'string' && value.trim()) {
		return value.trim();
	}
	throw new TypeError(`Missing required field: ${fieldName}.`);
}

export function requireGame(value: unknown): Game {
	const game = requireString({ value, fieldName: 'game' });
	return requireChoice({
		value: game,
		choices: GAMES,
		fieldName: 'game',
		createError: () =>
			new RangeError(`Unsupported game: ${game}. Use one of: ${GAMES.join(', ')}.`),
	});
}
