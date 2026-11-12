'use client';

import type { SuigarClient } from '@suigar/sdk';
import { toBigInt } from '@suigar/sdk/utils';
import type {
	GameConfigOption,
	PvPGameId,
	PvPGameParametersSummary,
	StakeRangeSummary,
	StandardGameId,
	StandardGameParametersSummary,
} from '@/lib/suigar-types';

type StandardGameParametersResult = Awaited<ReturnType<SuigarClient['getGameParameters']>>;

type ConfigEntry = {
	key: number;
	value: {
		min_stake: bigint | string | number;
		max_stake: bigint | string | number;
		is_playable: boolean;
	};
};

function formatAtomicAmount(value: bigint, decimals: number) {
	const divisor = BigInt(10) ** BigInt(decimals);
	const whole = value / divisor;
	const fraction = value % divisor;

	if (fraction === BigInt(0)) {
		return whole.toString();
	}

	const trimmedFraction = fraction.toString().padStart(decimals, '0').replace(/0+$/u, '');

	return `${whole.toString()}.${trimmedFraction}`;
}

function toStakeRange(minStake: bigint, maxStake: bigint, decimals: number): StakeRangeSummary {
	return {
		min: formatAtomicAmount(minStake, decimals),
		max: formatAtomicAmount(maxStake, decimals),
		kind: 'range',
	};
}

function toStakeMinimum(minStake: bigint, decimals: number): StakeRangeSummary {
	const formattedMinimum = formatAtomicAmount(minStake, decimals);

	return {
		min: formattedMinimum,
		max: formattedMinimum,
		kind: 'minimum',
	};
}

function toConfigOptions<TEntry extends ConfigEntry>(
	entries: Array<TEntry>,
	decimals: number,
	buildConfig: (entry: TEntry) => Pick<GameConfigOption, 'label' | 'details' | 'multiplierValues'>,
): Array<GameConfigOption> {
	return entries.map((entry) => {
		const stakeRange = toStakeRange(
			toBigInt(entry.value.min_stake),
			toBigInt(entry.value.max_stake),
			decimals,
		);
		const config = buildConfig(entry);

		return {
			id: String(entry.key),
			...config,
			isPlayable: entry.value.is_playable,
			stakeRange,
		};
	});
}

function toKenoPaytableMultipliers({
	paytable,
	minPicks,
	maxPicks,
}: {
	paytable: Array<number>;
	minPicks: number;
	maxPicks: number;
}): NonNullable<GameConfigOption['multiplierValues']> {
	const expectedLength = Array.from(
		{ length: maxPicks - minPicks + 1 },
		(_value, index) => minPicks + index + 1,
	).reduce((total, item) => total + item, 0);

	if (expectedLength !== paytable.length) {
		return paytable.map((value, index) => ({
			id: String(index),
			label: `Entry ${index}`,
			value: String(value),
		}));
	}

	let offset = 0;
	return Array.from({ length: maxPicks - minPicks + 1 }, (_value, pickIndex) => {
		const pickCount = minPicks + pickIndex;
		return Array.from({ length: pickCount + 1 }, (_hitValue, hitCount) => {
			const value = paytable[offset];
			const id = `${pickCount}-${hitCount}`;
			offset += 1;
			return {
				id,
				label: `${pickCount} pick${pickCount === 1 ? '' : 's'}, ${hitCount} hit${
					hitCount === 1 ? '' : 's'
				}`,
				value: String(value),
			};
		});
	}).flat();
}

