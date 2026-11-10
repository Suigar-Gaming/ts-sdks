import type { EasingFunction, EasingName } from '../types/animation.type.js';

const EASINGS: Record<EasingName, EasingFunction> = {
	linear: (t) => t,
	easeIn: (t) => t * t,
	easeOut: (t) => 1 - (1 - t) * (1 - t),
	easeInOut: (t) => {
		if (t <= 0.5) {
			return 2 * t * t;
		}
		return 1 - 2 * (1 - t) * (1 - t);
	},
};

export function getEasing(name: EasingName | undefined): EasingFunction {
	if (!name) {
		return EASINGS.linear;
	}
	return EASINGS[name] ?? EASINGS.linear;
}
