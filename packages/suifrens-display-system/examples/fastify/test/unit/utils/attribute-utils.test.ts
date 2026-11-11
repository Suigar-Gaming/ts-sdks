// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { expect, test } from 'vitest';
import type { SuiFrenSpecies } from '@suigar/suifrens-display-system/types';
import { parseSuiFrenAttributes } from '../../../src/utils/attribute-utils.js';

const APPEARANCE = ['basic', '6fbbee', 'e6fbff', 'happy'] as const;

test('decodes known species traits and allows trailing attributes', () => {
	expect(parseSuiFrenAttributes('capy', [...APPEARANCE, 'ear4', 'extra'])).toEqual({
		skin: 'basic',
		mainColor: '6fbbee',
		secondaryColor: 'e6fbff',
		expression: 'happy',
		earShape: 'mischievous',
	});
	expect(parseSuiFrenAttributes('bullshark', [...APPEARANCE, 'classic'])).toHaveProperty(
		'finStyle',
		'classic',
	);
});

test.each<[SuiFrenSpecies, Array<string>]>([
	['capy', []],
	['capy', [...APPEARANCE]],
	['capy', [...APPEARANCE, 'ear5']],
	['capy', [...APPEARANCE, 'toString']],
	['bullshark', [...APPEARANCE, 'ear1']],
	['bullshark', ['unknown', '6fbbee', 'e6fbff', 'happy', 'classic']],
	['capy', ['basic', 'constructor', 'e6fbff', 'happy', 'ear1']],
	['capy', ['basic', '6fbbee', 'invalid', 'happy', 'ear1']],
	['capy', ['basic', '6fbbee', 'e6fbff', 'unknown', 'ear1']],
])('rejects invalid %s attributes %j', (species, attributes) => {
	expect(() => parseSuiFrenAttributes(species, attributes)).toThrow(TypeError);
});

test.each(['capy', 'bullshark'] as const)(
	'normalizes legacy uppercase %s colors before palette validation',
	(species) => {
		const attributes = parseSuiFrenAttributes(species, [
			'basic',
			'6fbbee'.toUpperCase(),
			'e6fbff'.toUpperCase(),
			'happy',
			species === 'capy' ? 'ear1' : 'classic',
		]);
		expect(attributes.mainColor).toBe('6fbbee');
		expect(attributes.secondaryColor).toBe('e6fbff');
	},
);