export function summarizeStandardGameParameters(
	game: StandardGameId,
	parameters: StandardGameParametersResult,
	decimals: number,
): StandardGameParametersSummary {
	switch (game) {
		case 'coinflip': {
			if (!('max_stake' in parameters)) {
				throw new TypeError('Game settings do not match the selected game.');
			}
			const stakeRange = toStakeRange(
				toBigInt(parameters.min_stake),
				toBigInt(parameters.max_stake),
				decimals,
			);

			return { stakeRange };
		}
		case 'limbo': {
			if (!('min_target_multiplier' in parameters)) {
				throw new TypeError('Game settings do not match the selected game.');
			}
			const stakeRange = toStakeRange(
				toBigInt(parameters.min_stake),
				toBigInt(parameters.max_stake),
				decimals,
			);

			return {
				stakeRange,
				betCountLimit: {
					max: toBigInt(parameters.max_number_of_games),
					label: 'games',
				},
				targetMultiplierRange: {
					min: parameters.min_target_multiplier,
					max: parameters.max_target_multiplier,
				},
			};
		}
		case 'keno': {
			if (!('configs' in parameters)) {
				throw new TypeError('Game settings do not match the selected game.');
			}
			const entries = parameters.configs.contents;
			if (
				!entries.every(
					(entry): entry is Extract<typeof entry, { value: { board_size: number } }> =>
						'board_size' in entry.value,
				)
			) {
				throw new TypeError('Game settings do not match the selected game.');
			}
			const stakeRange = toStakeRange(
				toBigInt(parameters.min_stake),
				toBigInt(parameters.max_stake),
				decimals,
			);
			const configs = toConfigOptions(entries, decimals, (entry) => ({
				label: `Config ${entry.key}`,
				details: [
					{ label: 'Board size', value: String(entry.value.board_size) },
					{ label: 'Draw count', value: String(entry.value.draw_count) },
					{
						label: 'Picks',
						value: `${entry.value.min_picks}-${entry.value.max_picks}`,
					},
					{ label: 'Paytable entries', value: String(entry.value.paytable.length) },
				],
				multiplierValues: toKenoPaytableMultipliers({
					paytable: entry.value.paytable,
					minPicks: entry.value.min_picks,
					maxPicks: entry.value.max_picks,
				}),
				keno: {
					boardSize: entry.value.board_size,
					drawCount: entry.value.draw_count,
					minPicks: entry.value.min_picks,
					maxPicks: entry.value.max_picks,
				},
			}));
			const firstPlayableConfig = configs.find((config) => config.isPlayable) ?? configs[0];
			const firstConfig = firstPlayableConfig
				? entries.find((entry) => String(entry.key) === firstPlayableConfig.id)
				: undefined;

			return {
				stakeRange,
				betCountLimit: firstConfig
					? {
							max: toBigInt(firstConfig.value.max_number_of_games),
							label: 'games',
						}
					: undefined,
				configOptions: configs,
				kenoBounds: firstConfig
					? {
							boardSize: firstConfig.value.board_size,
							drawCount: firstConfig.value.draw_count,
							minPicks: firstConfig.value.min_picks,
							maxPicks: firstConfig.value.max_picks,
							minRtp: firstConfig.value.min_rtp,
							maxRtp: firstConfig.value.max_rtp,
						}
					: undefined,
			};
		}
		case 'range': {
			if (!('min_zone_size' in parameters)) {
				throw new TypeError('Game settings do not match the selected game.');
			}
			const stakeRange = toStakeRange(
				toBigInt(parameters.min_stake),
				toBigInt(parameters.max_stake),
				decimals,
			);

			return {
				stakeRange,
				betCountLimit: {
					max: toBigInt(parameters.max_number_of_games),
					label: 'games',
				},
				rangeBounds: {
					minZoneSize: Number(parameters.min_zone_size),
					maxZoneSize: Number(parameters.max_zone_size),
					minRtp: parameters.min_rtp,
					maxRtp: parameters.max_rtp,
				},
			};
		}
		case 'plinko': {
			if (!('max_number_of_balls' in parameters)) {
				throw new TypeError('Game settings do not match the selected game.');
			}
			const stakeRange = toStakeRange(
				toBigInt(parameters.min_stake),
				toBigInt(parameters.max_stake),
				decimals,
			);
			const configs = toConfigOptions(parameters.configs.contents, decimals, (entry) => ({
				label: `Config ${entry.key}`,
				details: [
					{ label: 'Rows', value: String(entry.value.num_rows) },
					{ label: 'Slots', value: String(entry.value.multipliers.length) },
				],
				multiplierValues: entry.value.multipliers.map((value) => ({
					id: crypto.randomUUID(),
					value: String(value),
				})),
			}));

			return {
				stakeRange,
				betCountLimit: {
					max: toBigInt(parameters.max_number_of_balls),
					label: 'balls',
				},
				configOptions: configs,
			};
		}
		case 'wheel': {
			if (!('max_number_of_spins' in parameters)) {
				throw new TypeError('Game settings do not match the selected game.');
			}
			const stakeRange = toStakeRange(
				toBigInt(parameters.min_stake),
				toBigInt(parameters.max_stake),
				decimals,
			);
			const configs = toConfigOptions(parameters.configs.contents, decimals, (entry) => ({
				label: `Config ${entry.key}`,
				details: [
					{ label: 'Cases', value: String(entry.value.num_cases) },
					{
						label: 'Multipliers',
						value: String(entry.value.multipliers.length),
					},
				],
				multiplierValues: entry.value.multipliers.map((value) => ({
					id: crypto.randomUUID(),
					value: String(value),
				})),
			}));

			return {
				stakeRange,
				betCountLimit: {
					max: toBigInt(parameters.max_number_of_spins),
					label: 'spins',
				},
				configOptions: configs,
			};
		}
		case 'soccer': {
			if (!('max_number_of_shots' in parameters)) {
				throw new TypeError('Game settings do not match the selected game.');
			}
			const stakeRange = toStakeRange(
				toBigInt(parameters.min_stake),
				toBigInt(parameters.max_stake),
				decimals,
			);
			const configs = toConfigOptions(parameters.configs.contents, decimals, (entry) => ({
				label: `Config ${entry.key}`,
				details: [
					{
						label: 'Countries',
						value: String(parameters.countries.contents.length),
					},
					{
						label: 'Shot zones',
						value: String(entry.value.shot_zone_ids.length),
					},
					{
						label: 'Multipliers',
						value: String(entry.value.shot_zone_multipliers.length),
					},
				],
				multiplierValues: entry.value.shot_zone_multipliers.map((value, index) => ({
					id: String(entry.value.shot_zone_ids[index]),
					value: String(value),
				})),
			}));

			return {
				stakeRange,
				betCountLimit: {
					max: toBigInt(parameters.max_number_of_shots),
					label: 'shots',
				},
				configOptions: configs,
				countryOptions: parameters.countries.contents.map((country) => ({
					id: String(country.key),
					label: `${country.value} (${country.key})`,
				})),
				topLevelDetails: parameters.countries.contents.map((country) => ({
					label: `Country ${country.key}`,
					value: country.value,
				})),
			};
		}
		default:
			return {
				stakeRange: {
					min: '0',
					max: '0',
				},
			};
	}
}

