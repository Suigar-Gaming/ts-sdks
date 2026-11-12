// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { defaultConfig, type TagBadgeParameters } from 'storybook-addon-tag-badges/manager-helpers';
import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';

addons.setConfig({
	theme: {
		...themes.normal,
		brandTitle: 'Suigar',
		brandImage: './brand/suigar-logo-full.svg',
		brandUrl: './?path=/story/suifrens-onboarding--getting-started',
		brandTarget: '_self',
	},
	tagBadges: [
		{
			tags: 'unreleased',
			display: { sidebar: true },
			badge: { text: 'Unreleased', style: 'orange', tooltip: 'Not yet available in a release' },
		},
		...defaultConfig,
		{
			display: { sidebar: true, toolbar: false, mdx: false },
			tags: /^\d+\.\d+\.\d+$/u,
			badge: ({ tag }) => {
				const version = `v${tag}`;
				return { text: version, style: 'blue', tooltip: `Available since ${version}` };
			},
		},
	] satisfies TagBadgeParameters,
});

const url = new URL(window.location.href);
if (url.searchParams.get('path') === '/onboarding') {
	url.searchParams.set('path', '/story/suifrens-onboarding--getting-started');
	window.location.replace(url);
}
