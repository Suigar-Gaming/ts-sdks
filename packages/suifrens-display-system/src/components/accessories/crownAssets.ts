import { VIP_CROWN_IMAGE_VIEWPORT } from './crownViewport.js';

const VIP_CROWN_ASSET_BY_NAME: Record<string, string> = {
	'bronze-i': new URL('./head/bronze-i.svg', import.meta.url).href,
	'bronze-ii': new URL('./head/bronze-ii.svg', import.meta.url).href,
	'bronze-iii': new URL('./head/bronze-iii.svg', import.meta.url).href,
	'silver-i': new URL('./head/silver-i.svg', import.meta.url).href,
	'silver-ii': new URL('./head/silver-ii.svg', import.meta.url).href,
	'silver-iii': new URL('./head/silver-iii.svg', import.meta.url).href,
	'gold-i': new URL('./head/gold-i.svg', import.meta.url).href,
	'gold-ii': new URL('./head/gold-ii.svg', import.meta.url).href,
	'gold-iii': new URL('./head/gold-iii.svg', import.meta.url).href,
	'platinium-i': new URL('./head/platinium-i.svg', import.meta.url).href,
	'platinium-ii': new URL('./head/platinium-ii.svg', import.meta.url).href,
	'platinium-iii': new URL('./head/platinium-iii.svg', import.meta.url).href,
	'diamond-i': new URL('./head/diamond-i.svg', import.meta.url).href,
	'diamond-ii': new URL('./head/diamond-ii.svg', import.meta.url).href,
	'diamond-iii': new URL('./head/diamond-iii.svg', import.meta.url).href,
	'master-i': new URL('./head/master-i.svg', import.meta.url).href,
	'master-ii': new URL('./head/master-ii.svg', import.meta.url).href,
	legend: new URL('./head/legend.svg', import.meta.url).href,
};

export function getVipCrownAssetSrc(name: string) {
	return VIP_CROWN_ASSET_BY_NAME[name];
}

const VIP_CROWN_ASSET_SOURCES = new Set(Object.values(VIP_CROWN_ASSET_BY_NAME));

export function getVipCrownAssetViewport(assetSrc: string) {
	return VIP_CROWN_ASSET_SOURCES.has(assetSrc) ? VIP_CROWN_IMAGE_VIEWPORT : undefined;
}
