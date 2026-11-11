// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import Type, { type Static } from 'typebox';
import { SuigarLogo } from '../../components/logos/SuigarLogo.js';
import { SuiLogo } from '../../components/logos/SuiLogo.js';

export const IMAGE_LOGO_SCHEMA = Type.Optional(
	Type.Union([Type.Literal('sui'), Type.Literal('suigar')]),
);

export function renderImageLogo(logo: Static<typeof IMAGE_LOGO_SCHEMA> | undefined) {
	if (!logo) {
		return null;
	}
	return logo === 'sui' ? <SuiLogo /> : <SuigarLogo />;
}
