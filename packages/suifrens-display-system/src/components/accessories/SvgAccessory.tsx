import { useMemo } from 'react';
import type { AccessoryPlacement, SuiFrenSpecies } from '../../utils/accessoryUtils.js';
import { resolveEmbeddedSvgSymbolSource } from './svgSymbolDataUrl.js';

const DEFAULT_ORIGIN = 1500;
const SCALE_EPSILON = 0.0001;

function buildPlacementTransform(placement?: AccessoryPlacement) {
	if (!placement) {
		return undefined;
	}

	const transforms: Array<string> = [];
	const x = placement.x ?? 0;
	const y = placement.y ?? 0;
	const rotation = placement.rotation ?? 0;
	const scale = placement.scale ?? 1;
	const originX = placement.originX ?? DEFAULT_ORIGIN;
	const originY = placement.originY ?? DEFAULT_ORIGIN;

	if (x !== 0 || y !== 0) {
		transforms.push(`translate(${x} ${y})`);
	}
	if (rotation !== 0) {
		transforms.push(`rotate(${rotation} ${originX} ${originY})`);
	}
	if (Math.abs(scale - 1) > SCALE_EPSILON) {
		transforms.push(`translate(${originX} ${originY})`);
		transforms.push(`scale(${scale})`);
		transforms.push(`translate(${-originX} ${-originY})`);
	}

	return transforms.length > 0 ? transforms.join(' ') : undefined;
}

export type SvgAccessoryProps = {
	assetSrc: string;
	symbolId?: string;
	species: SuiFrenSpecies;
	placement?: Partial<Record<SuiFrenSpecies, AccessoryPlacement>>;
	viewport?: { x: number; y: number; width: number; height: number };
};

export function SvgAccessory({
	assetSrc,
	symbolId,
	species,
	placement,
	viewport,
}: SvgAccessoryProps) {
	const resolvedPlacement = placement?.[species];
	const transform = buildPlacementTransform(resolvedPlacement);
	const embeddedSymbolSrc = useMemo(
		() => (symbolId ? resolveEmbeddedSvgSymbolSource(assetSrc, symbolId) : undefined),
		[assetSrc, symbolId],
	);
	const imageSrc = embeddedSymbolSrc ?? (!symbolId ? assetSrc : null);
	const fragmentSrc =
		symbolId && embeddedSymbolSrc === undefined ? `${assetSrc}#${symbolId}` : null;

	return (
		<g transform={transform}>
			{imageSrc ? (
				<image
					href={imageSrc}
					x={viewport?.x ?? 0}
					y={viewport?.y ?? 0}
					width={viewport?.width ?? 3000}
					height={viewport?.height ?? 3000}
					preserveAspectRatio="xMidYMid meet"
				/>
			) : fragmentSrc ? (
				<use href={fragmentSrc} x="0" y="0" width="3000" height="3000" />
			) : null}
		</g>
	);
}
