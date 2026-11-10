import type { JSX } from 'react';
import { AnimatedAccessory } from '../../../animation/AnimatedAccessory.js';
import type {
	DefaultRightEarProps,
	MischievousRightEarProps,
	QuietRightEarProps,
	WildRightEarProps,
} from '../../../types/capy.type.js';
import { assertUnreachable } from '../../../utils/assert-unreachable.js';
import { DefaultRightEar } from './right/DefaultRightEar.js';
import { MischievousRightEar } from './right/MischievousRightEar.js';
import { QuietRightEar } from './right/QuietRightEar.js';
import { WildRightEar } from './right/WildRightEar.js';

type RightEarProps =
	| DefaultRightEarProps
	| WildRightEarProps
	| MischievousRightEarProps
	| QuietRightEarProps;

export function RightEar({ ...props }: RightEarProps) {
	let content: JSX.Element;
	switch (props.earShape) {
		case 'default':
			content = <DefaultRightEar fill={props.fill} />;
			break;
		case 'wild':
			content = (
				<WildRightEar
					earShape={props.earShape}
					innerEarProps={props.innerEarProps}
					outerEarProps={props.outerEarProps}
				/>
			);
			break;
		case 'mischievous':
			content = <MischievousRightEar fill={props.fill} />;
			break;
		case 'quiet':
			content = <QuietRightEar fill={props.fill} />;
			break;
		default:
			assertUnreachable(props);
	}
	return (
		<AnimatedAccessory fallbackPart="head">
			<g>{content}</g>
		</AnimatedAccessory>
	);
}
