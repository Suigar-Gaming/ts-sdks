// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

/**
 * Game identifiers and transaction option types for standard and PvP Suigar games.
 *
 * @module
 */

export { COIN_SIDES, GAMES, PVP_COINFLIP_ACTIONS } from './types/game.type.js';
export type {
	CoinSide,
	CancelPvPCoinflipTransactionOptions,
	CoinflipTransactionOptions,
	KenoTransactionOptions,
	CreatePvPCoinflipTransactionOptions,
	JoinPvPCoinflipTransactionOptions,
	LimboTransactionOptions,
	PlinkoTransactionOptions,
	RangeTransactionOptions,
	SoccerTransactionOptions,
	WheelTransactionOptions,
	CreateGameBetOptions,
	Game,
	PvPCoinflipAction,
	PvPGame,
	StandardGame,
} from './types/index.js';
