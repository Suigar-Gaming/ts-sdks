// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { RUNNER_ACCESSORY_NAMES } from '../../constants/runner-kit.js';
import { SOCCER_TEAM_ACCESSORY_NAMES } from '../../constants/soccer-team-kit.js';

export function isKitAccessory(name: string): boolean {
	return RUNNER_ACCESSORY_NAMES.has(name) || SOCCER_TEAM_ACCESSORY_NAMES.has(name);
}
