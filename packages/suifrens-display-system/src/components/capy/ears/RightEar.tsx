// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { JSX } from 'react';
import { AnimatedAccessory } from '../../../animation/AnimatedAccessory.js';
import type { CapyEarProps } from '../../../types/capy.type.js';
import { assertUnreachable } from '../../../utils/assert-unreachable.js';
import { DefaultRightEar } from './right/DefaultRightEar.js';
import { MischievousRightEar } from './right/MischievousRightEar.js';
import { QuietRightEar } from './right/QuietRightEar.js';
import { WildRightEar } from './right/WildRightEar.js';

export function RightEar(props: CapyEarProps) {
	let content: JSX.Element;
	switch (props.earShape) {
		case 'default':
			content = <DefaultRightEar fill={props.fill} />;
			break;
		case 'wild':
			content = <WildRightEar {...props} />;
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
