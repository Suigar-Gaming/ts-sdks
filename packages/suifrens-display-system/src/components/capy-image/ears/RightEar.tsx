import type { JSX } from 'react';
import { AnimatedAccessory } from '../../../animation/AnimatedAccessory.js';
import { assertUnreachable } from '../../../utils/assertUnreachable.js';
import { DefaultRightEar, type DefaultRightEarProps } from './right/DefaultRightEar.js';
import { MischievousRightEar, type MischievousRightEarProps } from './right/MichievousRightEar.js';
import { QuietRightEar, type QuietRightEarProps } from './right/QuietRightEar.js';
import { WildRightEar, type WildRightEarProps } from './right/WildRightEar.js';

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
