// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

export const POSITIVE_EXPRESSIONS = [
	'bigSmile',
	'happy',
	'heartEyes',
	'kiss',
	'laughing',
	'relaxed',
	'tongueOut',
	'wink',
	'goofy',
] as const;

export const NEGATIVE_EXPRESSIONS = [
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
] as const;

export const ALL_EXPRESSIONS = [...POSITIVE_EXPRESSIONS, ...NEGATIVE_EXPRESSIONS] as const;
