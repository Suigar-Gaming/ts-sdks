// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

import type { JSX } from 'react';
import { AnimatedAccessory } from '../../../animation/AnimatedAccessory.js';
import type { CapyEarProps } from '../../../types/capy.type.js';
import { assertUnreachable } from '../../../utils/assert-unreachable.js';
import { DefaultLeftEar } from './left/DefaultLeftEar.js';
import { MischievousLeftEar } from './left/MischievousLeftEar.js';
import { QuietLeftEar } from './left/QuietLeftEar.js';
import { WildLeftEar } from './left/WildLeftEar.js';

export function LeftEar(props: CapyEarProps) {
	let content: JSX.Element;
	switch (props.earShape) {
		case 'default':
			content = <DefaultLeftEar fill={props.fill} />;
			break;
		case 'wild':
			content = <WildLeftEar {...props} />;
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
