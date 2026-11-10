import { VIP_CROWN_IMAGE_VIEWPORT } from '../constants/crown-viewport.js';

const VIP_CROWN_ASSET_BY_NAME: Record<string, string> = {
	'bronze-i': new URL('../accessories/artwork/crowns/bronze-i.svg', import.meta.url).href,
	'bronze-ii': new URL('../accessories/artwork/crowns/bronze-ii.svg', import.meta.url).href,
	'bronze-iii': new URL('../accessories/artwork/crowns/bronze-iii.svg', import.meta.url).href,
	'silver-i': new URL('../accessories/artwork/crowns/silver-i.svg', import.meta.url).href,
	'silver-ii': new URL('../accessories/artwork/crowns/silver-ii.svg', import.meta.url).href,
	'silver-iii': new URL('../accessories/artwork/crowns/silver-iii.svg', import.meta.url).href,
	'gold-i': new URL('../accessories/artwork/crowns/gold-i.svg', import.meta.url).href,
	'gold-ii': new URL('../accessories/artwork/crowns/gold-ii.svg', import.meta.url).href,
	'gold-iii': new URL('../accessories/artwork/crowns/gold-iii.svg', import.meta.url).href,
	'platinium-i': new URL('../accessories/artwork/crowns/platinium-i.svg', import.meta.url).href,
	'platinium-ii': new URL('../accessories/artwork/crowns/platinium-ii.svg', import.meta.url).href,
	'platinium-iii': new URL('../accessories/artwork/crowns/platinium-iii.svg', import.meta.url).href,
	'diamond-i': new URL('../accessories/artwork/crowns/diamond-i.svg', import.meta.url).href,
	'diamond-ii': new URL('../accessories/artwork/crowns/diamond-ii.svg', import.meta.url).href,
	'diamond-iii': new URL('../accessories/artwork/crowns/diamond-iii.svg', import.meta.url).href,
	'master-i': new URL('../accessories/artwork/crowns/master-i.svg', import.meta.url).href,
	'master-ii': new URL('../accessories/artwork/crowns/master-ii.svg', import.meta.url).href,
	legend: new URL('../accessories/artwork/crowns/legend.svg', import.meta.url).href,
};

export function getVipCrownAssetSrc(name: string) {
	return VIP_CROWN_ASSET_BY_NAME[name];
}

const VIP_CROWN_ASSET_SOURCES = new Set(Object.values(VIP_CROWN_ASSET_BY_NAME));

export function getVipCrownAssetViewport(assetSrc: string) {
	return VIP_CROWN_ASSET_SOURCES.has(assetSrc) ? VIP_CROWN_IMAGE_VIEWPORT : undefined;
}
