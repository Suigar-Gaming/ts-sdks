// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { coinWithBalance, type Transaction } from '@mysten/sui/transactions';
import { normalizeStructTag, normalizeSuiAddress } from '@mysten/sui/utils';
import { StakedCoin } from '../contracts/core/house.js';
import {
	claimOwnRedeemRequestAfterDelay,
	depositPublicPoolAndMintStakedCoins,
	redeemRequest,
} from '../contracts/core/sweethouse.js';
import { optionalOptions } from '../helpers/options.js';
import type {
	ClaimOwnSweetHouseRedeemRequestAfterDelayOptions,
	DepositSweetHouseOptions,
	RedeemSweetHouseRequestOptions,
	WithConfig,
} from '../types/index.js';
import { toBigInt } from '../utils/numeric.js';
import { createBaseTransaction } from './shared.js';

export function buildDepositSweetHouseTransaction(
	options: WithConfig<DepositSweetHouseOptions>,
): Transaction {
	const { config, owner, coinType, amount, useGasCoin } = options;
	const tx = createBaseTransaction(options);
	const normalizedCoinType = normalizeStructTag(coinType);

	const stakedCoins = tx.add(
		depositPublicPoolAndMintStakedCoins({
			...optionalOptions({ package: config.packageIds.core }),
			typeArguments: [normalizedCoinType],
			arguments: [
				config.objectIds.sweetHouse,
				coinWithBalance({
					type: normalizedCoinType,
					balance: toBigInt(amount),
					...optionalOptions({ useGasCoin }),
				}),
			],
		}),
	);

	tx.transferObjects([stakedCoins], tx.pure.address(normalizeSuiAddress(owner)));

	return tx;
}

export function buildRedeemSweetHouseRequestTransaction(
	options: WithConfig<RedeemSweetHouseRequestOptions>,
): Transaction {
	const { config, coinType, amount } = options;
	const tx = createBaseTransaction(options);
	const normalizedCoinType = normalizeStructTag(coinType);

	tx.add(
		redeemRequest({
			...optionalOptions({ package: config.packageIds.core }),
			typeArguments: [normalizedCoinType],
			arguments: [
				config.objectIds.sweetHouse,
				coinWithBalance({
					type: StakedCoin.typeTag({
						...optionalOptions({ package: config.packageIds.core }),
						typeArguments: [normalizedCoinType],
					}),
					balance: toBigInt(amount),
					useGasCoin: false,
				}),
			],
		}),
	);

	return tx;
}

export function buildClaimOwnSweetHouseRedeemRequestAfterDelayTransaction(
	options: WithConfig<ClaimOwnSweetHouseRedeemRequestAfterDelayOptions>,
): Transaction {
	const { config, coinType, requestId } = options;
	const tx = createBaseTransaction(options);

	tx.add(
		claimOwnRedeemRequestAfterDelay({
			...optionalOptions({ package: config.packageIds.core }),
			typeArguments: [normalizeStructTag(coinType)],
			arguments: [config.objectIds.sweetHouse, requestId],
		}),
	);

	return tx;
}
