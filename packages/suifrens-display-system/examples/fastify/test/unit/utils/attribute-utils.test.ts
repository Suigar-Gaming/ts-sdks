// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { expect, test } from 'vitest';
import type { SuiFrenSpecies } from '@suigar/suifrens-display-system/types';
import { parseSuiFrenAttributes } from '../../../src/utils/attribute-utils.js';

const APPEARANCE = ['basic', '6FBBEE', 'E6FBFF', 'happy'] as const;

test('decodes known species traits and allows trailing attributes', () => {
	expect(parseSuiFrenAttributes('capy', [...APPEARANCE, 'ear4', 'extra'])).toEqual({
		skin: 'basic',
		mainColor: '6FBBEE',
		secondaryColor: 'E6FBFF',
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
	['bullshark', ['unknown', '6FBBEE', 'E6FBFF', 'happy', 'classic']],
	['capy', ['basic', 'constructor', 'E6FBFF', 'happy', 'ear1']],
	['capy', ['basic', '6FBBEE', 'invalid', 'happy', 'ear1']],
	['capy', ['basic', '6FBBEE', 'E6FBFF', 'unknown', 'ear1']],
])('rejects invalid %s attributes %j', (species, attributes) => {
	expect(() => parseSuiFrenAttributes(species, attributes)).toThrow(TypeError);
});
