import type { BullsharkExpression } from '../components/bullshark-image/types.js';
import type { CapyExpression } from '../components/capy-image/types.js';

export type ExpressionMood = 'all' | 'positive' | 'negative';

export const POSITIVE_CAPY_EXPRESSIONS = [
	'bigSmile',
	'happy',
	'heartEyes',
	'kiss',
	'laughing',
	'relaxed',
	'tongueOut',
	'wink',
	'goofy',
] as const satisfies ReadonlyArray<CapyExpression>;

export const NEGATIVE_CAPY_EXPRESSIONS = [
	'angry',
	'annoyed',
	'blush',
	'cool',
	'crying',
	'dizzyFace',
	'grimace',
	'mischievous',
	'sad',
	'shocked',
	'sleepy',
] as const satisfies ReadonlyArray<CapyExpression>;

export const ALL_CAPY_EXPRESSIONS = [
	...POSITIVE_CAPY_EXPRESSIONS,
	...NEGATIVE_CAPY_EXPRESSIONS,
] as const satisfies ReadonlyArray<CapyExpression>;

export const POSITIVE_BULLSHARK_EXPRESSIONS = [
	'bigSmile',
	'happy',
	'heartEyes',
	'kiss',
	'laughing',
	'relaxed',
	'tongueOut',
	'wink',
	'goofy',
] as const satisfies ReadonlyArray<BullsharkExpression>;

export const NEGATIVE_BULLSHARK_EXPRESSIONS = [
	'angry',
	'annoyed',
	'blush',
	'cool',
	'crying',
	'dizzyFace',
	'grimace',
	'mischievous',
	'sad',
	'shocked',
	'sleepy',
] as const satisfies ReadonlyArray<BullsharkExpression>;

export const ALL_BULLSHARK_EXPRESSIONS = [
	...POSITIVE_BULLSHARK_EXPRESSIONS,
	...NEGATIVE_BULLSHARK_EXPRESSIONS,
] as const satisfies ReadonlyArray<BullsharkExpression>;
