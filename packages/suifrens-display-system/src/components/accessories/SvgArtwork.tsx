import { useMemo } from 'react';
import { AnimatedAccessory } from '../../animation/AnimatedAccessory.js';
import type { AnimationPart } from '../../types/animation.type.js';

// Only package-owned SVG files reach this renderer. Keep the original viewport and
// expose the groups to the animation store, including during server-side rendering.
function ArtworkElement({ source }: { source: string }) {
	const { attributes, content } = useMemo(() => {
		const svg = source.trim().replace(/>\s+</g, '><');
		const end = svg.indexOf('>');
		const attributes: Record<string, string> = {};
		for (const [, name, value] of svg.slice(0, end).matchAll(/ ([\w:-]+)="([^"]*)"/g)) {
			if (!name || value === undefined) {
				continue;
			}
			attributes[name === 'xml:space' ? 'xmlSpace' : name === 'xmlns:xlink' ? 'xmlnsXlink' : name] =
				value;
		}
		return { attributes, content: { __html: svg.slice(end + 1, -'</svg>'.length) } };
	}, [source]);
	return <svg {...attributes} dangerouslySetInnerHTML={content} />;
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