export function summarizePvPGameParameters(
	game: PvPGameId,
	parameters: StandardGameParametersResult,
	decimals: number,
): PvPGameParametersSummary {
	switch (game) {
		case 'pvp-coinflip': {
			if (!('house_edge_bps' in parameters)) {
				throw new TypeError('Game settings do not match the selected game.');
			}

			return {
				stakeRange: toStakeMinimum(toBigInt(parameters.min_stake), decimals),
				topLevelDetails: [
					{
						label: 'House edge (bps)',
						value: parameters.house_edge_bps,
					},
				],
			};
		}
		default:
			return {
				stakeRange: {
					min: '0',
					max: '0',
					kind: 'range',
				},
			};
	}
}

export function findGameConfigOption(
	parameters: StandardGameParametersSummary | null,
	configId: string,
) {
	return parameters?.configOptions?.find((option) => option.id === configId) ?? null;
}

export function resolveStakeRangeForGame(
	game: StandardGameId,
	parameters: StandardGameParametersSummary | null,
	configId?: string,
) {
	if (!parameters) {
		return null;
	}

	if (
		(game === 'keno' || game === 'plinko' || game === 'wheel') &&
		configId != null &&
		configId !== ''
	) {
		return findGameConfigOption(parameters, configId)?.stakeRange ?? parameters.stakeRange;
	}

	return parameters.stakeRange;
}
