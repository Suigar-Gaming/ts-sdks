// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { addons } from 'storybook/manager-api';

function badgeLabel(tag: string) {
	if (tag === 'beta') return 'Beta';
	if (tag === 'unreleased') return 'Unreleased';
	if (/^since-\d+\.\d+\.\d+$/.test(tag)) return `v${tag.slice('since-'.length)}+`;
	return undefined;
}

addons.setConfig({
	sidebar: {
		renderLabel(item, api) {
			if (item.type === 'root' || item.type === 'group') return item.name;
			const parentTags = item.parent ? api.resolveStory(item.parent, item.refId)?.tags : [];
			const labels = item.tags
				.filter((tag) => item.type === 'component' || !parentTags?.includes(tag))
				.map(badgeLabel)
				.filter((label) => label !== undefined);
			if (!labels.length) return item.name;

			return (
				<React.Fragment>
					{item.name}
					{labels.map((label) => (
						<small
							key={label}
							style={{
								marginInlineStart: 6,
								padding: '1px 5px',
								border: '1px solid currentColor',
								borderRadius: 6,
								fontSize: 10,
								whiteSpace: 'nowrap',
							}}
						>
							{label}
						</small>
					))}
				</React.Fragment>
			);
		},
	},
});
