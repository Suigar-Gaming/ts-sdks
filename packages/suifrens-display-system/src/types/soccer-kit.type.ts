// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type {
	SOCCER_TEAM_COUNTRY_CODES,
	SOCCER_TEAM_PATTERNS,
	SOCCER_TEAM_SIDES,
} from '../constants/soccer-team-kit.js';

export type SoccerTeamCountryCode = (typeof SOCCER_TEAM_COUNTRY_CODES)[number];

export type SoccerTeamSide = (typeof SOCCER_TEAM_SIDES)[number];
export type SoccerTeamPattern = (typeof SOCCER_TEAM_PATTERNS)[number];

export type SoccerTeamKit = {
	code: string;
	primary: string;
	secondary: string;
	accent: string;
	pattern: SoccerTeamPattern;
};
