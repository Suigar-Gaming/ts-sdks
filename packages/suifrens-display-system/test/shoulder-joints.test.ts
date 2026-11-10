import { expect, test } from 'vitest';
import { composePartTransform } from '../src/animation/AnimationStore.js';
import { parseMatrix } from '../src/animation/matrix.js';
import type { AnimationPart } from '../src/animation/parts.js';
import type { PartPose } from '../src/animation/types.js';

// Native capy and bullshark arms share these shoulder seams and mirrored bases.
test.each([
	['leftArm', 2.9166107177734375, 1002.9],
	['rightArm', -2.9166107177734375, 1880.95],
] as const)('%s keeps its shoulder fixed through the victory lift', (part, scaleX, originX) => {
	const local = { x: 76.45, y: 13.65 };
	const scaleY = 2.9166107177734375;
	const shoulder = { x: originX + scaleX * local.x, y: 1719.3 + scaleY * local.y };
	const base = `matrix(${scaleX},0,0,${scaleY},${originX},1719.3)`;
	for (const rotate of [-145, -135, -115, -24, 0, 24, 90, 120, 135, 140]) {
		const poses = new Map<AnimationPart, PartPose>([[part, { rotate }]]);
		const [a, b, c, d, e, f] = parseMatrix(composePartTransform(part, base, poses))!;
		expect(a * local.x + c * local.y + e).toBeCloseTo(shoulder.x, 3);
		expect(b * local.x + d * local.y + f).toBeCloseTo(shoulder.y, 3);
	}
});
