import type { BodyAccessoryProps } from './AccessorySlot.js';

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

export type SoccerTeamSide = 'home' | 'away';
export type SoccerTeamPattern =
	| 'vertical'
	| 'horizontal'
	| 'cross'
	| 'diagonal'
	| 'sash'
	| 'quarters'
	| 'hoops'
	| 'canton'
	| 'sun'
	| 'chevron';

export type SoccerTeamKit = {
	code: string;
	primary: string;
	secondary: string;
	accent: string;
	pattern: SoccerTeamPattern;
};

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

export function resolveSoccerCountryCode(country?: unknown): SoccerTeamCountryCode {
	const normalized = typeof country === 'string' ? country.trim().toUpperCase() : 'US';
	return normalized in SOCCER_TEAM_KITS ? (normalized as SoccerTeamCountryCode) : 'US';
}

export function resolveSoccerTeamSide(side?: unknown): SoccerTeamSide {
	return side === 'away' ? 'away' : 'home';
}

export function resolveSoccerTeamKit(country?: unknown, side?: unknown): SoccerTeamKit {
	const candidate = country as Partial<SoccerTeamKit> | null;
	const patterns: ReadonlyArray<string> = [
		'vertical',
		'horizontal',
		'cross',
		'diagonal',
		'sash',
		'quarters',
		'hoops',
		'canton',
		'sun',
		'chevron',
	];
	const custom =
		candidate &&
		typeof candidate === 'object' &&
		typeof candidate.code === 'string' &&
		/^[A-Z0-9]{1,4}$/.test(candidate.code) &&
		[candidate.primary, candidate.secondary, candidate.accent].every(
			(value) => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value),
		) &&
		patterns.includes(candidate.pattern ?? '');
	const kit: SoccerTeamKit = custom
		? (candidate as SoccerTeamKit)
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

