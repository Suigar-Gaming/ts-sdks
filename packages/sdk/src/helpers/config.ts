// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import {
	isValidStructTag,
	isValidSuiAddress,
	isValidSuiObjectId,
	normalizeStructTag,
	normalizeSuiAddress,
} from '@mysten/sui/utils';
import { COINS, OBJECT_IDS, PACKAGE_IDS } from '../configs/index.js';
import type {
	SuigarCoin,
	SuigarCoinMetadata,
	SuigarConfig,
	SuigarConfigOverrides,
	SuigarNetwork,
	WithCoinType,
	WithConfig,
} from '../types/index.js';

export const DEFAULT_CACHE_TTL_MS: number = 30 * 60 * 1000;

export function resolvePartnerAddress(partner: string | undefined): string | undefined {
	if (partner === undefined) {
		return undefined;
	}

	if (typeof partner !== 'string' || partner.trim().length <= 0) {
		throw new TypeError('Partner must be a non-empty string');
	}

	const normalizedPartner = normalizeSuiAddress(partner);

	if (!isValidSuiAddress(normalizedPartner)) {
		throw new TypeError('Invalid partner address');
	}

	return normalizedPartner;
}

export function resolveSuigarConfig({
	network,
	config = {},
}: {
	network: SuigarNetwork;
	config?: SuigarConfigOverrides;
}): SuigarConfig {
	const packageIds = PACKAGE_IDS[network];
	const objectIds = OBJECT_IDS[network];
	const coins = COINS[network];

	const resolvedCoins = getSupportedCoins(coins).reduce(
		(result, coin) => {
			result[coin] = resolveCoinMetadata({
				coin,
				coinMetadata: coins[coin],
				configCoinMetadata: config.coins?.[coin],
			});
			return result;
		},
		{} as SuigarConfig['coins'],
	);
	const resolvedPackageIds = { ...packageIds, ...config.packageIds };
	const resolvedObjectIds = { ...objectIds, ...config.objectIds };

	assertSuiObjectIds('package', resolvedPackageIds);
	assertSuiObjectIds('object', resolvedObjectIds);

	return {
		packageIds: resolvedPackageIds,
		objectIds: resolvedObjectIds,
		coins: resolvedCoins,
	};
}

export function resolvePriceInfoObjectId({ config, coinType }: WithConfig<WithCoinType>): string {
	const supportedCoin = resolveSupportedCoin({
		config,
		coinType,
	});
	const objectId = config.coins[supportedCoin].priceInfoObjectId;

	if (!objectId) {
		throw new TypeError(`Missing price info object configuration for coin type ${coinType}`);
	}

	return objectId;
}

function getSupportedCoins(coins: SuigarConfig['coins']): Array<SuigarCoin> {
	return Object.keys(coins) as Array<SuigarCoin>;
}

function assertSuiObjectIds<T extends Record<string, string | undefined>>(
	kind: 'package' | 'object',
	ids: T,
): asserts ids is T & { [K in keyof T]: Exclude<T[K], undefined> } {
	for (const [name, id] of Object.entries(ids)) {
		if (typeof id !== 'string' || !isValidSuiObjectId(id)) {
			throw new TypeError(`Invalid ${kind} id configuration for ${name}`);
		}
	}
}

function resolveCoinMetadata({
	coin,
	coinMetadata,
	configCoinMetadata,
}: {
	coin: SuigarCoin;
	coinMetadata: SuigarCoinMetadata;
	configCoinMetadata?: Partial<SuigarCoinMetadata>;
}): SuigarCoinMetadata {
	const metadata = { ...coinMetadata, ...configCoinMetadata };
	if (
		!isValidStructTag(metadata.coinType) ||
		!Number.isSafeInteger(metadata.decimals) ||
		!isValidSuiObjectId(metadata.priceInfoObjectId)
	) {
		throw new TypeError(`Invalid coin metadata configuration for supported coin ${coin}`);
	}

	return {
		...metadata,
		coinType: normalizeStructTag(metadata.coinType),
	};
}

function resolveSupportedCoin({ config, coinType }: WithConfig<WithCoinType>): SuigarCoin {
	const normalizedCoinType = normalizeStructTag(coinType);
	const supportedCoin = getSupportedCoins(config.coins).find(
		(coin) => config.coins[coin].coinType === normalizedCoinType,
	);

	if (!supportedCoin) {
		throw new RangeError(
			`Unsupported coin type ${coinType}. Supported coin types: ${Object.values(config.coins)
				.map(({ coinType }) => coinType)
				.join(', ')}`,
		);
	}

	return supportedCoin;
}
