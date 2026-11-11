// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { getPartDefinition } from '../../animation/parts.js';
import type { AnimationPart, PartPose } from '../../types/animation.type.js';
import {
	IDENTITY_MATRIX,
	matrixToString,
	multiplyMatrix,
	parseMatrix,
	rotateMatrix,
	scaleMatrix,
	translateMatrix,
} from '../../utils/matrix.js';

const ZERO_POSE: PartPose = {};
const TRANSLATE_SCALE = 4;

export function composePartTransform(
	part: AnimationPart,
	baseTransform: string | undefined,
	poses: ReadonlyMap<AnimationPart, PartPose>,
	pivotOverride?: { x: number; y: number },
): string {
	const baseMatrix = parseMatrix(baseTransform) ?? IDENTITY_MATRIX;
	let composed = baseMatrix;
	const pose = poses.get(part) ?? ZERO_POSE;

	const pivotSource = pivotOverride ?? getPartDefinition(part).pivot;

	if (pose.scale) {
		const scale = scaleMatrix(pose.scale.x ?? 1, pose.scale.y ?? 1, pivotSource.x, pivotSource.y);
		composed = multiplyMatrix(scale, composed);
	}

	if (pose.rotate !== undefined) {
		const rotate = rotateMatrix(pose.rotate, pivotSource.x, pivotSource.y);
		composed = multiplyMatrix(rotate, composed);
	}

	if (pose.translate) {
		const translate = translateMatrix(
			pose.translate.x * TRANSLATE_SCALE,
			pose.translate.y * TRANSLATE_SCALE,
		);
		composed = multiplyMatrix(translate, composed);
	}

	let parent = getPartDefinition(part).parent;
	while (parent) {
		const parentPose = poses.get(parent);
		if (parentPose) {
			const parentPivot = getPartDefinition(parent).pivot;
			if (parentPose.scale) {
				const scale = scaleMatrix(
					parentPose.scale.x ?? 1,
					parentPose.scale.y ?? 1,
					parentPivot.x,
					parentPivot.y,
				);
				composed = multiplyMatrix(scale, composed);
			}
			if (parentPose.rotate !== undefined) {
				const rotate = rotateMatrix(parentPose.rotate, parentPivot.x, parentPivot.y);
				composed = multiplyMatrix(rotate, composed);
			}
			if (parentPose.translate) {
				const translate = translateMatrix(
					parentPose.translate.x * TRANSLATE_SCALE,
					parentPose.translate.y * TRANSLATE_SCALE,
				);
				composed = multiplyMatrix(translate, composed);
			}
		}
		parent = getPartDefinition(parent).parent;
	}

	return matrixToString(composed);
}
