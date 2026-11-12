// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { ComponentType } from 'react';
import { asRecord } from '../lib/format.js';
import { createInspectorViewModel } from '../lib/inspector.js';
import { ConfigView } from './config.js';
import { ExecutionStatusView } from './execution-status.js';
import { GameMetadataView } from './game-metadata.js';
import { NftView } from './nft.js';
import { ReferralView } from './referral.js';
import { SessionWalletView } from './session-wallet.js';
import { TransactionView } from './transaction.js';
import { WalletView } from './wallet.js';

export type AppViewProps = {
	payload: unknown;
	errors: Array<string>;
};

export type ResolvedAppView = {
	coinBadge: string | null;
	title: string;
	View: ComponentType<AppViewProps>;
};

export function resolveAppView(payload: unknown): ResolvedAppView {
	const result = asRecord(payload);
	const hasSessionWallet = Boolean(result['sessionWallet']);
	const hasReferral = Boolean(result['referral']);
	const hasSummary = Boolean(result['summary']);
	const hasSweethouse = Boolean(result['sweethouse']);
	const hasNft = Boolean(result['nft']);
	const hasGame = Boolean(result['game']);
	const hasSupportedGames = Boolean(result['supportedGames']);
	const hasExecution = Boolean(result['execution']);

	if (hasSessionWallet) {
		return {
			coinBadge: null,
			title: 'Session Wallet',
			View: SessionWalletView,
		};
	}
	const wallet = asRecord(result['wallet']);
	if (Array.isArray(wallet['balances']) || Array.isArray(wallet['coins'])) {
		return { coinBadge: null, title: 'Wallet', View: WalletView };
	}
	if (hasReferral && !hasSummary) {
		return { coinBadge: null, title: 'Referral Rewards', View: ReferralView };
	}
	const { coinBadge } = createInspectorViewModel({ payload, explicitErrors: [] });
	if (Array.isArray(result['ownedNfts'])) {
		return { coinBadge, title: 'NFT Collection', View: NftView };
	}
	if (hasSweethouse && !hasSummary) {
		return { coinBadge, title: 'SweetHouse Transaction', View: TransactionView };
	}
	if (hasNft && !hasSummary) {
		return { coinBadge, title: 'NFT Transaction', View: TransactionView };
	}
	if (hasGame && !hasSummary) {
		return { coinBadge, title: 'Game Metadata', View: GameMetadataView };
	}
	if (hasSupportedGames && !hasSummary) {
		return { coinBadge, title: 'Suigar Config', View: ConfigView };
	}
	const execution = asRecord(result['execution']);
	if (hasExecution && (!hasSummary || execution['wallet'] === 'session')) {
		return {
			coinBadge: null,
			title: 'Transaction Status',
			View: ExecutionStatusView,
		};
	}
	return { coinBadge, title: 'Transaction Inspector', View: TransactionView };
}
