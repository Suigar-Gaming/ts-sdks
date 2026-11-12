// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { PRESET_LOADERS } from '../../generated/presets/loaders.js';
import type { AnimationPresetCatalogue, AnimationSequence } from '../../types/animation.type.js';

type CatalogueLoader = () => Promise<AnimationPresetCatalogue>;

export function createPresetResolver(
	catalogues: ReadonlyArray<{ names: ReadonlyArray<string>; load: CatalogueLoader }>,
) {
	const loaders = new Map<string, CatalogueLoader>();
	const pending = new Map<CatalogueLoader, Promise<AnimationPresetCatalogue>>();
	for (const { names, load } of catalogues) {
		for (const name of names) {
			loaders.set(name, load);
		}
	}

	return {
		isDeferredPreset(this: void, name: string): boolean {
			return loaders.has(name);
		},
		async loadDeferredPresetSequence(this: void, name: string): Promise<AnimationSequence | null> {
			const load = loaders.get(name);
			if (!load) {
				return null;
			}
			let catalogue = pending.get(load);
			if (!catalogue) {
				catalogue = load().catch((error: unknown) => {
					pending.delete(load);
					throw error;
				});
				pending.set(load, catalogue);
			}
			return (await catalogue)[name] ?? null;
		},
	};
}

export const { isDeferredPreset, loadDeferredPresetSequence } =
	createPresetResolver(PRESET_LOADERS);
