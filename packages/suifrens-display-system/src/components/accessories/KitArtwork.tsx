import { useId } from 'react';
import { SVG_WRAPPER_PATTERN } from '../../constants/svg-patterns.js';
import { artwork } from '../../generated/kit-artwork.js';
import { isKitAccessory } from '../../helpers/kit-accessory.js';
import { resolveRunnerKit, RUNNER_ACCESSORY_NAMES } from '../../helpers/runner-kit.js';
import { contrastColor, resolveSoccerTeamKit } from '../../helpers/soccer-team-kit.js';
import type { AccessoryRendererProps, AccessoryRenderOptions } from '../../types/accessory.type.js';
import type { AnimationPart } from '../../types/animation.type.js';
import { SvgArtwork } from './SvgArtwork.js';

const TEMPLATE_VARIABLE_PATTERN: RegExp = /\{\{(\w+)\}\}/g;
const PATTERN_SLOT_PATTERN: RegExp = /<g data-pattern-slot="(\w+)">\s*<\/g>/g;
const UNSAFE_ID_CHARACTER_PATTERN: RegExp = /[^\w-]/g;

function applyValues(source: string, values: Record<string, string | number>) {
	// Only validated colors, codes, numbers and internal SVG transforms are substituted.
	return source.replace(TEMPLATE_VARIABLE_PATTERN, (_, key: string) => String(values[key]));
}

function renderSoccerArtwork(source: string, options: AccessoryRenderOptions, id: string) {
	const kit = resolveSoccerTeamKit(options.teamKit ?? options.country, options.side);
	const code = kit.code === 'GLOBAL' ? 'GLO' : kit.code;
	const patterns = artwork['patterns/' + kit.pattern];
	source = source.replace(PATTERN_SLOT_PATTERN, (_, slot: string) => {
		const pattern = patterns?.[slot];
		if (!pattern) {
			throw new Error(`Missing SVG pattern ${kit.pattern}/${slot}`);
		}
		return pattern.trim().replace(SVG_WRAPPER_PATTERN, '');
	});
	return applyValues(source, {
		id,
		...kit,
		label: code,
		fontSize: (code.length > 2 ? 28 : 35) * 1.24,
		textLength: 56 * 1.24 * (code.length > 2 ? 0.74 : 0.68),
		primaryContrast: contrastColor(kit.primary),
		secondaryContrast: contrastColor(kit.secondary),
	});
}

export function KitArtwork({
	accessory,
	species,
	body,
	lor,
	fallbackPart,
}: AccessoryRendererProps & { fallbackPart?: AnimationPart | undefined }) {
	const id = useId().replace(
		UNSAFE_ID_CHARACTER_PATTERN,
		(c) => '-' + c.charCodeAt(0).toString(16) + '-',
	);
	const layers = artwork[accessory.name];
	if (!layers || !isKitAccessory(accessory.name)) {
		return null;
	}
	const layer = body ? 'body' : (lor ?? 'default');
	let source = layers[layer] ?? layers['default'];
	if (source === undefined) {
		return null;
	}
	if (RUNNER_ACCESSORY_NAMES.has(accessory.name)) {
		const kit = resolveRunnerKit(accessory.renderOptions.runnerKit);
		source = applyValues(layers[species] ?? source, {
			id,
			color: kit.color,
			number: kit.number,
			bibTransform: kit.mirrorBib ? 'translate(393 0) scale(-1 1)' : '',
		});
	} else {
		source = renderSoccerArtwork(source, accessory.renderOptions, id);
	}
	return <SvgArtwork source={source} fallbackPart={fallbackPart} />;
}
