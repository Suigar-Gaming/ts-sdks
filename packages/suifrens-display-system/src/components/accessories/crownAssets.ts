import { VIP_CROWN_IMAGE_VIEWPORT } from './crownViewport.js';
import bronzeI from './head/bronze-i.svg';
import bronzeIi from './head/bronze-ii.svg';
import bronzeIii from './head/bronze-iii.svg';
import diamondI from './head/diamond-i.svg';
import diamondIi from './head/diamond-ii.svg';
import diamondIii from './head/diamond-iii.svg';
import goldI from './head/gold-i.svg';
import goldIi from './head/gold-ii.svg';
import goldIii from './head/gold-iii.svg';
import legend from './head/legend.svg';
import masterI from './head/master-i.svg';
import masterIi from './head/master-ii.svg';
import platiniumI from './head/platinium-i.svg';
import platiniumIi from './head/platinium-ii.svg';
import platiniumIii from './head/platinium-iii.svg';
import silverI from './head/silver-i.svg';
import silverIi from './head/silver-ii.svg';
import silverIii from './head/silver-iii.svg';

const VIP_CROWN_ASSET_BY_NAME: Record<string, string> = {
	'bronze-i': new URL(bronzeI, import.meta.url).href,
	'bronze-ii': new URL(bronzeIi, import.meta.url).href,
	'bronze-iii': new URL(bronzeIii, import.meta.url).href,
	'silver-i': new URL(silverI, import.meta.url).href,
	'silver-ii': new URL(silverIi, import.meta.url).href,
	'silver-iii': new URL(silverIii, import.meta.url).href,
	'gold-i': new URL(goldI, import.meta.url).href,
	'gold-ii': new URL(goldIi, import.meta.url).href,
	'gold-iii': new URL(goldIii, import.meta.url).href,
	'platinium-i': new URL(platiniumI, import.meta.url).href,
	'platinium-ii': new URL(platiniumIi, import.meta.url).href,
	'platinium-iii': new URL(platiniumIii, import.meta.url).href,
	'diamond-i': new URL(diamondI, import.meta.url).href,
	'diamond-ii': new URL(diamondIi, import.meta.url).href,
	'diamond-iii': new URL(diamondIii, import.meta.url).href,
	'master-i': new URL(masterI, import.meta.url).href,
	'master-ii': new URL(masterIi, import.meta.url).href,
	legend: new URL(legend, import.meta.url).href,
};

export function getVipCrownAssetSrc(name: string) {
	return VIP_CROWN_ASSET_BY_NAME[name];
}

const VIP_CROWN_ASSET_SOURCES = new Set(Object.values(VIP_CROWN_ASSET_BY_NAME));

export function getVipCrownAssetViewport(assetSrc: string) {
	return VIP_CROWN_ASSET_SOURCES.has(assetSrc) ? VIP_CROWN_IMAGE_VIEWPORT : undefined;
}
