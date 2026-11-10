import { useId } from 'react';
import { artwork } from '../../generated/kitArtwork.js';
import type { AccessoryRendererProps } from '../../types/accessory.type.js';
import type { AnimationPart } from '../../types/animation.type.js';
import { resolveRunnerKit, RUNNER_ACCESSORY_NAMES } from './runnerKit.js';
import {
	contrastColor,
	resolveSoccerTeamKit,
	SOCCER_TEAM_ACCESSORY_NAMES,
} from './soccerTeamKit.js';
import { SvgArtwork } from './SvgArtwork.js';

export function isKitAccessory(name: string) {
	return RUNNER_ACCESSORY_NAMES.has(name) || SOCCER_TEAM_ACCESSORY_NAMES.has(name);
}

function applyValues(source: string, values: Record<string, string | number>) {
	// Only validated colors, codes, numbers and internal SVG transforms are substituted.
	return source.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(values[key]));
}

export function KitArtwork({
	accessory,
	species,
	body,
	lor,
	fallbackPart,
}: AccessoryRendererProps & { fallbackPart?: AnimationPart }) {
	const id = useId().replace(/[^\w-]/g, (c) => '-' + c.charCodeAt(0).toString(16) + '-');
	const layers = artwork[accessory.name];
	if (!layers || !isKitAccessory(accessory.name)) return null;
	const layer = body ? 'body' : (lor ?? 'default');
	let source = layers[layer] ?? layers['default'];
	if (RUNNER_ACCESSORY_NAMES.has(accessory.name)) {
		const kit = resolveRunnerKit(accessory.renderOptions.runnerKit);
		source = applyValues(layers[species] ?? source, {
			id,
			color: kit.color,
			number: kit.number,
			bibTransform: kit.mirrorBib ? 'translate(393 0) scale(-1 1)' : '',
		});
	} else {
		const options = accessory.renderOptions;
		const kit = resolveSoccerTeamKit(options.teamKit ?? options.country, options.side);
		const code = kit.code === 'GLOBAL' ? 'GLO' : kit.code;
		const patterns = artwork['patterns/' + kit.pattern];
		source = source.replace(/<g data-pattern-slot="(\w+)">\s*<\/g>/g, (_, slot: string) =>
			patterns[slot].trim().replace(/^<svg[^>]*>|<\/svg>$/g, ''),
		);
		source = applyValues(source, {
			id,
			...kit,
			label: code,
			fontSize: (code.length > 2 ? 28 : 35) * 1.24,
			textLength: 56 * 1.24 * (code.length > 2 ? 0.74 : 0.68),
			primaryContrast: contrastColor(kit.primary),
			secondaryContrast: contrastColor(kit.secondary),
		});
	}
	return <SvgArtwork source={source} fallbackPart={fallbackPart} />;
}
