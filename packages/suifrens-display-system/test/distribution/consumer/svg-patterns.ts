// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

export const EXTERNAL_SVG_URL_PATTERN: RegExp = /file:.*\.svg/;
export const EXTERNAL_SVG_FRAGMENT_PATTERN: RegExp =
	/(?:href|xlink:href)="(file:[^"#]+\.svg)#([^"]+)"/gi;
