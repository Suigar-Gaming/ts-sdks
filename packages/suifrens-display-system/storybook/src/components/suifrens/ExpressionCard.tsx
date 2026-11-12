// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { ALL_EXPRESSIONS } from '@suigar/suifrens-display-system/expressions';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';
import type {
	BullsharkAttributes,
	CapyAttributes,
	SuiFrenExpression,
	SuiFrenImageProps,
} from '@suigar/suifrens-display-system/types';

export type ExpressionGalleryProps = Omit<SuiFrenImageProps, 'attributes'> & {
	attributes: Omit<CapyAttributes, 'expression'> | Omit<BullsharkAttributes, 'expression'>;
};

export function ExpressionCard(props: SuiFrenImageProps) {
	return (
		<figure className="story-tile grid aspect-square w-full max-w-44 grid-rows-[minmax(0,1fr)_auto] justify-items-center gap-2 p-3">
			<div className="flex size-full min-h-0 justify-center [&>svg]:max-h-full [&>svg]:max-w-full">
				<SuiFrenImageInline {...props} />
			</div>
			<figcaption className="text-xs font-semibold text-slate-700 dark:text-slate-200">
				{props.attributes.expression}
			</figcaption>
		</figure>
	);
}

export function ExpressionGallery({ attributes, ...props }: ExpressionGalleryProps) {
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,9rem),1fr))] gap-3">
			{ALL_EXPRESSIONS.map((expression) => (
				<ExpressionCard key={expression} {...props} attributes={{ ...attributes, expression }} />
			))}
		</div>
	);
}

export function ExpressionTransitionPreview({ attributes, ...props }: ExpressionGalleryProps) {
	const [expression, setExpression] = useState<SuiFrenExpression>('happy');
	useEffect(() => {
		const interval = setInterval(() => {
			const randomExpression = ALL_EXPRESSIONS[Math.floor(Math.random() * ALL_EXPRESSIONS.length)];
			if (randomExpression) {
				setExpression(randomExpression);
			}
		}, 500);
		return () => {
			clearInterval(interval);
		};
	}, []);
	return <ExpressionCard {...props} attributes={{ ...attributes, expression }} />;
}

export type CharacterArgs<T extends CapyAttributes | BullsharkAttributes> = Omit<
	SuiFrenImageProps,
	'attributes'
> &
	Omit<T, 'expression'> & { expression?: SuiFrenExpression };

export function CharacterPreview({
	preview: Preview = ExpressionCard,
	mainColor,
	secondaryColor,
	skin,
	expression = 'happy',
	earShape,
	finStyle,
	...props
}: CharacterArgs<CapyAttributes | BullsharkAttributes> & {
	earShape?: CapyAttributes['earShape'];
	finStyle?: BullsharkAttributes['finStyle'];
	preview?: typeof ExpressionCard;
}) {
	const traits = earShape ? { earShape } : { finStyle: finStyle ?? 'classic' };
	const attributes = { mainColor, secondaryColor, skin, expression, ...traits };
	return <Preview {...props} attributes={attributes} />;
}
