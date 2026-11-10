import { useId } from 'react';
import {
	resolveSoccerTeamKit,
	SOCCER_TEAM_DARK_STROKE,
	SoccerKitPattern,
	type SoccerTeamAccessoryProps,
} from '../soccerTeamKit.js';

const TRUNKS_BODY_PATH =
	'M0 188 C58 192 115 194 171 193 C224 192 263 190 293 188 C293 219 287 244 268 260 C232 285 185 293 157 294 H137 C85 293 48 286 14 245 C4 226 0 208 0 188Z';

const TRUNKS_LEG_PATH =
	'M-5.5 102.2 C9.5 95.5 34.5 90.5 69.2 92.5 C80.4 94 91 98.2 97.2 102.2 V149.6 L84.2 149.8 L10.3 148.9 L-5.5 148.3Z';

const TRUNKS_INK_STROKE_WIDTH = 10;

function svgId(prefix: string, id: string) {
	return `${prefix}-${id.replace(/:/g, '')}`;
}

function renderLeg(country: unknown, side: unknown, idPrefix: string, limb: 'front' | 'back') {
	const kit = resolveSoccerTeamKit(country, side);
	const clipId = svgId(idPrefix, `trunks-${limb}-leg-${kit.code}`);

	return (
		<g>
			<clipPath id={clipId}>
				<path d={TRUNKS_LEG_PATH} />
			</clipPath>
			<g clipPath={`url(#${clipId})`}>
				<SoccerKitPattern kit={kit} x={-7} y={90} width={106} height={64} />
			</g>
			<path
				d="M-5.5 102.2 V148.3 L10.3 148.9 L84.2 149.8 L97.2 149.6 V102.2"
				fill="none"
				stroke={SOCCER_TEAM_DARK_STROKE}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={TRUNKS_INK_STROKE_WIDTH}
			/>
		</g>
	);
}

function renderBody(country: unknown, side: unknown, idPrefix: string) {
	const kit = resolveSoccerTeamKit(country, side);
	const clipId = svgId(idPrefix, `trunks-body-${kit.code}`);

	return (
		<g>
			<clipPath id={clipId}>
				<path d={TRUNKS_BODY_PATH} />
			</clipPath>
			<g clipPath={`url(#${clipId})`}>
				<SoccerKitPattern kit={kit} x={0} y={188} width={293} height={106} />
			</g>
			<path
				d="M0 188 C58 192 115 194 171 193 C224 192 263 190 293 188"
				fill="none"
				stroke={kit.accent}
				strokeLinecap="round"
				strokeWidth="9"
			/>
			<path
				d="M146 202 C142 228 141 250 144 286"
				fill="none"
				stroke={SOCCER_TEAM_DARK_STROKE}
				strokeLinecap="round"
				strokeWidth={TRUNKS_INK_STROKE_WIDTH}
				opacity="0.8"
			/>
			<path
				d={TRUNKS_BODY_PATH}
				fill="none"
				stroke={SOCCER_TEAM_DARK_STROKE}
				strokeLinejoin="round"
				strokeWidth={TRUNKS_INK_STROKE_WIDTH}
			/>
		</g>
	);
}

export function SoccerTeamSwimTrunks(props: SoccerTeamAccessoryProps) {
	const idPrefix = svgId('soccer-team-trunks', useId());

	return (
		<svg
			version="1.1"
			id="pants_x5F_soccerteam_x5F_swimtrunks"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			viewBox="0 0 3000 3000"
			xmlSpace="preserve"
		>
			{!props.body ? (
				<>
					<g
						id="pants_x5F_soccerteam_x5F_swimtrunks_x5F_backleg"
						transform="matrix(2.9166107177734375, 0, 0, 2.9166107177734375, 1463.45,1961.9)"
					>
						{renderLeg(props.country, props.side, idPrefix, 'back')}
					</g>
					<g
						id="pants_x5F_soccerteam_x5F_swimtrunks_x5F_frontleg"
						transform="matrix(2.9166107177734375, 0, 0, 2.9166107177734375, 1042.6,1961.9)"
					>
						{renderLeg(props.country, props.side, idPrefix, 'front')}
					</g>
				</>
			) : null}
			{props.body ? (
				<g
					id="pants_x5F_soccerteam_x5F_swimtrunks_x5F_body"
					transform="matrix(2.9166107177734375, 0, 0, 2.9166107177734375, 956.65,1516.1)"
				>
					{renderBody(props.country, props.side, idPrefix)}
				</g>
			) : null}
		</svg>
	);
}
