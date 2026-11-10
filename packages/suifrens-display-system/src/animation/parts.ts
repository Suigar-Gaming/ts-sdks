export type AnimationPart =
	| 'body'
	| 'head'
	| 'leftArm'
	| 'rightArm'
	| 'leftLeg'
	| 'rightLeg'
	| 'tail'
	| 'fin';

type PartDefinition = {
	pivot: { x: number; y: number };
	autoDetectTransforms: Array<string>;
	parent?: AnimationPart;
};

const PRECISION = 6;

function normalizeTransform(transform: string) {
	return transform.replace(/\s+/g, '').toLowerCase();
}

const PART_DEFINITIONS: Record<AnimationPart, PartDefinition> = {
	body: {
		pivot: { x: 1100, y: 1720 },
		autoDetectTransforms: ['matrix(2.9166107177734375,0,0,2.9166107177734375,956.5,1516.1)'],
	},
	head: {
		// Shared neck joint: lower-left within both head silhouettes, just above the torso.
		pivot: { x: 1180, y: 1580 },
		parent: 'body',
		autoDetectTransforms: [
			'matrix(2.9166107177734375,0,0,2.9166107177734375,848.15,585.65)',
			'matrix(2.9166107177734375,0,0,2.9166107177734375,2037.2,948.05)',
		],
	},
	leftArm: {
		// Midpoint of the native shoulder seam (local 76.45, 13.65), not the SVG origin.
		pivot: { x: 1225.87489, y: 1759.11174 },
		parent: 'body',
		autoDetectTransforms: [
			'matrix(2.9166107177734375,0,0,2.9166107177734375,1002.9,1719.3)',
			'matrix(2.9166107177734375,0,0,-2.9166107177734375,1002.9,2019.3)',
		],
	},
	rightArm: {
		// Mirrored native shoulder seam; keep raised arms attached to the torso.
		pivot: { x: 1657.97511, y: 1759.11174 },
		parent: 'body',
		autoDetectTransforms: [
			'matrix(-2.9166107177734375,0,0,2.9166107177734375,1880.95,1719.3)',
			'matrix(-2.9166107177734375,0,0,-2.9166107177734375,1780.95,2069.3)',
		],
	},
	leftLeg: {
		pivot: { x: 1042.6, y: 1961.9 },
		parent: 'body',
		autoDetectTransforms: ['matrix(2.9166107177734375,0,0,2.9166107177734375,1042.6,1961.9)'],
	},
	rightLeg: {
		pivot: { x: 1463.45, y: 1961.9 },
		parent: 'body',
		autoDetectTransforms: ['matrix(2.9166107177734375,0,0,2.9166107177734375,1463.45,1961.9)'],
	},
	tail: {
		pivot: { x: 468.15, y: 1761.65 },
		parent: 'body',
		autoDetectTransforms: ['matrix(2.9166107177734375,0,0,2.9166107177734375,468.15,1761.65)'],
	},
	fin: {
		pivot: { x: 1008, y: 1486 },
		parent: 'head',
		autoDetectTransforms: ['matrix(2.9166107177734375,0,0,2.9166107177734375,1181.8,460.1)'],
	},
};

const TRANSFORM_LOOKUP = new Map<string, AnimationPart>();
for (const [part, definition] of Object.entries(PART_DEFINITIONS)) {
	for (const entry of definition.autoDetectTransforms) {
		TRANSFORM_LOOKUP.set(normalizeTransform(entry), part as AnimationPart);
	}
}

export function getPartDefinition(part: AnimationPart): PartDefinition {
	return PART_DEFINITIONS[part];
}

export function matchPartByTransform(transform: string | null): AnimationPart | null {
	if (!transform) {
		return null;
	}
	const normalized = normalizeTransform(transform);
	return TRANSFORM_LOOKUP.get(normalized) ?? null;
}

export function formatNumber(value: number) {
	const fixed = value.toFixed(PRECISION);
	return fixed.replace(/\.?0+$/, '');
}
