// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { bcs } from '@mysten/sui/bcs';

// suifrens::SuiFren<T> has a phantom species parameter, so both species share this layout.
export const SuiFren = bcs.struct('SuiFren', {
	id: bcs.Address,
	generation: bcs.u64(),
	birthdate: bcs.u64(),
	cohort: bcs.u32(),
	genes: bcs.vector(bcs.u8()),
	attributes: bcs.vector(bcs.string()),
	birth_location: bcs.string(),
});

export const Accessory = bcs.struct('Accessory', {
	id: bcs.Address,
	name: bcs.string(),
	type: bcs.string(),
});
