// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { VIP_CROWN_IMAGE_VIEWPORT } from '../constants/crown-viewport.js';

const VIP_CROWN_ASSET_BY_NAME: Record<string, string> = {
	'bronze-1': new URL('../accessories/artwork/crowns/bronze-1.svg', import.meta.url).href,
	'bronze-2': new URL('../accessories/artwork/crowns/bronze-2.svg', import.meta.url).href,
	'bronze-3': new URL('../accessories/artwork/crowns/bronze-3.svg', import.meta.url).href,
	'silver-1': new URL('../accessories/artwork/crowns/silver-1.svg', import.meta.url).href,
	'silver-2': new URL('../accessories/artwork/crowns/silver-2.svg', import.meta.url).href,
	'silver-3': new URL('../accessories/artwork/crowns/silver-3.svg', import.meta.url).href,
	'gold-1': new URL('../accessories/artwork/crowns/gold-1.svg', import.meta.url).href,
	'gold-2': new URL('../accessories/artwork/crowns/gold-2.svg', import.meta.url).href,
	'gold-3': new URL('../accessories/artwork/crowns/gold-3.svg', import.meta.url).href,
	'platinum-1': new URL('../accessories/artwork/crowns/platinum-1.svg', import.meta.url).href,
	'platinum-2': new URL('../accessories/artwork/crowns/platinum-2.svg', import.meta.url).href,
	'platinum-3': new URL('../accessories/artwork/crowns/platinum-3.svg', import.meta.url).href,
	'diamond-1': new URL('../accessories/artwork/crowns/diamond-1.svg', import.meta.url).href,
	'diamond-2': new URL('../accessories/artwork/crowns/diamond-2.svg', import.meta.url).href,
	'diamond-3': new URL('../accessories/artwork/crowns/diamond-3.svg', import.meta.url).href,
	'master-1': new URL('../accessories/artwork/crowns/master-1.svg', import.meta.url).href,
	'master-2': new URL('../accessories/artwork/crowns/master-2.svg', import.meta.url).href,
	legend: new URL('../accessories/artwork/crowns/legend.svg', import.meta.url).href,
};

export function getVipCrownAssetSrc(name: string): string | undefined {
	return VIP_CROWN_ASSET_BY_NAME[name];
}

const VIP_CROWN_ASSET_SOURCES = new Set(Object.values(VIP_CROWN_ASSET_BY_NAME));

export function getVipCrownAssetViewport(
	assetSrc: string,
): typeof VIP_CROWN_IMAGE_VIEWPORT | undefined {
	return VIP_CROWN_ASSET_SOURCES.has(assetSrc) ? VIP_CROWN_IMAGE_VIEWPORT : undefined;
}
