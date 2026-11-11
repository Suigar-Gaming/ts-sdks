// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { expectTypeOf, test } from 'vitest';
import type {
	AnimationPresetName,
	BullsharkAttributes,
	CapyAttributes,
	SuiFrenAppearance,
} from '@suigar/suifrens-display-system/types';

test('published appearance type contains the shared species fields', () => {
	expectTypeOf<Omit<CapyAttributes, 'earShape'>>().toEqualTypeOf<SuiFrenAppearance>();
	expectTypeOf<Omit<BullsharkAttributes, 'finStyle'>>().toEqualTypeOf<SuiFrenAppearance>();
});

test('published preset names include core and battle presets without accepting arbitrary strings', () => {
	expectTypeOf<
		'walk' | 'idle' | 'walkJumpSit' | 'punch' | 'death3'
	>().toExtend<AnimationPresetName>();
	expectTypeOf<string>().not.toExtend<AnimationPresetName>();
	expectTypeOf<'wakl'>().not.toExtend<AnimationPresetName>();
});
