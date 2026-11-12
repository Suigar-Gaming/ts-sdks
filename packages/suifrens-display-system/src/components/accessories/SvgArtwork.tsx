// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react';
import { AnimatedAccessory } from '../../animation/AnimatedAccessory.js';
import { BETWEEN_TAGS_WHITESPACE_PATTERN } from '../../constants/svg-patterns.js';
import type { AnimationPart } from '../../types/animation.type.js';

const SVG_ATTRIBUTE_PATTERN: RegExp = / ([\w:-]+)="([^"]*)"/gu;

// Only package-owned SVG files reach this renderer. Keep the original viewport and
// expose the groups to the animation store, including during server-side rendering.
function ArtworkElement({ source }: { source: string }) {
	const { attributes: svgAttributes, content } = useMemo(() => {
		const svg = source.trim().replace(BETWEEN_TAGS_WHITESPACE_PATTERN, '><');
		const end = svg.indexOf('>');
		const attributes: Record<string, string> = {};
		for (const [, name, value] of svg.slice(0, end).matchAll(SVG_ATTRIBUTE_PATTERN)) {
			if (name == null || name === '' || value == null) {
				continue;
			}
			attributes[name === 'xml:space' ? 'xmlSpace' : name === 'xmlns:xlink' ? 'xmlnsXlink' : name] =
				value;
		}
		return { attributes, content: { __html: svg.slice(end + 1, -'</svg>'.length) } };
	}, [source]);
	return <svg {...svgAttributes} dangerouslySetInnerHTML={content} />;
}

// A new SVG subtree needs fresh limb registrations when the outfit or its colors change.
export function SvgArtwork({
	source,
	fallbackPart,
}: {
	source: string;
	fallbackPart?: AnimationPart | undefined;
}) {
	return (
		<AnimatedAccessory key={source} fallbackPart={fallbackPart}>
			<ArtworkElement source={source} />
		</AnimatedAccessory>
	);
}
