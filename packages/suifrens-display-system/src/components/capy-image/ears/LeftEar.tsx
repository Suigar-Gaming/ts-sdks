import type { JSX } from 'react';
import { AnimatedAccessory } from '../../../animation/AnimatedAccessory.js';
import { assertUnreachable } from '../../../utils/assertUnreachable.js';
import { DefaultLeftEar, type DefaultLeftEarProps } from './left/DefaultLeftEar.js';
import { MischievousLeftEar, type MischievousLeftEarProps } from './left/MichievousLeftEar.js';
import { QuietLeftEar, type QuietLeftEarProps } from './left/QuietLeftEar.js';
import { WildLeftEar, type WildLeftEarProps } from './left/WildLeftEar.js';

type LeftEarProps =
	| DefaultLeftEarProps
	| WildLeftEarProps
	| MischievousLeftEarProps
	| QuietLeftEarProps;

export function LeftEar({ ...props }: LeftEarProps) {
	let content: JSX.Element;
	switch (props.earShape) {
		case 'default':
			content = <DefaultLeftEar fill={props.fill} />;
			break;
		case 'wild':
			content = (
				<WildLeftEar
					earShape={props.earShape}
					innerEarProps={props.innerEarProps}
					outerEarProps={props.outerEarProps}
				/>
			);
			break;
		case 'mischievous':
			content = <MischievousLeftEar fill={props.fill} />;
			break;
		case 'quiet':
			content = <QuietLeftEar fill={props.fill} />;
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
