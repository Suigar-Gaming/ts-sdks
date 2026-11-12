export function stringifyGameParameters(value: unknown) {
	return JSON.stringify(
		value,
		(_, currentValue: unknown) =>
			typeof currentValue === 'bigint' ? currentValue.toString() : currentValue,
		2,
	);
}
