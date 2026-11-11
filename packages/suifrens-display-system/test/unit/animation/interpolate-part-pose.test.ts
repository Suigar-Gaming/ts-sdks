// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0
import { expect, test } from 'vitest';
import { interpolatePartPose } from '../../../src/animation/interpolate-part-pose.js';
import { interpolatePose } from '../../../src/animation/sequence-player.js';

test('missing transforms interpolate from neutral values', () => {
	expect(
		interpolatePartPose(
			undefined,
			{ rotate: 20, translate: { x: 8, y: -4 }, scale: { x: 3 } },
			0.5,
		),
	).toEqual({ rotate: 10, translate: { x: 4, y: -2 }, scale: { x: 2, y: 1 } });
});

test('mirroring switches sign at the midpoint while the other axis interpolates', () => {
	const from = { scale: { x: -1, y: 1 } };
	const to = { scale: { x: 1, y: 3 } };
	expect(interpolatePartPose(from, to, 0.25)?.scale).toEqual({ x: -1, y: 1.5 });
	expect(interpolatePartPose(from, to, 0.5)?.scale).toEqual({ x: 1, y: 2 });
});

test('transitions omit empty poses while an empty authored pose remains on its track', () => {
	expect(interpolatePartPose({}, undefined, 0.5)).toBeUndefined();
	expect(
		interpolatePose(
			{
				part: 'body',
				keyframes: [
					{ at: 0, pose: {} },
					{ at: 10, pose: {} },
				],
			},
			5,
		),
	).toEqual({});
});
