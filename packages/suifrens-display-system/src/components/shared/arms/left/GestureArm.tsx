// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { AnimatedAccessory } from '../../../../animation/AnimatedAccessory.js';
import { getPartDefinition } from '../../../../animation/parts.js';
import type { Matrix } from '../../../../types/animation.type.js';
import type { SuiFrenGesture } from '../../../../types/gesture.type.js';
import {
	matrixToString,
	multiplyMatrix,
	rotateMatrix,
	scaleMatrix,
	translateMatrix,
} from '../../../../utils/matrix.js';

type GestureArmProps = {
	gesture: SuiFrenGesture;
	armColor: string;
	handColor?: string;
};

const SHOULDER = getPartDefinition('leftArm').pivot;
const NATIVE_ARM: Matrix = [2.9166107177734375, 0, 0, 2.9166107177734375, 1002.9, 1719.3];
const THUMBS_UP = multiplyMatrix(
	multiplyMatrix(translateMatrix(-35, 35), rotateMatrix(105, SHOULDER.x, SHOULDER.y)),
	multiplyMatrix(scaleMatrix(-1, 1, SHOULDER.x, SHOULDER.y), NATIVE_ARM),
);
const ARM_OUTER = 'M49.7 0 C33.7 10.8 22.4 25.3 15.6 43.5 C9.6 59.5 5.6 75.8 3.5 92.6 L1.6 108.7';
const ARM_INNER = 'C72 98 74 86 77.3 74.1 C81.2 59.9 89.8 44.3 103.2 27.3';
const THUMB = `L0.1 133.8 C0.4 143.1 3.9 150.9 10.6 157.2 C17.4 163.6 25.5 166.6 34.8 166.3
	C44.1 166 52 162.5 58.3 155.6 C61.9 151.9 64.5 147.6 66.2 142.8
	C80 143 94 135 97 124 C100 116 95 109 87 109 C80 109 75 113 70.8 110`;
const POINTING_HAND = `C0 122 3 136 12 141 Q19 147 31 146 L32 156
	C32 169 48 171 51 157 L54 143 C64 138 71 125 70.8 110`;

const POSES = {
	thumbs_up: { transform: THUMBS_UP, palm: THUMB },
	thumbs_down: {
		transform: multiplyMatrix(scaleMatrix(1, -1, 0, SHOULDER.y + 35), THUMBS_UP),
		palm: THUMB,
	},
	point: {
		transform: multiplyMatrix(rotateMatrix(-94, SHOULDER.x, SHOULDER.y), NATIVE_ARM),
		palm: POINTING_HAND,
	},
} satisfies Record<SuiFrenGesture, { transform: Matrix; palm: string }>;

export function GestureArm({ gesture, armColor, handColor = armColor }: GestureArmProps) {
	const { transform, palm } = POSES[gesture];
	const outline = `${ARM_OUTER} ${palm} ${ARM_INNER}`;
	return (
		<AnimatedAccessory fallbackPart="leftArm">
			<g data-suifren-gesture={gesture.replace('_', '-')}>
				<g transform={matrixToString(transform)}>
					<path fill={armColor} d={`${outline} Z`} />
					<path fill={handColor} d={`M1.6 108.7 ${palm} C47 109 24.4 106.5 1.6 108.7Z`} />
					<path
						fill="none"
						stroke="#000"
						strokeWidth={10}
						strokeLinecap="round"
						strokeLinejoin="round"
						d={outline}
					/>
				</g>
			</g>
		</AnimatedAccessory>
	);
}
