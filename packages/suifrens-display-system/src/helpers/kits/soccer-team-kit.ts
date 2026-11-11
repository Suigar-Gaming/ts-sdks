// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { HEX_COLOR_PATTERN } from '../../constants/hex-color.js';
import type {
	SoccerTeamCountryCode,
	SoccerTeamKit,
	SoccerTeamSide,
} from '../../types/soccer-kit.type.js';

const TEAM_CODE_PATTERN: RegExp = /^[A-Z0-9]{1,4}$/;

const DARK_STROKE = '#050916';

export const SOCCER_TEAM_KITS = {
	GLOBAL: {
		code: 'GLOBAL',
		primary: '#f8fafc',
		secondary: '#0f172a',
		accent: '#38bdf8',
		pattern: 'cross',
	},
	MX: {
		code: 'MX',
		primary: '#0f7a43',
		secondary: '#ffffff',
		accent: '#dc2626',
		pattern: 'vertical',
	},
	ZA: {
		code: 'ZA',
		primary: '#facc15',
		secondary: '#16a34a',
		accent: '#111827',
		pattern: 'chevron',
	},
	KR: { code: 'KR', primary: '#ffffff', secondary: '#ef4444', accent: '#2563eb', pattern: 'sun' },
	CZ: {
		code: 'CZ',
		primary: '#ffffff',
		secondary: '#dc2626',
		accent: '#2563eb',
		pattern: 'chevron',
	},
	CA: {
		code: 'CA',
		primary: '#ef233c',
		secondary: '#ffffff',
		accent: '#111827',
		pattern: 'vertical',
	},
	BA: {
		code: 'BA',
		primary: '#2563eb',
		secondary: '#facc15',
		accent: '#ffffff',
		pattern: 'diagonal',
	},
	QA: {
		code: 'QA',
		primary: '#7f1d1d',
		secondary: '#ffffff',
		accent: '#b91c1c',
		pattern: 'chevron',
	},
	CH: { code: 'CH', primary: '#dc2626', secondary: '#ffffff', accent: '#991b1b', pattern: 'cross' },
	BR: { code: 'BR', primary: '#f9d71c', secondary: '#1f8f43', accent: '#1d4ed8', pattern: 'sun' },
	HT: {
		code: 'HT',
		primary: '#1d4ed8',
		secondary: '#dc2626',
		accent: '#ffffff',
		pattern: 'horizontal',
	},
	MA: { code: 'MA', primary: '#c1121f', secondary: '#0f7a43', accent: '#ffffff', pattern: 'sun' },
	SCT: {
		code: 'SCT',
		primary: '#1d4ed8',
		secondary: '#ffffff',
		accent: '#0f172a',
		pattern: 'diagonal',
	},
	US: {
		code: 'US',
		primary: '#1d4ed8',
		secondary: '#ffffff',
		accent: '#dc2626',
		pattern: 'canton',
	},
	AU: {
		code: 'AU',
		primary: '#f4c430',
		secondary: '#0f7a43',
		accent: '#ffffff',
		pattern: 'diagonal',
	},
	PY: {
		code: 'PY',
		primary: '#dc2626',
		secondary: '#ffffff',
		accent: '#2563eb',
		pattern: 'horizontal',
	},
	TR: { code: 'TR', primary: '#dc2626', secondary: '#ffffff', accent: '#991b1b', pattern: 'sun' },
	DE: {
		code: 'DE',
		primary: '#ffffff',
		secondary: '#111827',
		accent: '#facc15',
		pattern: 'horizontal',
	},
	CW: { code: 'CW', primary: '#2563eb', secondary: '#facc15', accent: '#ffffff', pattern: 'hoops' },
	CI: {
		code: 'CI',
		primary: '#f97316',
		secondary: '#ffffff',
		accent: '#16a34a',
		pattern: 'vertical',
	},
	EC: {
		code: 'EC',
		primary: '#facc15',
		secondary: '#1d4ed8',
		accent: '#dc2626',
		pattern: 'horizontal',
	},
	NL: { code: 'NL', primary: '#f97316', secondary: '#111827', accent: '#ffffff', pattern: 'sash' },
	JP: { code: 'JP', primary: '#1d4ed8', secondary: '#ffffff', accent: '#ef4444', pattern: 'sun' },
	SE: { code: 'SE', primary: '#2563eb', secondary: '#facc15', accent: '#0f172a', pattern: 'cross' },
	TN: { code: 'TN', primary: '#ffffff', secondary: '#dc2626', accent: '#991b1b', pattern: 'sun' },
	BE: {
		code: 'BE',
		primary: '#dc2626',
		secondary: '#111827',
		accent: '#facc15',
		pattern: 'vertical',
	},
	EG: {
		code: 'EG',
		primary: '#dc2626',
		secondary: '#ffffff',
		accent: '#111827',
		pattern: 'horizontal',
	},
	IR: {
		code: 'IR',
		primary: '#16a34a',
		secondary: '#ffffff',
		accent: '#dc2626',
		pattern: 'horizontal',
	},
	NZ: {
		code: 'NZ',
		primary: '#111827',
		secondary: '#2563eb',
		accent: '#ef4444',
		pattern: 'canton',
	},
	ES: {
		code: 'ES',
		primary: '#dc2626',
		secondary: '#facc15',
		accent: '#1f2937',
		pattern: 'horizontal',
	},
	CV: { code: 'CV', primary: '#1d4ed8', secondary: '#ffffff', accent: '#dc2626', pattern: 'hoops' },
	SA: { code: 'SA', primary: '#16a34a', secondary: '#ffffff', accent: '#0f766e', pattern: 'sash' },
	UY: {
		code: 'UY',
		primary: '#60a5fa',
		secondary: '#ffffff',
		accent: '#f6c445',
		pattern: 'canton',
	},
	FR: {
		code: 'FR',
		primary: '#1d4ed8',
		secondary: '#ffffff',
		accent: '#ef4444',
		pattern: 'vertical',
	},
	SN: {
		code: 'SN',
		primary: '#16a34a',
		secondary: '#facc15',
		accent: '#dc2626',
		pattern: 'vertical',
	},
	IQ: {
		code: 'IQ',
		primary: '#ffffff',
		secondary: '#dc2626',
		accent: '#111827',
		pattern: 'horizontal',
	},
	NO: { code: 'NO', primary: '#dc2626', secondary: '#ffffff', accent: '#1d4ed8', pattern: 'cross' },
	AR: {
		code: 'AR',
		primary: '#74c6ef',
		secondary: '#ffffff',
		accent: '#f6c445',
		pattern: 'horizontal',
	},
	AT: {
		code: 'AT',
		primary: '#dc2626',
		secondary: '#ffffff',
		accent: '#991b1b',
		pattern: 'horizontal',
	},
	DZ: {
		code: 'DZ',
		primary: '#ffffff',
		secondary: '#16a34a',
		accent: '#dc2626',
		pattern: 'vertical',
	},
	JO: {
		code: 'JO',
		primary: '#111827',
		secondary: '#ffffff',
		accent: '#dc2626',
		pattern: 'chevron',
	},
	PT: {
		code: 'PT',
		primary: '#b91c1c',
		secondary: '#0f7a43',
		accent: '#facc15',
		pattern: 'vertical',
	},
	CO: {
		code: 'CO',
		primary: '#facc15',
		secondary: '#2563eb',
		accent: '#dc2626',
		pattern: 'horizontal',
	},
	UZ: {
		code: 'UZ',
		primary: '#38bdf8',
		secondary: '#ffffff',
		accent: '#16a34a',
		pattern: 'horizontal',
	},
	CD: { code: 'CD', primary: '#38bdf8', secondary: '#facc15', accent: '#dc2626', pattern: 'sash' },
	GB: { code: 'GB', primary: '#ffffff', secondary: '#dc2626', accent: '#1d4ed8', pattern: 'cross' },
	HR: {
		code: 'HR',
		primary: '#ffffff',
		secondary: '#dc2626',
		accent: '#2563eb',
		pattern: 'quarters',
	},
	GH: {
		code: 'GH',
		primary: '#ffffff',
		secondary: '#dc2626',
		accent: '#facc15',
		pattern: 'horizontal',
	},
	PA: {
		code: 'PA',
		primary: '#ffffff',
		secondary: '#dc2626',
		accent: '#2563eb',
		pattern: 'quarters',
	},
} as const satisfies Record<SoccerTeamCountryCode, SoccerTeamKit>;

