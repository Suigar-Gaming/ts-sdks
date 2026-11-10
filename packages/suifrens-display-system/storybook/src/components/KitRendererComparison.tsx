// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { SuiFrenImage } from '@suigar/suifrens-display-system';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import type { SuiFrenImageProps } from '@suigar/suifrens-display-system/types';

const renderers = [
	{ label: 'Inline SVG', Renderer: SuiFrenImageInline },
	{ label: 'SVG assets', Renderer: SuiFrenImage },
];

export function KitRendererComparison(props: SuiFrenImageProps) {
	return (
		<div className="grid grid-cols-2 gap-3">
			{renderers.map(({ label, Renderer }) => (
				<figure key={label} className="story-tile grid justify-items-center gap-2 p-2">
					<Renderer {...props} style={{ width: '100%', ...props.style }} />
					<figcaption className="text-xs font-semibold text-slate-600">{label}</figcaption>
				</figure>
			))}
		</div>
	);
}
