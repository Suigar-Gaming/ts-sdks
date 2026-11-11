// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import bronze1Url from '../../accessories/artwork/crowns/bronze-1.svg?url';
import bronze2Url from '../../accessories/artwork/crowns/bronze-2.svg?url';
import bronze3Url from '../../accessories/artwork/crowns/bronze-3.svg?url';
import diamond1Url from '../../accessories/artwork/crowns/diamond-1.svg?url';
import diamond2Url from '../../accessories/artwork/crowns/diamond-2.svg?url';
import diamond3Url from '../../accessories/artwork/crowns/diamond-3.svg?url';
import gold1Url from '../../accessories/artwork/crowns/gold-1.svg?url';
import gold2Url from '../../accessories/artwork/crowns/gold-2.svg?url';
import gold3Url from '../../accessories/artwork/crowns/gold-3.svg?url';
import legendUrl from '../../accessories/artwork/crowns/legend.svg?url';
import master1Url from '../../accessories/artwork/crowns/master-1.svg?url';
import master2Url from '../../accessories/artwork/crowns/master-2.svg?url';
import platinum1Url from '../../accessories/artwork/crowns/platinum-1.svg?url';
import platinum2Url from '../../accessories/artwork/crowns/platinum-2.svg?url';
import platinum3Url from '../../accessories/artwork/crowns/platinum-3.svg?url';
import silver1Url from '../../accessories/artwork/crowns/silver-1.svg?url';
import silver2Url from '../../accessories/artwork/crowns/silver-2.svg?url';
import silver3Url from '../../accessories/artwork/crowns/silver-3.svg?url';
import { VIP_CROWN_IMAGE_VIEWPORT } from '../../constants/crown-viewport.js';

const VIP_CROWN_ASSET_BY_NAME: Record<string, string> = {
	'bronze-1': bronze1Url,
	'bronze-2': bronze2Url,
	'bronze-3': bronze3Url,
	'silver-1': silver1Url,
	'silver-2': silver2Url,
	'silver-3': silver3Url,
	'gold-1': gold1Url,
	'gold-2': gold2Url,
	'gold-3': gold3Url,
	'platinum-1': platinum1Url,
	'platinum-2': platinum2Url,
	'platinum-3': platinum3Url,
	'diamond-1': diamond1Url,
	'diamond-2': diamond2Url,
	'diamond-3': diamond3Url,
	'master-1': master1Url,
	'master-2': master2Url,
	legend: legendUrl,
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
