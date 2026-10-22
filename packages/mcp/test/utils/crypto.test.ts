import { describe, expect, it } from 'vitest';
import {
	equalBytes,
	HEX_32_BYTE_PATTERN,
	randomHex,
	randomUuid,
	sameState,
} from '../../src/utils/crypto.js';

describe('crypto utilities', () => {
	it('generates cryptographically random hex values of the requested byte length', () => {
		const value = randomHex(32);

		expect(value).toMatch(HEX_32_BYTE_PATTERN);
	});

	it('generates RFC 9562 version 4 UUIDs', () => {
		const value = randomUuid();

		expect(value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u);
	});

	it('compares byte arrays using the native Node implementation when available', async () => {
		expect(await equalBytes(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]))).toBe(true);
		expect(await equalBytes(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4]))).toBe(false);
		expect(await equalBytes(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3]))).toBe(false);
	});

	it('compares valid states by their decoded bytes', async () => {
		const state = 'ab'.repeat(32);

		expect(await sameState(state, state)).toBe(true);
		expect(await sameState(state.toUpperCase(), state)).toBe(true);
		expect(await sameState('ac'.repeat(32), state)).toBe(false);
	});

	it.each([
		'',
		'ab'.repeat(31),
		'ab'.repeat(33),
		'a'.repeat(63),
		'gg'.repeat(32),
		`0x${'ab'.repeat(32)}`,
	])('rejects malformed states without decoding: %s', async (invalid) => {
		const state = 'ab'.repeat(32);

		expect(await sameState(invalid, state)).toBe(false);
		expect(await sameState(state, invalid)).toBe(false);
		expect(await sameState(invalid, invalid)).toBe(false);
	});
});
