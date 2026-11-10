import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import { getPartDefinition } from '../src/animation/parts.js';
import { accessories } from '../src/constants/accessories.js';
import { SuiFrenImage } from '../src/image-inline/index.js';
import { SuiFrenImage as SuiFrenImageAssets } from '../src/image/index.js';
import { parseMatrix } from '../src/utils/matrix.js';

const capy = {
	mainColor: 'A87C4C',
	secondaryColor: 'D5CBB1',
	skin: 'basic',
	expression: 'bigSmile',
	earShape: 'default',
} as const;
const restingArm = '1002.9,1719.3';

describe.each([
	['inline', SuiFrenImage],
	['asset', SuiFrenImageAssets],
] as const)('%s capy thumbs up', (_name, Image) => {
	test('uses one foreground posed hand and leaves the resting pose unchanged by default', () => {
		const resting = renderToStaticMarkup(<Image attributes={capy} />);
		const raised = renderToStaticMarkup(<Image attributes={capy} capyGesture="thumbs_up" />);
		expect(resting).not.toContain('data-suifren-gesture');
		expect(resting).toContain(restingArm);
		expect(raised.match(/data-suifren-gesture="thumbs-up"/g)).toHaveLength(1);
		expect(raised).not.toContain(restingArm);
		expect(raised).toContain('viewBox="0 -200 3000 3000"');
		expect(raised.indexOf('data-suifren-gesture')).toBeGreaterThan(
			raised.indexOf('data-suifren-animation-part="head"'),
		);
	});
	test('keeps the thumb up and the wrist toward the belly with the small down-left offset', () => {
		const raised = renderToStaticMarkup(<Image attributes={capy} capyGesture="thumbs_up" />);
		const transform = raised.match(
			/data-suifren-gesture="thumbs-up"[\s\S]*?<g transform="([^"]+)"/,
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
		const raised = renderToStaticMarkup(<Image attributes={capy} capyGesture="thumbs_up" />);
		const gesture = raised.slice(raised.indexOf('data-suifren-gesture="thumbs-up"'));
		expect(gesture).not.toContain('<ellipse');
		expect(gesture).not.toContain('<clipPath');
		expect(gesture.match(/stroke="#000"/g)).toHaveLength(1);
	});
	test('does not change a head portrait or bullshark', () => {
		expect(
			renderToStaticMarkup(<Image attributes={capy} detail="head" capyGesture="thumbs_up" />),
		).toBe(renderToStaticMarkup(<Image attributes={capy} detail="head" />));
		const shark = {
			mainColor: 'A87C4C',
			secondaryColor: 'D5CBB1',
			skin: 'basic',
			expression: 'happy',
			finStyle: 'classic',
		} as const;
		expect(renderToStaticMarkup(<Image attributes={shark} capyGesture="thumbs_up" />)).toBe(
			renderToStaticMarkup(<Image attributes={shark} />),
		);
	});
	test('preserves the grip when holding an object', () => {
		const object = accessories.find((accessory) => accessory.name === 'microphone')!;
		const props = { attributes: capy, accessories: [object] };
		expect(renderToStaticMarkup(<Image {...props} capyGesture="thumbs_up" />)).toBe(
			renderToStaticMarkup(<Image {...props} />),
		);
	});
});
