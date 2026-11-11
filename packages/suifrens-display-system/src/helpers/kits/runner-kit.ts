// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { HEX_COLOR_PATTERN } from '../../constants/hex-color.js';
import type { AccessoryMetadata } from '../../types/accessory.type.js';
import type { RunnerKitOptions } from '../../types/runner-kit.type.js';

export const RUNNER_ACCESSORY_NAMES = new Set([
	'runner singlet',
	'runner shorts',
	'runner headband',
	'runner shoes',
]);
export function resolveRunnerKit(value: unknown): Required<RunnerKitOptions> {
	const options = value && typeof value === 'object' ? (value as RunnerKitOptions) : {};
	return {
		color:
			typeof options.color === 'string' && HEX_COLOR_PATTERN.test(options.color)
				? options.color
				: '#ef8fae',
		number:
			Number.isInteger(options.number) && options.number! >= 1 && options.number! <= 99
				? options.number!
				: 1,
		mirrorBib: options.mirrorBib === true,
	};
}
export function buildRunnerAccessories(options: RunnerKitOptions = {}): Array<AccessoryMetadata> {
	const kit = { type: 'runner', ...resolveRunnerKit(options) } as const;
	return [...RUNNER_ACCESSORY_NAMES].map((name) => ({
		name,
		type:
			name === 'runner singlet'
				? 'torso'
				: name === 'runner shorts'
					? 'legs'
					: name === 'runner headband'
						? 'head'
						: 'feet',
		category: 'runner',
		collection: 'runner',
		description: 'Athletics kit with native animated limb registration.',
		price: 0,
		quantity: null,
		renderOptions: { kit, showEars: true, showFin: true },
	}));
}
