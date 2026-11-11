// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { SOCCER_TEAM_PATTERNS, SOCCER_TEAM_SIDES } from '../constants/soccer-kit.js';

export type SoccerTeamCountryCode =
	| 'GLOBAL'
	| 'AR'
	| 'AT'
	| 'AU'
	| 'BA'
	| 'BE'
	| 'BR'
	| 'CA'
	| 'CD'
	| 'CH'
	| 'CI'
	| 'CO'
	| 'CV'
	| 'CW'
	| 'CZ'
	| 'DE'
	| 'DZ'
	| 'EC'
	| 'EG'
	| 'ES'
	| 'FR'
	| 'GB'
	| 'GH'
	| 'HT'
	| 'HR'
	| 'IQ'
	| 'IR'
	| 'JP'
	| 'JO'
	| 'KR'
	| 'MA'
	| 'MX'
	| 'NL'
	| 'NO'
	| 'NZ'
	| 'PA'
	| 'PY'
	| 'PT'
	| 'QA'
	| 'SA'
	| 'SCT'
	| 'SE'
	| 'SN'
	| 'TN'
	| 'TR'
	| 'US'
	| 'UY'
	| 'UZ'
	| 'ZA';

export type SoccerTeamSide = (typeof SOCCER_TEAM_SIDES)[number];
export type SoccerTeamPattern = (typeof SOCCER_TEAM_PATTERNS)[number];

export type SoccerTeamKit = {
	code: string;
	primary: string;
	secondary: string;
	accent: string;
	pattern: SoccerTeamPattern;
};
