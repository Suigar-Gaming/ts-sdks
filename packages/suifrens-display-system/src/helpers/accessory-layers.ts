// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { AccessoryMetadata } from '../types/accessory.type.js';

// Wings straddle the body. Individual shoes take precedence over a paired accessory.
export function getAccessoryLayers(
	accessories: Record<string, AccessoryMetadata>,
): Record<'wings' | 'back' | 'feet', AccessoryMetadata | undefined> {
	const back = accessories['back'];
	const hasWings = back?.category === 'wings';
	return {
		wings: hasWings ? back : undefined,
		back: hasWings ? undefined : back,
		feet: accessories['rightFeet'] || accessories['leftFeet'] ? undefined : accessories['feet'],
	};
}
