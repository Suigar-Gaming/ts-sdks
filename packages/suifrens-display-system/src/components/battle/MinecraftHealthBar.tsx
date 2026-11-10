import type { CSSProperties, ReactNode } from 'react';

type HeartFill = 0 | 0.5 | 1;

type Pixel = { x: number; y: number };

const HEART_SHAPE = [
	'..##.##..',
	'.#######.',
	'#########',
	'#########',
	'.#######.',
	'..#####..',
	'...###...',
	'....#....',
	'.........',
] as const;

const HEART_WIDTH = HEART_SHAPE[0].length;
const HEART_HEIGHT = HEART_SHAPE.length;

function isFilled(x: number, y: number) {
	return HEART_SHAPE[y]?.[x] === '#';
}

function buildHeartPixels() {
	const shapePixels: Array<Pixel> = [];
	for (let y = 0; y < HEART_HEIGHT; y += 1) {
		for (let x = 0; x < HEART_WIDTH; x += 1) {
			if (isFilled(x, y)) {
				shapePixels.push({ x, y });
			}
		}
	}

	const outlinePixels: Array<Pixel> = [];
	const fillPixels: Array<Pixel> = [];

	for (const pixel of shapePixels) {
		const { x, y } = pixel;
		const neighbors: Array<Pixel> = [
			{ x: x + 1, y },
			{ x: x - 1, y },
			{ x, y: y + 1 },
			{ x, y: y - 1 },
		];
		const isOutline = neighbors.some(
			(neighbor) =>
				neighbor.x < 0 ||
				neighbor.x >= HEART_WIDTH ||
				neighbor.y < 0 ||
				neighbor.y >= HEART_HEIGHT ||
				!isFilled(neighbor.x, neighbor.y),
		);

		if (isOutline) {
			outlinePixels.push(pixel);
		} else {
			fillPixels.push(pixel);
		}
	}

	return { outlinePixels, fillPixels };
}

const HEART_PIXELS = buildHeartPixels();

function PixelHeart({ fill, size = 16 }: { fill: HeartFill; size?: number }) {
	const style: CSSProperties = { width: size, height: size * (HEART_HEIGHT / HEART_WIDTH) };
	const emptyFill = '#374151';
	const fullFill = '#ef4444';
	const outline = '#111827';

	const threshold = HEART_WIDTH * fill;

	return (
		<svg viewBox={`0 0 ${HEART_WIDTH} ${HEART_HEIGHT}`} shapeRendering="crispEdges" style={style}>
			{HEART_PIXELS.outlinePixels.map((pixel) => (
				<rect
					key={`${pixel.x}:${pixel.y}`}
					x={pixel.x}
					y={pixel.y}
					width="1"
					height="1"
					fill={outline}
				/>
			))}
			{HEART_PIXELS.fillPixels.map((pixel) => (
				<rect
					key={`${pixel.x}:${pixel.y}`}
					x={pixel.x}
					y={pixel.y}
					width="1"
					height="1"
					fill={emptyFill}
				/>
			))}
			{fill > 0
				? HEART_PIXELS.fillPixels
						.filter((pixel) => pixel.x + 0.5 <= threshold)
						.map((pixel) => (
							<rect
								key={`${pixel.x}:${pixel.y}:filled`}
								x={pixel.x}
								y={pixel.y}
								width="1"
								height="1"
								fill={fullFill}
							/>
						))
				: null}
		</svg>
	);
}

export type MinecraftHealthBarProps = {
	health: number;
	maxHealth?: number;
	hearts?: number;
	size?: number;
	label?: ReactNode;
	showNumbers?: boolean;
	style?: CSSProperties;
};

export function MinecraftHealthBar({
	health,
	maxHealth = 20,
	hearts = 10,
	size = 16,
	label,
	showNumbers = false,
	style,
}: MinecraftHealthBarProps) {
	const clampedHealth = Math.max(0, Math.min(health, maxHealth));
	const resolvedHearts = Math.max(0, hearts);
	const perHeart = resolvedHearts > 0 ? maxHealth / resolvedHearts : 0;
	const half = perHeart / 2;

	const heartStates: Array<HeartFill> = Array.from({ length: resolvedHearts }, (_, index) => {
		const remaining = clampedHealth - index * perHeart;
		if (remaining >= perHeart) {
			return 1;
		}
		if (remaining >= half) {
			return 0.5;
		}
		return 0;
	});

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 8,
				fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
				fontSize: 11,
				color: '#111827',
				...style,
			}}
		>
			{label ? (
				<span style={{ fontWeight: 700, textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}>
					{label}
				</span>
			) : null}
			{resolvedHearts > 0 ? (
				<div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
					{heartStates.map((fill, index) => (
						<PixelHeart key={index} fill={fill} size={size} />
					))}
				</div>
			) : null}
			{showNumbers ? (
				<span style={{ fontWeight: 700, color: '#374151' }}>
					{Math.round(clampedHealth)}/{Math.round(maxHealth)}
				</span>
			) : null}
		</div>
	);
}
