// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import { getPartDefinition } from '../../../../src/animation/parts.js';
import { ACCESSORIES } from '../../../../src/constants/accessories.js';
import { SuiFrenImageInline } from '../../../../src/image-inline/index.js';
import { SuiFrenImage } from '../../../../src/index.js';
import { parseMatrix } from '../../../../src/utils/matrix.js';

const capy = {
	mainColor: 'a87c4c',
	secondaryColor: 'd5cbb1',
	skin: 'basic',
	expression: 'bigSmile',
	earShape: 'default',
} as const;
const restingArm = '1002.9,1719.3';

describe.each([
	['inline', SuiFrenImageInline],
	['asset', SuiFrenImage],
] as const)('%s capy gestures', (_name, Image) => {
	test('draws point on the foreground arm only when free', () => {
		const markup = renderToStaticMarkup(<Image attributes={capy} gesture="point" />);
		expect(markup.indexOf('data-suifren-gesture="point"')).toBeGreaterThan(
			markup.indexOf('data-suifren-animation-part="head"'),
		);
		const props = {
			attributes: capy,
			accessories: [ACCESSORIES.find((item) => item.name === 'microphone')!],
		};
		expect(renderToStaticMarkup(<Image {...props} gesture="point" />)).toBe(
			renderToStaticMarkup(<Image {...props} />),
		);
	});

	test('points the thumb below the palm in the thumbs-down pose', () => {
		const markup = renderToStaticMarkup(<Image attributes={capy} gesture="thumbs_down" />);
		const transform = markup.match(
			/data-suifren-gesture="thumbs-down"[^>]*><g transform="([^"]+)"/u,
		);
		const matrix = parseMatrix(transform?.[1]);
		expect(matrix).not.toBeNull();
		const [, b, , d] = matrix!;
		expect(b * (97 - 35) + d * (124 - 140)).toBeGreaterThan(0);
	});
	test('uses one foreground posed hand and leaves the resting pose unchanged by default', () => {
		const resting = renderToStaticMarkup(<Image attributes={capy} />);
		const raised = renderToStaticMarkup(<Image attributes={capy} gesture="thumbs_up" />);
		expect(resting).not.toContain('data-suifren-gesture');
		expect(resting).toContain(restingArm);
		expect(raised.match(/data-suifren-gesture="thumbs-up"/gu)).toHaveLength(1);
		expect(raised).not.toContain(restingArm);
		expect(raised).toContain('viewBox="0 -200 3000 3000"');
		expect(raised.indexOf('data-suifren-gesture')).toBeGreaterThan(
			raised.indexOf('data-suifren-animation-part="head"'),
		);
	});
	test('keeps the thumb up and the wrist toward the belly with the small down-left offset', () => {
		const raised = renderToStaticMarkup(<Image attributes={capy} gesture="thumbs_up" />);
		const transform = raised.match(
			/data-suifren-gesture="thumbs-up"[\s\S]*?<g transform="([^"]+)"/u,
		);
		expect(transform).not.toBeNull();
		const matrix = parseMatrix(transform![1])!;
		const point = (x: number, y: number) => ({
			x: matrix[0] * x + matrix[2] * y + matrix[4],
			y: matrix[1] * x + matrix[3] * y + matrix[5],
		});
		const palm = point(35, 140);
		const wrist = point(35, 108);
		const thumbTip = point(97, 124);
		expect(thumbTip.y).toBeLessThan(palm.y);
		expect(wrist.x).toBeGreaterThan(palm.x);
		expect(wrist.y).toBeGreaterThan(palm.y);
		const shoulder = point(76.45, 13.65);
		const nativeShoulder = getPartDefinition('leftArm').pivot;
		expect(shoulder.x).toBeCloseTo(nativeShoulder.x - 35, 2);
		expect(shoulder.y).toBeCloseTo(nativeShoulder.y + 35, 2);
	});
	test('uses one continuous outline without an added thumb ellipse or a clipped wrist splice', () => {
		const raised = renderToStaticMarkup(<Image attributes={capy} gesture="thumbs_up" />);
		const gesture = raised.slice(raised.indexOf('data-suifren-gesture="thumbs-up"'));
		expect(gesture).not.toContain('<ellipse');
		expect(gesture).not.toContain('<clipPath');
		expect(gesture.match(/stroke="#000"/gu)).toHaveLength(1);
	});
	test.each(['thumbs_up', 'thumbs_down', 'point'] as const)(
		'does not change a head portrait with %s',
		(gesture) => {
			expect(
				renderToStaticMarkup(<Image attributes={capy} detail="head" gesture={gesture} />),
			).toBe(renderToStaticMarkup(<Image attributes={capy} detail="head" />));
		},
	);
	test.each(['thumbs_up', 'thumbs_down', 'point'] as const)(
		'preserves the grip when holding an object with %s',
		(gesture) => {
			const object = ACCESSORIES.find((accessory) => accessory.name === 'microphone')!;
			const props = { attributes: capy, accessories: [object] };
			expect(renderToStaticMarkup(<Image {...props} gesture={gesture} />)).toBe(
				renderToStaticMarkup(<Image {...props} />),
			);
		},
	);
});

test('point preserves the native shoulder-to-wrist distance', () => {
	const markup = renderToStaticMarkup(<SuiFrenImageInline attributes={capy} gesture="point" />);
	const transform = markup.match(/data-suifren-gesture="[^"]+"[^>]*><g transform="([^"]+)"/u);
	const matrix = parseMatrix(transform?.[1])!;
	const point = (x: number, y: number) => ({
		x: matrix[0] * x + matrix[2] * y + matrix[4],
		y: matrix[1] * x + matrix[3] * y + matrix[5],
	});
	const shoulder = getPartDefinition('leftArm').pivot;
	const wrist = point(36.2, 109.35);
	expect(Math.hypot(wrist.x - shoulder.x, wrist.y - shoulder.y)).toBeCloseTo(
		2.9166107177734375 * Math.hypot(36.2 - 76.45, 109.35 - 13.65),
		2,
	);
});
