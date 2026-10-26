// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Transaction } from '@mysten/sui/transactions';
import { normalizeStructTag, normalizeSuiAddress } from '@mysten/sui/utils';
import {
	claimCommissionBalance,
	claimReferrerLevelUpUsdRewardsV2,
} from '../contracts/referral/referral.js';
import { optionalOptions } from '../helpers/options.js';
import type {
	ClaimReferralCommissionOptions,
	ClaimReferralLevelUpUsdRewardsOptions,
	WithConfig,
} from '../types/index.js';
import { createBaseTransaction } from './shared.js';

export function buildClaimReferralCommissionTransaction(
	options: WithConfig<ClaimReferralCommissionOptions>,
): Transaction {
	const { config, owner, coinType } = options;
	const tx = createBaseTransaction(options);

	const claimedCoin = tx.add(
		claimCommissionBalance({
			...optionalOptions({ package: config.packageIds.referral }),
			typeArguments: [normalizeStructTag(coinType)],
			arguments: [config.objectIds.sweetHouse],
		}),
	);

	tx.transferObjects([claimedCoin], tx.pure.address(normalizeSuiAddress(owner)));

	return tx;
}

export function buildClaimReferralLevelUpUsdRewardsTransaction(
	options: WithConfig<ClaimReferralLevelUpUsdRewardsOptions>,
): Transaction {
	const { config, owner } = options;
	const tx = createBaseTransaction(options);

	const claimedCoin = tx.add(
		claimReferrerLevelUpUsdRewardsV2({
			...optionalOptions({ package: config.packageIds.referral }),
			typeArguments: [normalizeStructTag(config.coins.usdc.coinType)],
			arguments: [config.objectIds.sweetHouse, config.coins.usdc.priceInfoObjectId],
		}),
	);

	tx.transferObjects([claimedCoin], tx.pure.address(normalizeSuiAddress(owner)));

	return tx;
}
