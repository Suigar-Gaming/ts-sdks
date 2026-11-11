// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { assert } from 'vitest';
import type { ToolStructuredResult } from '../src/runtime/types.js';

export function getBuildResult(value: ToolStructuredResult) {
	assert('mode' in value && (value.mode === 'build' || value.mode === 'dry-run'));
	return value;
}

export function getReadOnlyPlan(value: ToolStructuredResult) {
	assert('mode' in value && value.mode === 'read-only');
	return value;
}
