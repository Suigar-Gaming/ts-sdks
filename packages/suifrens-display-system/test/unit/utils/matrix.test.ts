// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { expect, test } from 'vitest';
import type { Matrix } from '../../../src/types/animation.type.js';
import {
	matrixToAnimationTransform,
	multiplyMatrix,
	parseMatrix,
	rotateMatrix,
} from '../../../src/utils/matrix.js';

test.each([0, 45, 89.9999, 90, 90.0001, 135, 180])(
	'preserves mirrored artwork at %s degrees with a positive-determinant interpolation matrix',
	(angle) => {
		const original = multiplyMatrix(
			rotateMatrix(angle, 1225.87489, 1759.11174),
			[-2.91661, 0, 0, 2.91661, 1300, 1982],
		);
		const transform = matrixToAnimationTransform(original);
		const rotation = parseMatrix(transform)!;
		expect(rotation[0] * rotation[3] - rotation[1] * rotation[2]).toBeGreaterThan(0);
		expect(transform).toMatch(/ scale\(-1, 1\)$/);
		const composed = multiplyMatrix(rotation, [-1, 0, 0, 1, 0, 0]);
		for (const [index, value] of original.entries()) {
			expect(composed[index]).toBeCloseTo(value, 5);
		}
	},
);

test('keeps the same transform-list shape for unmirrored artwork', () => {
	const original: Matrix = [2, 0, 0, 3, 100, 200];
	const transform = matrixToAnimationTransform(original);
	expect(transform).toBe('matrix(2, 0, 0, 3, 100, 200) scale(1, 1)');
	expect(parseMatrix(transform)).toEqual(original);
});
