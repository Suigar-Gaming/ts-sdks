// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { GAME_SETTINGS } from '../types/game-settings.type.js';
import type { Game, GameParameterValue, OnChainGameParameters } from '../types/index.js';
import { fromMoveFloat, isMoveFloat } from '../utils/numeric.js';

/** Parses the schema selected by the game identifier. */
export function parseGameParameters<TGame extends Game>(
	game: TGame,
	content: Uint8Array,
): OnChainGameParameters<TGame>;
export function parseGameParameters(game: Game, content: Uint8Array): OnChainGameParameters<Game> {
	return GAME_SETTINGS[game].parameters.parse(content);
}

/**
 * Recursively converts generated Move float structs within game parameters to JavaScript numbers
 * while preserving on-chain integer strings.
 */
export function normalizeGameParameterValues<TGameParameters>(
	value: TGameParameters,
): GameParameterValue<TGameParameters>;
export function normalizeGameParameterValues(value: unknown): unknown {
	if (isMoveFloat(value)) {
		return fromMoveFloat(value);
	}

	if (Array.isArray(value)) {
		return value.map((item) => normalizeGameParameterValues(item));
	}

	if (typeof value === 'object' && value !== null) {
		const normalized: Record<string, unknown> = {};
		for (const [key, item] of Object.entries(value)) {
			normalized[key] = normalizeGameParameterValues(item);
		}
		return normalized;
	}

	return value;
}
