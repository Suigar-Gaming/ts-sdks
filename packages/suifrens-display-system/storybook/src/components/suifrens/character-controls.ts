// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { SUIFREN_SKINS } from '@suigar/suifrens-display-system/attributes';
import { COLORS } from '@suigar/suifrens-display-system/colors';
import { ALL_EXPRESSIONS } from '@suigar/suifrens-display-system/expressions';
import type { SuiFrenGesture } from '@suigar/suifrens-display-system/types';

const gestures = ['thumbs_up', 'thumbs_down', 'point'] satisfies Array<SuiFrenGesture>;

export const gestureControl = {
	control: { type: 'select' as const },
	options: ['none', ...gestures],
	mapping: { none: undefined },
};

export const expressionControl = { control: 'select', options: ALL_EXPRESSIONS } as const;

export const imageControls = {
	gesture: gestureControl,
	detail: { control: 'select', options: ['full', 'head'] },
} as const;

const paletteControl = {
	control: { type: 'select', labels: COLORS },
	options: Object.keys(COLORS),
} as const;

export const characterControls = {
	...imageControls,
	expression: expressionControl,
	skin: { control: 'select', options: SUIFREN_SKINS },
	mainColor: paletteControl,
	secondaryColor: paletteControl,
} as const;
