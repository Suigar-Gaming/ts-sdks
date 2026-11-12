// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import { ACCESSORIES } from '../../../../src/constants/accessories.js';
import { SuiFrenImageInline } from '../../../../src/image-inline/index.js';
import { SuiFrenImage } from '../../../../src/index.js';
import type { AnimationConfig } from '../../../../src/types/animation.type.js';
import { parseMatrix } from '../../../../src/utils/matrix.js';

const shark = {
	mainColor: '6fbbee',
	secondaryColor: 'e6fbff',
	skin: 'basic',
	expression: 'happy',
	finStyle: 'classic',
} as const;

describe.each([
	['inline', SuiFrenImageInline],
	['asset', SuiFrenImage],
] as const)('%s bullshark gestures', (_name, Image) => {
	test('draws point on the foreground arm only when free', () => {
		const markup = renderToStaticMarkup(<Image attributes={shark} gesture="point" />);
		expect(markup.indexOf('data-suifren-gesture="point"')).toBeGreaterThan(
			markup.indexOf('data-suifren-animation-part="head"'),
		);
		const props = {
			attributes: shark,
			accessories: [ACCESSORIES.find((item) => item.name === 'microphone')!],
		};
		expect(renderToStaticMarkup(<Image {...props} gesture="point" />)).toBe(
			renderToStaticMarkup(<Image {...props} />),
		);
	});

	test('points the thumb below the palm in the thumbs-down pose', () => {
		const markup = renderToStaticMarkup(<Image attributes={shark} gesture="thumbs_down" />);
		const transform = markup.match(
			/data-suifren-gesture="thumbs-down"[^>]*><g transform="([^"]+)"/u,
		);
		const matrix = parseMatrix(transform?.[1]);
		expect(matrix).not.toBeNull();
		const [, b, , d] = matrix!;
		expect(b * (97 - 35) + d * (124 - 140)).toBeGreaterThan(0);
	});
	test('replaces the resting arm with one foreground thumbs-up in the shark color', () => {
		const resting = renderToStaticMarkup(<Image attributes={shark} />);
		const raised = renderToStaticMarkup(<Image attributes={shark} gesture="thumbs_up" />);
		expect(resting).not.toContain('data-suifren-gesture');
		expect(resting).toContain('1002.9,1719.3');
		expect(raised).not.toContain('1002.9,1719.3');
		expect(raised.match(/data-suifren-gesture="thumbs-up"/gu)).toHaveLength(1);
		const gesture = raised.slice(raised.indexOf('data-suifren-gesture'));
		expect(gesture).toContain('fill="#6fbbee"');
		expect(gesture).not.toContain('#4e4943');
		expect(raised.indexOf('data-suifren-gesture')).toBeGreaterThan(
			raised.indexOf('data-suifren-animation-part="head"'),
		);
	});

	test.each(['thumbs_up', 'thumbs_down', 'point'] as const)(
		'leaves head portraits unchanged with %s',
		(gesture) => {
			expect(
				renderToStaticMarkup(<Image attributes={shark} detail="head" gesture={gesture} />),
			).toBe(renderToStaticMarkup(<Image attributes={shark} detail="head" />));
		},
	);

	test.each(ACCESSORIES.filter((accessory) => accessory.type === 'object'))(
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
			const microphone = ACCESSORIES.find((accessory) => accessory.name === 'microphone')!;
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
