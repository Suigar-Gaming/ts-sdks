// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { HEX_COLOR_PATTERN } from '../../constants/hex-color.js';
import {
	SOCCER_TEAM_KITS,
	SOCCER_TEAM_PATTERNS,
	SOCCER_TEAM_SIDES,
} from '../../constants/soccer-team-kit.js';
import type {
	SoccerTeamCountryCode,
	SoccerTeamKit,
	SoccerTeamSide,
} from '../../types/soccer-kit.type.js';

const TEAM_CODE_PATTERN: RegExp = /^[A-Z0-9]{1,4}$/u;

const DARK_STROKE = '#050916';

function isSoccerCountryCode(value: string): value is SoccerTeamCountryCode {
	return Object.hasOwn(SOCCER_TEAM_KITS, value);
}

function isSoccerTeamKit(value: unknown): value is SoccerTeamKit {
	if (
		value == null ||
		typeof value !== 'object' ||
		!('code' in value) ||
		!('primary' in value) ||
		!('secondary' in value) ||
		!('accent' in value) ||
		!('pattern' in value)
	) {
		return false;
	}

	return (
		typeof value.code === 'string' &&
		TEAM_CODE_PATTERN.test(value.code) &&
		[value.primary, value.secondary, value.accent].every(
			(color) => typeof color === 'string' && HEX_COLOR_PATTERN.test(color),
		) &&
		SOCCER_TEAM_PATTERNS.some((pattern) => pattern === value.pattern)
	);
}

export function resolveSoccerCountryCode(country?: unknown): SoccerTeamCountryCode {
	const normalized = typeof country === 'string' ? country.trim().toUpperCase() : 'US';
	return isSoccerCountryCode(normalized) ? normalized : 'US';
}

export function resolveSoccerTeamSide(side?: unknown): SoccerTeamSide {
	return SOCCER_TEAM_SIDES.find((candidate) => candidate === side) ?? 'home';
}

export function resolveSoccerTeamKit(country?: unknown, side?: unknown): SoccerTeamKit {
	const kit = isSoccerTeamKit(country)
		? country
		: SOCCER_TEAM_KITS[resolveSoccerCountryCode(country)];
	if (resolveSoccerTeamSide(side) === 'away') {
		return {
			code: kit.code,
			primary: kit.secondary,
			secondary: kit.primary,
			accent: kit.accent,
			pattern: kit.pattern,
		};
	}
	return kit;
}

export function isLightHex(value: string): boolean {
	const hex = value.startsWith('#') ? value : `#${value}`;
	if (!HEX_COLOR_PATTERN.test(hex)) {
		return false;
	}
	const red = parseInt(hex.slice(1, 3), 16);
	const green = parseInt(hex.slice(3, 5), 16);
	const blue = parseInt(hex.slice(5, 7), 16);
	return red * 0.2126 + green * 0.7152 + blue * 0.0722 >= 196;
}

export function contrastColor(value: string): '#ffffff' | typeof DARK_STROKE {
	return isLightHex(value) ? DARK_STROKE : '#ffffff';
}
