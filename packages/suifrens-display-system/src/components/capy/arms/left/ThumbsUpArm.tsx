import { AnimatedAccessory } from '../../../../animation/AnimatedAccessory.js';
import { getPartDefinition } from '../../../../animation/parts.js';
import {
	matrixToString,
	multiplyMatrix,
	rotateMatrix,
	scaleMatrix,
	translateMatrix,
} from '../../../../utils/matrix.js';

type ThumbsUpArmProps = {
	armColor: string;
	handColor: string;
};

const shoulder = getPartDefinition('leftArm').pivot;
const pose = matrixToString(
	multiplyMatrix(
		multiplyMatrix(translateMatrix(-35, 35), rotateMatrix(105, shoulder.x, shoulder.y)),
		multiplyMatrix(
			scaleMatrix(-1, 1, shoulder.x, shoulder.y),
			[2.9166107177734375, 0, 0, 2.9166107177734375, 1002.9, 1719.3],
		),
	),
);

// Native arm length and palm volume; the thumb belongs to the same outer contour.
const outline = `M 49.7 0 C 33.7 10.8 22.4 25.3 15.6 43.5
 C 9.6 59.5 5.6 75.8 3.5 92.6 L 1.6 108.7 L 0.1 133.8
 C 0.4 143.1 3.9 150.9 10.6 157.2 C 17.4 163.6 25.5 166.6 34.8 166.3
 C 44.1 166 52 162.5 58.3 155.6 C 61.9 151.9 64.5 147.6 66.2 142.8
 C 80 143 94 135 97 124 C 100 116 95 109 87 109
 C 80 109 75 113 70.8 110 C 72 98 74 86 77.3 74.1
 C 81.2 59.9 89.8 44.3 103.2 27.3`;
const hand = `M 1.6 108.7 C 24.4 106.5 47 109 70.8 110
 C 75 113 80 109 87 109 C 95 109 100 116 97 124
 C 94 135 80 143 66.2 142.8 C 64.5 147.6 61.9 151.9 58.3 155.6
 C 52 162.5 44.1 166 34.8 166.3 C 25.5 166.6 17.4 163.6 10.6 157.2
 C 3.9 150.9 0.4 143.1 0.1 133.8 Z`;

export function ThumbsUpArm({ armColor, handColor }: ThumbsUpArmProps) {
	return (
		<AnimatedAccessory fallbackPart="leftArm">
			<g data-suifren-gesture="thumbs-up">
				<g transform={pose}>
					<path fill={armColor} d={`${outline} Z`} />
					<path fill={handColor} d={hand} />
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