export function isLightHex(value: string) {
	const hex = value.replace(/^#/, '');
	if (!/^[0-9a-f]{6}$/i.test(hex)) {
		return false;
	}
	const red = parseInt(hex.slice(0, 2), 16);
	const green = parseInt(hex.slice(2, 4), 16);
	const blue = parseInt(hex.slice(4, 6), 16);
	return red * 0.2126 + green * 0.7152 + blue * 0.0722 >= 196;
}

export function contrastColor(value: string) {
	return isLightHex(value) ? DARK_STROKE : '#ffffff';
}

type SoccerKitMotifProps = {
	kit: SoccerTeamKit;
	x: number;
	y: number;
	width: number;
	height: number;
	clipId?: string;
	strokeWidth?: number;
	patchScale?: number;
};

type SoccerKitPatternProps = {
	kit: SoccerTeamKit;
	x: number;
	y: number;
	width: number;
	height: number;
};

export function SoccerKitPattern({ kit, x, y, width, height }: SoccerKitPatternProps) {
	const third = width / 3;
	const stripe = height / 3;
	const midX = x + width / 2;
	const midY = y + height / 2;
	const slim = Math.max(8, Math.min(width, height) * 0.12);
	const wide = Math.max(12, Math.min(width, height) * 0.2);

	switch (kit.pattern) {
		case 'horizontal':
			return (
				<>
					<rect x={x} y={y} width={width} height={height} fill={kit.primary} />
					<rect x={x} y={y + stripe} width={width} height={stripe} fill={kit.secondary} />
					<rect x={x} y={y + stripe * 2} width={width} height={stripe} fill={kit.accent} />
					<rect
						x={x}
						y={midY - slim * 0.35}
						width={width}
						height={slim * 0.7}
						fill={contrastColor(kit.primary)}
						opacity="0.18"
					/>
				</>
			);
		case 'vertical':
			return (
				<>
					<rect x={x} y={y} width={third} height={height} fill={kit.primary} />
					<rect x={x + third} y={y} width={third} height={height} fill={kit.secondary} />
					<rect x={x + third * 2} y={y} width={third} height={height} fill={kit.accent} />
					<rect
						x={midX - slim * 0.35}
						y={y}
						width={slim * 0.7}
						height={height}
						fill={contrastColor(kit.secondary)}
						opacity="0.16"
					/>
				</>
			);
		case 'cross':
			return (
				<>
					<rect x={x} y={y} width={width} height={height} fill={kit.primary} />
					<rect x={midX - wide / 2} y={y} width={wide} height={height} fill={kit.secondary} />
					<rect x={x} y={midY - wide / 2} width={width} height={wide} fill={kit.secondary} />
					<rect
						x={midX - slim / 2}
						y={y}
						width={slim}
						height={height}
						fill={kit.accent}
						opacity="0.9"
					/>
					<rect
						x={x}
						y={midY - slim / 2}
						width={width}
						height={slim}
						fill={kit.accent}
						opacity="0.9"
					/>
				</>
			);
		case 'diagonal':
			return (
				<>
					<rect x={x} y={y} width={width} height={height} fill={kit.primary} />
					<path
						d={`M${x - width * 0.1} ${y + height} L${x + width} ${y - height * 0.1} L${x + width * 1.12} ${y + height * 0.16} L${x + width * 0.16} ${y + height * 1.1}Z`}
						fill={kit.secondary}
					/>
					<path
						d={`M${x - width * 0.05} ${y + height} L${x + width} ${y - height * 0.05}`}
						stroke={kit.accent}
						strokeLinecap="round"
						strokeWidth={wide * 0.42}
					/>
				</>
			);
		case 'sash':
			return (
				<>
					<rect x={x} y={y} width={width} height={height} fill={kit.primary} />
					<path
						d={`M${x - width * 0.12} ${y + height * 0.18} L${x + width * 0.08} ${y - height * 0.04} L${x + width * 1.12} ${y + height * 0.82} L${x + width * 0.92} ${y + height * 1.04}Z`}
						fill={kit.secondary}
					/>
					<path
						d={`M${x - width * 0.03} ${y + height * 0.2} L${x + width * 1.03} ${y + height * 0.86}`}
						stroke={kit.accent}
						strokeLinecap="round"
						strokeWidth={slim}
					/>
				</>
			);
		case 'quarters':
			return (
				<>
					<rect x={x} y={y} width={width / 2} height={height / 2} fill={kit.primary} />
					<rect
						x={x + width / 2}
						y={y}
						width={width / 2}
						height={height / 2}
						fill={kit.secondary}
					/>
					<rect
						x={x}
						y={y + height / 2}
						width={width / 2}
						height={height / 2}
						fill={kit.secondary}
					/>
					<rect
						x={x + width / 2}
						y={y + height / 2}
						width={width / 2}
						height={height / 2}
						fill={kit.accent}
					/>
					<rect
						x={midX - slim * 0.2}
						y={y}
						width={slim * 0.4}
						height={height}
						fill={DARK_STROKE}
						opacity="0.18"
					/>
					<rect
						x={x}
						y={midY - slim * 0.2}
						width={width}
						height={slim * 0.4}
						fill={DARK_STROKE}
						opacity="0.18"
					/>
				</>
			);
		case 'hoops':
			return (
				<>
					<rect x={x} y={y} width={width} height={height} fill={kit.primary} />
					<rect
						x={x}
						y={y + height * 0.22}
						width={width}
						height={height * 0.15}
						fill={kit.secondary}
					/>
					<rect
						x={x}
						y={y + height * 0.51}
						width={width}
						height={height * 0.15}
						fill={kit.secondary}
					/>
					<rect
						x={x}
						y={y + height * 0.66}
						width={width}
						height={height * 0.08}
						fill={kit.accent}
					/>
				</>
			);
		case 'canton':
			return (
				<>
					<rect x={x} y={y} width={width} height={height} fill={kit.secondary} />
					<rect
						x={x}
						y={y + height * 0.18}
						width={width}
						height={height * 0.12}
						fill={kit.accent}
					/>
					<rect
						x={x}
						y={y + height * 0.45}
						width={width}
						height={height * 0.12}
						fill={kit.primary}
					/>
					<rect x={x} y={y} width={width * 0.42} height={height * 0.5} fill={kit.primary} />
					<circle
						cx={x + width * 0.2}
						cy={y + height * 0.23}
						r={Math.min(width, height) * 0.08}
						fill={kit.accent}
					/>
				</>
			);
		case 'sun':
			return (
				<>
					<rect x={x} y={y} width={width} height={height} fill={kit.primary} />
					<circle cx={midX} cy={midY} r={Math.min(width, height) * 0.28} fill={kit.accent} />
					<path
						d={`M${midX} ${y + height * 0.14} L${midX + width * 0.08} ${midY} L${midX} ${y + height * 0.86} L${midX - width * 0.08} ${midY}Z`}
						fill={kit.secondary}
						opacity="0.82"
					/>
					<rect
						x={x}
						y={midY - slim * 0.35}
						width={width}
						height={slim * 0.7}
						fill={kit.secondary}
						opacity="0.55"
					/>
				</>
			);
		case 'chevron':
			return (
				<>
					<rect x={x} y={y} width={width} height={height} fill={kit.primary} />
					<path
						d={`M${x} ${y} L${x + width * 0.46} ${midY} L${x} ${y + height}Z`}
						fill={kit.secondary}
					/>
					<path
						d={`M${x} ${y + height * 0.14} L${x + width * 0.34} ${midY} L${x} ${y + height * 0.86}Z`}
						fill={kit.accent}
					/>
					<rect
						x={x + width * 0.48}
						y={y}
						width={width * 0.12}
						height={height}
						fill={kit.secondary}
						opacity="0.6"
					/>
				</>
			);
		default:
			return <rect x={x} y={y} width={width} height={height} fill={kit.primary} />;
	}
}

function SoccerPatchFlag({ kit, x, y, width, height }: SoccerKitPatternProps) {
	return (
		<g opacity="0.34">
			<SoccerKitPattern kit={kit} x={x} y={y} width={width} height={height} />
		</g>
	);
}

export function SoccerKitMotif({
	kit,
	x,
	y,
	width,
	height,
	clipId,
	strokeWidth = 6,
	patchScale = 1,
}: SoccerKitMotifProps) {
	const code = kit.code === 'GLOBAL' ? 'GLO' : kit.code;
	const textSize = code.length > 2 ? 28 : 35;
	const patchWidth = 56 * patchScale;
	const patchHeight = 39 * patchScale;
	const patchX = x + width * 0.5 - patchWidth * 0.5;
	const patchY = y + height * 0.5 - patchHeight * 0.5;
	const textLength = patchWidth * (code.length > 2 ? 0.74 : 0.68);
	const motif = (
		<>
			<SoccerKitPattern kit={kit} x={x} y={y} width={width} height={height} />
			<rect
				x={patchX}
				y={patchY}
				width={patchWidth}
				height={patchHeight}
				rx={7 * patchScale}
				fill="#ffffff"
				stroke={DARK_STROKE}
				strokeWidth={strokeWidth}
			/>
			<SoccerPatchFlag
				kit={kit}
				x={patchX + strokeWidth * 0.75}
				y={patchY + strokeWidth * 0.75}
				width={patchWidth - strokeWidth * 1.5}
				height={patchHeight - strokeWidth * 1.5}
			/>
			<text
				x={patchX + patchWidth / 2}
				y={patchY + patchHeight * 0.68}
				textAnchor="middle"
				fontFamily="Arial, Helvetica, sans-serif"
				fontSize={textSize * patchScale}
				fontWeight="900"
				letterSpacing="0"
				textLength={textLength}
				lengthAdjust="spacingAndGlyphs"
				stroke="#ffffff"
				strokeWidth={2.8 * patchScale}
				paintOrder="stroke"
				fill={DARK_STROKE}
			>
				{code}
			</text>
		</>
	);

	return clipId ? <g clipPath={`url(#${clipId})`}>{motif}</g> : <>{motif}</>;
}

export type SoccerTeamAccessoryProps = BodyAccessoryProps & {
	country?: string | SoccerTeamKit;
	side?: SoccerTeamSide;
};

export { DARK_STROKE as SOCCER_TEAM_DARK_STROKE };
