// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { AccessoryRendererProps } from '../../types/accessory.type.js';
import type { AnimationPart } from '../../types/animation.type.js';

const TYPE_FALLBACK: Partial<Record<string, AnimationPart>> = {
	head: 'head',
	eyes: 'head',
	body: 'body',
	torso: 'body',
	back: 'body',
	object: 'leftArm',
	legs: 'body',
	feet: 'rightLeg',
};

const NAME_SPECIFIC_FALLBACK: Partial<Record<string, AnimationPart>> = {
	wings: 'body',
	'superhero cape': 'body',
};

export function resolveAccessoryAnimationPart(
	props: Pick<AccessoryRendererProps, 'accessory' | 'layer'>,
): AnimationPart | undefined {
	const { name, type, renderOptions } = props.accessory;
	if (renderOptions.animationPart) {
		return renderOptions.animationPart;
	}
	const nameSpecificPart = NAME_SPECIFIC_FALLBACK[name];
	if (nameSpecificPart) {
		return nameSpecificPart;
	}

	if ((type === 'body' || type === 'torso') && props.layer === 'left') {
		return 'rightArm';
	}
	if ((type === 'body' || type === 'torso') && props.layer === 'right') {
		return 'leftArm';
	}
	if (props.layer === 'body') {
		return 'body';
	}

	return TYPE_FALLBACK[type];
}
