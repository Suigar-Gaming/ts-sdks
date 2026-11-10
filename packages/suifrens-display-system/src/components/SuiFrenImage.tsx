// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { SuiFrenImageProps } from '../types/suifren.type.js';
import { AssetAccessory } from './accessories/AssetAccessory.js';
import { SuiFrenImageView } from './SuiFrenImageView.js';

export function SuiFrenImage(props: SuiFrenImageProps) {
	return <SuiFrenImageView {...props} accessoryRenderer={AssetAccessory} />;
}
