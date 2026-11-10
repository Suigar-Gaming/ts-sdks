import { useId } from 'react';
import type { AccessoryMetadata, SuiFrenSpecies } from '../../utils/accessoryUtils.js';
import type { AccessoryRendererProps } from './AccessorySlot.js';
import { RUNNER_BODY_CONTOUR, RUNNER_FOOT_CONTOUR } from './runnerKitGeometry.js';

export type RunnerKitOptions = { color?: string; number?: number; mirrorBib?: boolean };
export const RUNNER_ACCESSORY_NAMES = new Set([
	'runner singlet',
	'runner shorts',
	'runner headband',
	'runner shoes',
]);
const INK = '#000000';
const SHORTS = '#30465d';
const BODY = 'matrix(2.9166107177734375, 0, 0, 2.9166107177734375, 956.65,1516.1)';
const HEAD = 'matrix(2.9166107177734375, 0, 0, 2.9166107177734375, 848.15,585.65)';
const LEGS = [
	{
		id: 'backleg',
		transform: 'matrix(2.9166107177734375, 0, 0, 2.9166107177734375, 1463.45,1961.9)',
	},
	{
		id: 'frontleg',
		transform: 'matrix(2.9166107177734375, 0, 0, 2.9166107177734375, 1042.6,1961.9)',
	},
];
export function resolveRunnerKit(value: unknown): Required<RunnerKitOptions> {
	const options = value && typeof value === 'object' ? (value as RunnerKitOptions) : {};
	return {
		color:
			typeof options.color === 'string' && /^#[0-9a-f]{6}$/i.test(options.color)
				? options.color
				: '#ef8fae',
		number:
			Number.isInteger(options.number) && options.number! >= 1 && options.number! <= 99
				? options.number!
				: 1,
		mirrorBib: options.mirrorBib === true,
	};
}
export function buildRunnerAccessories(options: RunnerKitOptions = {}): Array<AccessoryMetadata> {
	const runnerKit = resolveRunnerKit(options);
	return [...RUNNER_ACCESSORY_NAMES].map((name) => ({
		name,
		type:
			name === 'runner singlet'
				? 'torso'
				: name === 'runner shorts'
					? 'legs'
					: name === 'runner headband'
						? 'head'
						: 'feet',
		category: 'runner',
		collection: 'runner',
		description: 'Athletics kit with native animated limb registration.',
		price: 0,
		quantity: null,
		renderOptions: { runnerKit, showEars: true, showFin: true },
	}));
}
function Headband({ species, color }: { species: SuiFrenSpecies; color: string }) {
	return (
		<g
			id="runner-headband-head"
			transform={HEAD}
			fill={color}
			stroke={INK}
			strokeWidth="8"
			strokeLinejoin="round"
			strokeLinecap="round"
		>
			{/* The capy ribbon crosses in front of both ear roots, low at the near ear and rising beyond the far ear. */}
			<path
				d={
					species === 'bullshark'
						? 'M29.5 68.5C128 37 259 34 355.5 62.7C368 72 379 78 390 83.5C266 58 126 61 15 97.5C19 87 24 77 29.5 68.5Z'
						: 'M-6 103C35 73 90 43 143 35C176 30 200 15 216 2L236 2C217 27 184 45 147 52C95 60 42 88 1 120Z'
				}
			/>
			{/* Compact tied ends share one anchor at the back of the skull. */}
			<g transform={species === 'capy' ? 'translate(-12 24)' : undefined}>
				<path d="M24 84C6 77-10 79-24 89L-8 94L-15 107C2 108 16 101 29 92Z" />
				<path d="M26 86C12 96 6 111 7 130L21 124L32 99Z" />
				<path d="M19 80Q29 76 35 87L30 101Q19 103 15 93Z" />
			</g>
		</g>
	);
}
/** Clothing shares the native silhouette; accents are clipped within the fabric. */
export function RunnerAccessory({ accessory, species, body }: AccessoryRendererProps) {
	const kit = resolveRunnerKit(accessory.renderOptions.runnerKit);
	const name = accessory.name;
	const id = `runner-${useId().replace(/:/g, '')}`;
	const bodyClip = `${id}-body`,
		footClip = `${id}-foot`;
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3000 3000" data-runner-kit={name}>
			{name === 'runner headband' && <Headband species={species} color={kit.color} />}
			{(name === 'runner singlet' || name === 'runner shorts') && body && (
				<defs>
					<clipPath id={bodyClip}>
						<path d={RUNNER_BODY_CONTOUR} />
					</clipPath>
				</defs>
			)}
			{name === 'runner singlet' && body && (
				<g id="runner-singlet-body" transform={BODY}>
					<g clipPath={`url(#${bodyClip})`}>
						<path d="M-10-10H305V194Q147 215-10 192Z" fill={kit.color} />
						{/* Continuous inset binding follows the fabric edge beneath the native arms. */}
						<path d="M113 7Q147 41 181 7" fill="none" stroke="#fff6df" strokeWidth="6" />
						<path
							d="M101 13C59 35 32 72 22 119Q17 153 16 188Q147 207 280 188Q279 153 274 119C263 72 235 34 193 13"
							fill="none"
							stroke="#fff6df"
							strokeWidth="6"
							strokeLinejoin="round"
						/>

						<path
							d="M-8 194Q146 215 301 194"
							fill="none"
							stroke={INK}
							strokeWidth="7"
							strokeLinecap="round"
						/>
						<rect
							x="153"
							y="93"
							width="87"
							height="67"
							rx="8"
							fill="#fff6df"
							stroke={INK}
							strokeWidth="6"
						/>
						<g transform={kit.mirrorBib ? 'translate(393 0) scale(-1 1)' : undefined}>
							<text
								x="196.5"
								y="143"
								textAnchor="middle"
								fill={INK}
								fontFamily="sans-serif"
								fontSize="48"
								fontWeight="800"
							>
								{kit.number}
							</text>
						</g>
					</g>
				</g>
			)}
			{name === 'runner shorts' && body && (
				<g id="runner-shorts-body" transform={BODY}>
					<g clipPath={`url(#${bodyClip})`}>
						<path d="M-10 184H305V310H-10Z" fill={SHORTS} />
						<path
							d="M147 219Q142 253 147 291"
							fill="none"
							stroke={INK}
							strokeWidth="5"
							strokeLinecap="round"
						/>
					</g>
				</g>
			)}
			{name === 'runner shorts' &&
				!body &&
				LEGS.map((leg) => (
					<g key={leg.id} id={`runner-shorts-${leg.id}`} transform={leg.transform}>
						<path d="M8 104Q47 93 94 103L91 144Q46 152 5 140Z" fill={SHORTS} />
						<path
							d="M8 104L5 140Q46 152 91 144L94 103"
							fill="none"
							stroke={INK}
							strokeWidth="8"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M13 135Q47 146 84 139"
							fill="none"
							stroke={kit.color}
							strokeWidth="5"
							strokeLinecap="round"
						/>
					</g>
				))}
			{name === 'runner shoes' &&
				LEGS.map((leg) => (
					<g key={leg.id} id={`runner-shoes-${leg.id}`} transform={leg.transform}>
						<defs>
							<clipPath id={`${footClip}-${leg.id}`}>
								<path d={RUNNER_FOOT_CONTOUR} />
							</clipPath>
						</defs>
						<path
							d={RUNNER_FOOT_CONTOUR}
							fill="#fff6df"
							stroke={INK}
							strokeWidth="10"
							strokeLinejoin="round"
						/>
						<g clipPath={`url(#${footClip}-${leg.id})`}>
							<path
								d="M1 210Q14 232 40 231H88Q104 229 115 216"
								fill="none"
								stroke={INK}
								strokeWidth="5"
								strokeLinecap="round"
							/>
							<path
								d="M11 182L30 201L49 190"
								fill="none"
								stroke={kit.color}
								strokeWidth="8"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M59 178L74 193M72 178L86 191"
								fill="none"
								stroke={INK}
								strokeWidth="5"
								strokeLinecap="round"
							/>
						</g>
					</g>
				))}
		</svg>
	);
}
