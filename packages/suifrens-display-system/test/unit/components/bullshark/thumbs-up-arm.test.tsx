// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import { accessories } from '../../../../src/constants/accessories.js';
import { SuiFrenImageInline } from '../../../../src/image-inline/index.js';
import { SuiFrenImage } from '../../../../src/index.js';
import type { AnimationConfig } from '../../../../src/types/animation.type.js';

const shark = {
	mainColor: '6FBBEE',
	secondaryColor: 'E6FBFF',
	skin: 'basic',
	expression: 'happy',
	finStyle: 'classic',
} as const;

describe.each([
	['inline', SuiFrenImageInline],
	['asset', SuiFrenImage],
] as const)('%s bullshark thumbs up', (_name, Image) => {
	test('replaces the resting arm with one foreground thumbs-up in the shark color', () => {
		const resting = renderToStaticMarkup(<Image attributes={shark} />);
		const raised = renderToStaticMarkup(<Image attributes={shark} gesture="thumbs_up" />);
		expect(resting).not.toContain('data-suifren-gesture');
		expect(resting).toContain('1002.9,1719.3');
		expect(raised).not.toContain('1002.9,1719.3');
		expect(raised.match(/data-suifren-gesture="thumbs-up"/g)).toHaveLength(1);
		const gesture = raised.slice(raised.indexOf('data-suifren-gesture'));
		expect(gesture).toContain('fill="#6FBBEE"');
		expect(gesture).not.toContain('#4e4943');
		expect(raised.indexOf('data-suifren-gesture')).toBeGreaterThan(
			raised.indexOf('data-suifren-animation-part="head"'),
		);
	});

	test('leaves head portraits unchanged', () => {
		expect(
			renderToStaticMarkup(<Image attributes={shark} detail="head" gesture="thumbs_up" />),
		).toBe(renderToStaticMarkup(<Image attributes={shark} detail="head" />));
	});

	test.each(accessories.filter((accessory) => accessory.type === 'object'))(
		'preserves the native grip for $name',
		(object) => {
			const props = { attributes: shark, accessories: [object] };
			expect(renderToStaticMarkup(<Image {...props} gesture="thumbs_up" />)).toBe(
				renderToStaticMarkup(<Image {...props} />),
			);
		},
	);

	test.each([null, { preset: 'talkMicrophone' }] satisfies Array<AnimationConfig | null>)(
		'preserves foreground held objects with animation %j',
		(animation) => {
			const microphone = accessories.find((accessory) => accessory.name === 'microphone')!;
			const object = {
				...microphone,
				renderOptions: {
					...microphone.renderOptions,
					foreground: true,
					animationPart: 'leftArm' as const,
				},
			};
			const props = { attributes: shark, accessories: [object], animation };
			expect(renderToStaticMarkup(<Image {...props} gesture="thumbs_up" />)).toBe(
				renderToStaticMarkup(<Image {...props} />),
			);
		},
	);
});