export const SOCCER_TEAM_ACCESSORY_NAMES = new Set([
	'soccer team shirt',
	'soccer team swim trunks',
]);

function isSoccerCountryCode(value: string): value is SoccerTeamCountryCode {
	return Object.hasOwn(SOCCER_TEAM_KITS, value);
}

function isSoccerTeamKit(value: unknown): value is SoccerTeamKit {
	if (!value || typeof value !== 'object') {
		return false;
	}
	return (
		'code' in value &&
		typeof value.code === 'string' &&
		TEAM_CODE_PATTERN.test(value.code) &&
		'primary' in value &&
		typeof value.primary === 'string' &&
		HEX_COLOR_PATTERN.test(value.primary) &&
		'secondary' in value &&
		typeof value.secondary === 'string' &&
		HEX_COLOR_PATTERN.test(value.secondary) &&
		'accent' in value &&
		typeof value.accent === 'string' &&
		HEX_COLOR_PATTERN.test(value.accent) &&
		'pattern' in value &&
		(value.pattern === 'vertical' ||
			value.pattern === 'horizontal' ||
			value.pattern === 'cross' ||
			value.pattern === 'diagonal' ||
			value.pattern === 'sash' ||
			value.pattern === 'quarters' ||
			value.pattern === 'hoops' ||
			value.pattern === 'canton' ||
			value.pattern === 'sun' ||
			value.pattern === 'chevron')
	);
}

export function resolveSoccerCountryCode(country?: unknown): SoccerTeamCountryCode {
	const normalized = typeof country === 'string' ? country.trim().toUpperCase() : 'US';
	return isSoccerCountryCode(normalized) ? normalized : 'US';
}

export function resolveSoccerTeamSide(side?: unknown): SoccerTeamSide {
	return side === 'away' ? 'away' : 'home';
}

export function resolveSoccerTeamKit(country?: unknown, side?: unknown): SoccerTeamKit {
	const candidate = country;
	const kit = isSoccerTeamKit(candidate)
		? candidate
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
