// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

export const GAMES = [
	'coinflip',
	'keno',
	'limbo',
	'plinko',
	'pvp-coinflip',
	'range',
	'soccer',
	'wheel',
] as const;

export const GAME_EVENTS = [
	'BetResultEvent',
	'GameCreatedEvent',
	'GameResolvedEvent',
	'GameCancelledEvent',
] as const;

export const COIN_SIDES = ['heads', 'tails'] as const;
export const PVP_COINFLIP_ACTIONS = ['create', 'join', 'cancel'] as const;

export type Game = (typeof GAMES)[number];

export type StandardGame = Exclude<Game, PvPGame>;
export type PvPGame = Extract<Game, `pvp-${string}`>;

export type CoinSide = (typeof COIN_SIDES)[number];
export type PvPCoinflipAction = (typeof PVP_COINFLIP_ACTIONS)[number];

export type GameEvent = (typeof GAME_EVENTS)[number];

/**
 * A supported Suigar game event.
 *
 * Standard games emit only `BetResultEvent`, while PvP game modules can emit every event in
 * `GAME_EVENTS`.
 */
export type SuigarGameEvent =
	| {
			game: StandardGame;
			event: 'BetResultEvent';
	  }
	| {
			game: PvPGame;
			event: GameEvent;
	  };
