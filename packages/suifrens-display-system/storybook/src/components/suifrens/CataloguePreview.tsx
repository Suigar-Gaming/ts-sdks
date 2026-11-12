// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import type { SuiFrenExpression, SuiFrenImageProps } from '@suigar/suifrens-display-system/types';

const species = [
	{ label: 'Bullshark', traits: { finStyle: 'classic' } },
	{ label: 'Capy', traits: { earShape: 'default' } },
] as const;

type Props = Pick<SuiFrenImageProps, 'accessories' | 'animation'> & {
	title: string;
	subtitle?: string;
	expression?: SuiFrenExpression;
};

export function CataloguePreview({ title, subtitle, expression = 'happy', ...props }: Props) {
	return (
		<div className="story-panel">
			<div className="flex items-baseline justify-between gap-2">
				<span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</span>
				{subtitle != null && subtitle !== '' && (
					<span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
						{subtitle}
					</span>
				)}
			</div>
			<div className="mt-4 grid grid-cols-2 gap-3">
				{species.map(({ label, traits }) => (
					<figure key={label} className="flex flex-col items-center gap-2">
						<div className="aspect-square w-full max-w-44">
							<SuiFrenImageInline
								{...props}
								attributes={{
									...traits,
									mainColor: '6fbbee',
									secondaryColor: 'e6fbff',
									skin: 'basic',
									expression,
								}}
								shadow
								style={{ width: '100%', height: '100%' }}
							/>
						</div>
						<figcaption className="text-xs font-semibold text-slate-600 dark:text-slate-300">
							{label}
						</figcaption>
					</figure>
				))}
			</div>
		</div>
	);
}
