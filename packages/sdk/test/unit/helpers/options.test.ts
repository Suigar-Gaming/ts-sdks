// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, expectTypeOf, it } from 'vitest';
import { optionalOptions } from '../../../src/helpers/options.js';

describe('optionalOptions', () => {
	it('omits undefined fields without dropping false, zero, empty strings, or null', () => {
		const input = { missing: undefined, enabled: false, count: 0, label: '', nullable: null };
		const result = optionalOptions(input);

		expect(result).toEqual({ enabled: false, count: 0, label: '', nullable: null });
		expect(input).toHaveProperty('missing');
	});

	it('copies only own enumerable fields and reads each value once', () => {
		let reads = 0;
		const input = Object.create({ inherited: true }) as Record<string, unknown>;
		Object.defineProperties(input, {
			hidden: { value: true },
			package: {
				enumerable: true,
				get() {
					reads++;
					return '0x123';
				},
			},
		});

		expect(optionalOptions(input)).toEqual({ package: '0x123' });
		expect(reads).toBe(1);
	});

	it('preserves an own __proto__ field without changing the result prototype', () => {
		const value = { enabled: true };
		const result = optionalOptions({ ['__proto__']: value, missing: undefined });

		expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
		expect(Object.hasOwn(result, '__proto__')).toBe(true);
		expect(result['__proto__']).toBe(value);
	});

	it('narrows undefined values to genuinely optional fields', () => {
		const options: { package: string | undefined; useGasCoin?: boolean } = {
			package: '0x123',
			useGasCoin: false,
		};
		const result = optionalOptions(options);

		expectTypeOf(result).toEqualTypeOf<{ package?: string; useGasCoin?: boolean }>();
		expect(result).toEqual({ package: '0x123', useGasCoin: false });
	});
});
