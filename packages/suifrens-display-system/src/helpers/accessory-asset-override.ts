// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { AccessoryMetadata } from '../types/accessory.type.js';
import { getVipCrownAssetSrc } from './crown-assets.js';

export function resolveAccessoryAssetOverride(accessory: AccessoryMetadata): string | undefined {
	return (
		accessory.renderOptions.assetSrc ??
		(accessory.category === 'crowns' ? getVipCrownAssetSrc(accessory.name) : undefined)
	);
}
