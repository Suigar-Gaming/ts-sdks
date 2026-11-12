// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { type PropsWithChildren, useSyncExternalStore } from 'react';
import { themes } from 'storybook/theming';

export function ThemeDocsContainer({ context, children }: PropsWithChildren<DocsContainerProps>) {
	const preference = window.matchMedia('(prefers-color-scheme: dark)');
	const dark = useSyncExternalStore(
		(update) => {
			context.channel.on('globalsUpdated', update);
			preference.addEventListener('change', update);
			return () => {
				context.channel.off('globalsUpdated', update);
				preference.removeEventListener('change', update);
			};
		},
		() => {
			const globals: unknown = context.getStoryContext(context.storyById())['globals'];
			const theme =
				typeof globals === 'object' && globals != null && 'theme' in globals
					? globals.theme
					: undefined;
			return theme === 'dark' || (theme === 'system' && preference.matches);
		},
	);

	return (
		<DocsContainer context={context} theme={dark ? themes.dark : themes.light}>
			{children}
		</DocsContainer>
	);
}
