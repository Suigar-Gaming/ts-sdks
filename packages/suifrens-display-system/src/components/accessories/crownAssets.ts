import { VIP_CROWN_IMAGE_VIEWPORT } from './crownViewport.js';

const VIP_CROWN_ASSET_BY_NAME: Record<string, string> = {
	'bronze-i': new URL('../../assets/accessories/crowns/bronze-i.svg', import.meta.url).href,
	'bronze-ii': new URL('../../assets/accessories/crowns/bronze-ii.svg', import.meta.url).href,
	'bronze-iii': new URL('../../assets/accessories/crowns/bronze-iii.svg', import.meta.url).href,
	'silver-i': new URL('../../assets/accessories/crowns/silver-i.svg', import.meta.url).href,
	'silver-ii': new URL('../../assets/accessories/crowns/silver-ii.svg', import.meta.url).href,
	'silver-iii': new URL('../../assets/accessories/crowns/silver-iii.svg', import.meta.url).href,
	'gold-i': new URL('../../assets/accessories/crowns/gold-i.svg', import.meta.url).href,
	'gold-ii': new URL('../../assets/accessories/crowns/gold-ii.svg', import.meta.url).href,
	'gold-iii': new URL('../../assets/accessories/crowns/gold-iii.svg', import.meta.url).href,
	'platinium-i': new URL('../../assets/accessories/crowns/platinium-i.svg', import.meta.url).href,
	'platinium-ii': new URL('../../assets/accessories/crowns/platinium-ii.svg', import.meta.url).href,
	'platinium-iii': new URL('../../assets/accessories/crowns/platinium-iii.svg', import.meta.url)
		.href,
	'diamond-i': new URL('../../assets/accessories/crowns/diamond-i.svg', import.meta.url).href,
	'diamond-ii': new URL('../../assets/accessories/crowns/diamond-ii.svg', import.meta.url).href,
	'diamond-iii': new URL('../../assets/accessories/crowns/diamond-iii.svg', import.meta.url).href,
	'master-i': new URL('../../assets/accessories/crowns/master-i.svg', import.meta.url).href,
	'master-ii': new URL('../../assets/accessories/crowns/master-ii.svg', import.meta.url).href,
	legend: new URL('../../assets/accessories/crowns/legend.svg', import.meta.url).href,
};

export function getVipCrownAssetSrc(name: string) {
	return VIP_CROWN_ASSET_BY_NAME[name];
}

const VIP_CROWN_ASSET_SOURCES = new Set(Object.values(VIP_CROWN_ASSET_BY_NAME));

export function getVipCrownAssetViewport(assetSrc: string) {
	return VIP_CROWN_ASSET_SOURCES.has(assetSrc) ? VIP_CROWN_IMAGE_VIEWPORT : undefined;
}
