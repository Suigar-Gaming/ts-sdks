// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { AccessoryMetadata } from '@suigar/suifrens-display-system/types';

export function accessoryLabel({ category, name }: AccessoryMetadata) {
	if (category !== 'crowns') return name;
	const [rank = '', tier] = name.split('-');
	const numeral = ['I', 'II', 'III'][Number(tier) - 1];
	return ['VIP', rank.charAt(0).toUpperCase() + rank.slice(1), numeral].filter(Boolean).join(' ');
}
