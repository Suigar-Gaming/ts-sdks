// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { InlineAccessory } from '../components/accessories/index.js';
import { SuiFrenImageView } from '../components/SuiFrenImageView.js';
import type { SuiFrenImageProps } from '../types/suifren.type.js';

export function SuiFrenImageInline(props: SuiFrenImageProps) {
	return <SuiFrenImageView {...props} accessoryRenderer={InlineAccessory} />;
}
