// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { PartPose } from '../types/animation.type.js';

function blendScaleAxis(start: number, end: number, eased: number): number {
	if (start * end < 0) {
		return eased < 0.5 ? start : end;
	}
	return start + (end - start) * eased;
}

export function interpolatePartPose(
	from: PartPose | undefined,
	to: PartPose | undefined,
	eased: number,
): PartPose | undefined {
	const hasRotate = from?.rotate !== undefined || to?.rotate !== undefined;
	const hasTranslate = Boolean(from?.translate || to?.translate);
	const hasScale = Boolean(from?.scale || to?.scale);

	if (!hasRotate && !hasTranslate && !hasScale) {
		return undefined;
	}

	const pose: PartPose = {};

	if (hasRotate) {
		const start = from?.rotate ?? 0;
		const end = to?.rotate ?? 0;
		pose.rotate = start + (end - start) * eased;
	}

	if (hasTranslate) {
		const start = from?.translate ?? { x: 0, y: 0 };
		const end = to?.translate ?? { x: 0, y: 0 };
		pose.translate = {
			x: start.x + (end.x - start.x) * eased,
			y: start.y + (end.y - start.y) * eased,
		};
	}

	if (hasScale) {
		const start = from?.scale ?? { x: 1, y: 1 };
		const end = to?.scale ?? { x: 1, y: 1 };
		const startX = start.x ?? 1;
		const startY = start.y ?? 1;
		const endX = end.x ?? 1;
		const endY = end.y ?? 1;
		pose.scale = {
			x: blendScaleAxis(startX, endX, eased),
			y: blendScaleAxis(startY, endY, eased),
		};
	}

	return pose;
}
