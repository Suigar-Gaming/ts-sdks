// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

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
