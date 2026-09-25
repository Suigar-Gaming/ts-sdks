// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Transaction } from '@mysten/sui/transactions';
import type { CoinSide, Game, PvPCoinflipAction, StandardGame } from '@suigar/sdk/games';
import {
	buildTransactionResult,
	createSuigarClient,
	executeSessionTransaction,
	type McpConfig,
	type ReadOnlyPlan,
	resolveDefaultCoinType,
	resolveOwnerAddress,
	type SuigarClientBundle,
	type ToolTextResult,
	type TransactionSummaryContext,
} from '../../runtime/index.js';
import {
	BASE_UNIT_AMOUNT_PATTERN,
	POSITIVE_INTEGER_PATTERN,
	toBaseUnits,
	toCurrencyAmountText,
} from '../../utils/index.js';
import {
	createExecutionBridge,
	loadSessionSigner,
	loadSessionWallet,
	resolveWebOrigin,
} from '../../wallet/index.js';
import type {
	CoinflipInput,
	ConfigIdInput,
	KenoInput,
	LimboInput,
	PvpCoinflipCancelInput,
	PvpCoinflipCreateInput,
	PvpCoinflipJoinInput,
	RangeInput,
	SoccerInput,
	StandardTransactionToolInput,
	TransactionToolInput,
} from '../schemas/index.js';
import {
	asTextResponse,
	coinMetadataForAmount,
	GAME_LABELS,
	getConfigInput,
	getMode,
	getSuigarPackageId,
	requireString,
} from './shared.js';

type BetTransactionToolInput =
	| StandardTransactionToolInput
	| PvpCoinflipCreateInput
	| PvpCoinflipJoinInput;

export async function buildCoinflipTransactionTool(
	input: CoinflipInput = {},
): Promise<ToolTextResult> {
	if (getMode(input.mode) === 'read-only') {
		return asTextResponse(
			readOnlyPlan({
				input,
				game: 'coinflip',
				requiredInputs: ['owner', 'stake', 'side'],
				notes: [
					'Uses the configured SweetHouse object, Pyth price info, clock, and randomness objects.',
				],
			}),
		);
	}

	const side = requireString({ value: input.side, fieldName: 'side' }) as CoinSide;
	return buildTransactionTool({
		input,
		game: 'coinflip',
		stakeDisplay: toCurrencyAmountText({ value: input.stake, fieldName: 'stake' }),
		gameInputs: { side },
		createTransaction: async (bundle) =>
			bundle.client.suigar.tx.createGameBet({
				game: 'coinflip',
				...(await stakeOptions({ input, bundle })),
				side,
			}),
	});
}

export async function buildLimboTransactionTool(input: LimboInput = {}): Promise<ToolTextResult> {
	if (getMode(input.mode) === 'read-only') {
		return asTextResponse(
			readOnlyPlan({
				input,
				game: 'limbo',
				requiredInputs: ['owner', 'stake', 'targetMultiplier'],
				notes: [
					'Target multiplier is encoded by @suigar/sdk using the public fixed-point utility defaults.',
				],
			}),
		);
	}

	const targetMultiplier = requireNumber({
		value: input.targetMultiplier,
		fieldName: 'targetMultiplier',
	});
	return buildTransactionTool({
		input,
		game: 'limbo',
		stakeDisplay: toCurrencyAmountText({ value: input.stake, fieldName: 'stake' }),
		gameInputs: { targetMultiplier },
		createTransaction: async (bundle) =>
			bundle.client.suigar.tx.createGameBet({
				game: 'limbo',
				...(await stakeOptions({ input, bundle })),
				targetMultiplier,
			}),
	});
}

export async function buildKenoTransactionTool(input: KenoInput = {}): Promise<ToolTextResult> {
	if (getMode(input.mode) === 'read-only') {
		return asTextResponse(
			readOnlyPlan({
				input,
				game: 'keno',
				requiredInputs: ['owner', 'stake', 'configId', 'picks'],
				notes: ['Config id and picks select the on-chain Keno board configuration and numbers.'],
			}),
		);
	}

	const configId = requireNumber({ value: input.configId, fieldName: 'configId' });
	const picks = requireNumberArray({ value: input.picks, fieldName: 'picks' });
	return buildTransactionTool({
		input,
		game: 'keno',
		stakeDisplay: toCurrencyAmountText({ value: input.stake, fieldName: 'stake' }),
		gameInputs: { configId, picks },
		createTransaction: async (bundle) =>
			bundle.client.suigar.tx.createGameBet({
				game: 'keno',
				...(await stakeOptions({ input, bundle })),
				configId,
				picks,
			}),
	});
}

async function buildConfigIdTransactionTool({
	input,
	game,
}: {
	input: ConfigIdInput;
	game: Extract<StandardGame, 'plinko' | 'wheel'>;
}): Promise<ToolTextResult> {
	if (getMode(input.mode) === 'read-only') {
		return asTextResponse(
			readOnlyPlan({
				input,
				game,
				requiredInputs: ['owner', 'stake', 'configId'],
				notes: ['Config id selects the on-chain game configuration.'],
			}),
		);
	}

	const configId = requireNumber({ value: input.configId, fieldName: 'configId' });
	return buildTransactionTool({
		input,
		game,
		stakeDisplay: toCurrencyAmountText({ value: input.stake, fieldName: 'stake' }),
		gameInputs: { configId },
		createTransaction: async (bundle) =>
			bundle.client.suigar.tx.createGameBet({
				game,
				...(await stakeOptions({ input, bundle })),
				configId,
			}),
	});
}

export function buildPlinkoTransactionTool(input: ConfigIdInput = {}): Promise<ToolTextResult> {
	return buildConfigIdTransactionTool({ input, game: 'plinko' });
}

export function buildWheelTransactionTool(input: ConfigIdInput = {}): Promise<ToolTextResult> {
	return buildConfigIdTransactionTool({ input, game: 'wheel' });
}

export async function buildRangeTransactionTool(input: RangeInput = {}): Promise<ToolTextResult> {
	if (getMode(input.mode) === 'read-only') {
		return asTextResponse(
			readOnlyPlan({
				input,
				game: 'range',
				requiredInputs: ['owner', 'stake', 'leftPoint', 'rightPoint'],
				notes: ['Range points are normalized by @suigar/sdk before Move call construction.'],
			}),
		);
	}

	const leftPoint = requireNumber({ value: input.leftPoint, fieldName: 'leftPoint' });
	const rightPoint = requireNumber({ value: input.rightPoint, fieldName: 'rightPoint' });
	const outOfRange = Boolean(input.outOfRange);
	return buildTransactionTool({
		input,
		game: 'range',
		stakeDisplay: toCurrencyAmountText({ value: input.stake, fieldName: 'stake' }),
		gameInputs: { leftPoint, rightPoint, outOfRange },
		createTransaction: async (bundle) =>
			bundle.client.suigar.tx.createGameBet({
				game: 'range',
				...(await stakeOptions({ input, bundle })),
				leftPoint,
				rightPoint,
				outOfRange,
			}),
	});
}

export async function buildSoccerTransactionTool(input: SoccerInput = {}): Promise<ToolTextResult> {
	if (getMode(input.mode) === 'read-only') {
		return asTextResponse(
			readOnlyPlan({
				input,
				game: 'soccer',
				requiredInputs: ['owner', 'stake', 'configId', 'countryId', 'shotZoneId'],
				notes: ['Config, country, and shot zone ids select the on-chain Soccer game settings.'],
			}),
		);
	}

	const configId = requireNumber({ value: input.configId, fieldName: 'configId' });
	const countryId = requireNumber({ value: input.countryId, fieldName: 'countryId' });
	const shotZoneId = requireNumber({ value: input.shotZoneId, fieldName: 'shotZoneId' });
	return buildTransactionTool({
		input,
		game: 'soccer',
		stakeDisplay: toCurrencyAmountText({ value: input.stake, fieldName: 'stake' }),
		gameInputs: { configId, countryId, shotZoneId },
		createTransaction: async (bundle) =>
			bundle.client.suigar.tx.createGameBet({
				game: 'soccer',
				...(await stakeOptions({ input, bundle })),
				configId,
				countryId,
				shotZoneId,
			}),
	});
}

export async function buildPvpCoinflipCreateTransactionTool(
	input: PvpCoinflipCreateInput = {},
): Promise<ToolTextResult> {
	if (getMode(input.mode) === 'read-only') {
		return asTextResponse(
			readOnlyPlan({
				input,
				game: 'pvp-coinflip',
				action: 'create',
				requiredInputs: ['owner', 'stake', 'creatorSide'],
				notes: [
					'Creates an unresolved PvP Coinflip lobby without signing or executing the transaction.',
				],
			}),
		);
	}

	const creatorSide = requireString({
		value: input.creatorSide,
		fieldName: 'creatorSide',
	}) as CoinSide;
	return buildTransactionTool({
		input,
		game: 'pvp-coinflip',
		action: 'create',
		stakeDisplay: toCurrencyAmountText({ value: input.stake, fieldName: 'stake' }),
		gameInputs: {
			creatorSide,
			...(input.isPrivate == null ? {} : { isPrivate: input.isPrivate }),
		},
		createTransaction: async (bundle) => {
			const { decimals } = coinMetadataForAmount({
				config: bundle.config,
				coinType: input.coinType,
			});
			return bundle.client.suigar.tx.pvpCoinflip.createGame({
				...(await gameTransactionOptions({ input, bundle })),
				stake: toBaseUnits({ value: input.stake, fieldName: 'stake', decimals }),
				side: creatorSide,
				isPrivate: input.isPrivate,
			});
		},
	});
}

export async function buildPvpCoinflipJoinTransactionTool(
	input: PvpCoinflipJoinInput = {},
): Promise<ToolTextResult> {
	if (getMode(input.mode) === 'read-only') {
		return asTextResponse(
			readOnlyPlan({
				input,
				game: 'pvp-coinflip',
				action: 'join',
				requiredInputs: ['owner', 'gameId'],
				notes: [
					'Join resolves the live game object during transaction build so the SDK can source the matching stake.',
				],
			}),
		);
	}

	const gameId = requireString({ value: input.gameId, fieldName: 'gameId' });
	return buildTransactionTool({
		input,
		game: 'pvp-coinflip',
		action: 'join',
		gameInputs: { gameId },
		createTransaction: async (bundle) =>
			bundle.client.suigar.tx.pvpCoinflip.joinGame({
				...(await gameTransactionOptions({ input, bundle })),
				gameId,
			}),
	});
}

export async function buildPvpCoinflipCancelTransactionTool(
	input: PvpCoinflipCancelInput = {},
): Promise<ToolTextResult> {
	if (getMode(input.mode) === 'read-only') {
		return asTextResponse(
			readOnlyPlan({
				input,
				game: 'pvp-coinflip',
				action: 'cancel',
				requiredInputs: ['owner', 'gameId'],
				notes: ['Cancel only prepares the unsigned cancellation transaction for the game creator.'],
			}),
		);
	}

	const gameId = requireString({ value: input.gameId, fieldName: 'gameId' });
	return buildTransactionTool({
		input,
		game: 'pvp-coinflip',
		action: 'cancel',
		gameInputs: { gameId },
		createTransaction: async (bundle) =>
			bundle.client.suigar.tx.pvpCoinflip.cancelGame({
				...(await cancelTransactionOptions({ input, bundle })),
				gameId,
			}),
	});
}

const BET_COUNT_LIMITS: Partial<Record<Game, { parameter: string; label: string }>> = {
	limbo: { parameter: 'max_number_of_games', label: 'games' },
	plinko: { parameter: 'max_number_of_balls', label: 'balls' },
	range: { parameter: 'max_number_of_games', label: 'games' },
	soccer: { parameter: 'max_number_of_shots', label: 'shots' },
	wheel: { parameter: 'max_number_of_spins', label: 'spins' },
};

function toPositiveInteger({
	value,
	fieldName,
}: {
	value: unknown;
	fieldName: string;
}): number | bigint {
	if (typeof value === 'number' && Number.isSafeInteger(value) && value > 0) {
		return value;
	}
	if (typeof value === 'string' && POSITIVE_INTEGER_PATTERN.test(value)) {
		return BigInt(value);
	}
	throw new TypeError(`Missing or invalid ${fieldName}. Provide a positive integer.`);
}

function requireNumber({ value, fieldName }: { value: unknown; fieldName: string }): number {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value;
	}
	throw new TypeError(`Missing or invalid numeric field: ${fieldName}.`);
}

function requireNumberArray({
	value,
	fieldName,
}: {
	value: unknown;
	fieldName: string;
}): Array<number> {
	if (
		Array.isArray(value) &&
		value.length > 0 &&
		value.every((item) => typeof item === 'number' && Number.isFinite(item))
	) {
		return value;
	}
	throw new TypeError(`Missing or invalid numeric array field: ${fieldName}.`);
}

function getTarget({
	config,
	game,
	action,
}: {
	config: McpConfig;
	game: Game;
	action?: PvPCoinflipAction;
}): string {
	const packageId = getSuigarPackageId({ config, pkg: game });
	if (game === 'pvp-coinflip') {
		const functionName = `${action?.toLowerCase() ?? 'create'}_game`;
		return `${packageId}::${game}::${functionName}`;
	}
	return `${packageId}::${game}::play`;
}

function readOnlyPlan({
	input,
	game,
	action,
	requiredInputs,
	notes,
}: {
	input: TransactionToolInput;
	game: Game;
	action?: PvPCoinflipAction;
	requiredInputs: Array<string>;
	notes: Array<string>;
}): ReadOnlyPlan {
	const { config } = createSuigarClient(getConfigInput(input));
	const coinType = resolveDefaultCoinType({ config, coinType: input.coinType });
	return {
		mode: 'read-only',
		network: config.network,
		game,
		action,
		config,
		plan: {
			target: getTarget({ config, game, action }),
			typeArguments: [coinType],
			requiredInputs,
			notes,
		},
	};
}

async function gameTransactionOptions({
	input,
	bundle,
}: {
	input: BetTransactionToolInput;
	bundle: SuigarClientBundle;
}): Promise<
	Required<Pick<BetTransactionToolInput, 'owner' | 'coinType'>> &
		Pick<BetTransactionToolInput, 'metadata' | 'gasBudget' | 'useGasCoin'>
> {
	return {
		owner: await resolveTransactionOwner({ input, bundle }),
		coinType: resolveDefaultCoinType({ config: bundle.config, coinType: input.coinType }),
		metadata: input.metadata,
		gasBudget: input.gasBudget,
		useGasCoin: input.useGasCoin,
	};
}

async function resolveTransactionOwner({
	input,
	bundle,
}: {
	input: Pick<TransactionToolInput, 'mode' | 'executionWallet' | 'owner' | 'sessionWalletId'>;
	bundle: SuigarClientBundle;
}): Promise<string> {
	const sessionExecution = getMode(input.mode) === 'execute' && input.executionWallet === 'session';
	if (sessionExecution) {
		const sessionWallet = await loadSessionWallet(input.sessionWalletId);
		if (!sessionWallet) {
			throw new Error(
				'No session wallet exists. Call "setup_session_wallet" first, then fund its address before executing games.',
			);
		}
		const sessionAddress = (await loadSessionSigner(input.sessionWalletId)).toSuiAddress();
		if (sessionWallet.address !== sessionAddress) {
			throw new Error(
				'The saved session wallet address does not match its keychain signer. Recover the intended wallet with "setup_session_wallet" before executing games.',
			);
		}
		if (input.owner) {
			const requestedOwner = await resolveOwnerAddress({ owner: input.owner, bundle });
			if (requestedOwner !== sessionAddress) {
				throw new RangeError(
					'owner must match the local session wallet address when executionWallet is "session".',
				);
			}
		}
		return sessionAddress;
	}

	return resolveOwnerAddress({
		owner: requireString({ value: input.owner, fieldName: 'owner' }),
		bundle,
	});
}

async function cancelTransactionOptions({
	input,
	bundle,
}: {
	input: PvpCoinflipCancelInput;
	bundle: SuigarClientBundle;
}): Promise<
	Required<Pick<TransactionToolInput, 'owner' | 'coinType'>> &
		Pick<TransactionToolInput, 'gasBudget'>
> {
	return {
		owner: await resolveTransactionOwner({ input, bundle }),
		coinType: resolveDefaultCoinType({ config: bundle.config, coinType: input.coinType }),
		gasBudget: input.gasBudget,
	};
}

async function enforceBetCountLimit({
	game,
	input,
	bundle,
}: {
	game: Game;
	input: TransactionToolInput;
	bundle: SuigarClientBundle;
}): Promise<void> {
	if (!('betCount' in input) || input.betCount == null) {
		return;
	}

	const limit = BET_COUNT_LIMITS[game];
	if (!limit) {
		return;
	}

	const requested = BigInt(toPositiveInteger({ value: input.betCount, fieldName: 'betCount' }));
	const parameters = await bundle.client.suigar.getGameParameters({
		game,
		coinType: resolveDefaultCoinType({ config: bundle.config, coinType: input.coinType }),
	});
	const max = (parameters as Record<string, unknown>)[limit.parameter];
	if (
		(typeof max !== 'bigint' && typeof max !== 'number' && typeof max !== 'string') ||
		!BASE_UNIT_AMOUNT_PATTERN.test(String(max))
	) {
		throw new Error(
			`Unable to read ${limit.parameter} from on-chain ${GAME_LABELS[game]} parameters.`,
		);
	}

	const maximum = BigInt(max);
	if (requested > maximum) {
		throw new RangeError(
			`betCount cannot exceed ${maximum.toString()} ${limit.label} per ${GAME_LABELS[game]} transaction.`,
		);
	}
}

async function stakeOptions({
	input,
	bundle,
}: {
	input: StandardTransactionToolInput;
	bundle: SuigarClientBundle;
}): Promise<
	Required<Pick<BetTransactionToolInput, 'owner' | 'coinType'>> &
		Pick<BetTransactionToolInput, 'metadata' | 'gasBudget' | 'useGasCoin'> & {
			betCount?: number | bigint;
			cashStake?: bigint;
			stake: bigint;
		}
> {
	const { decimals } = coinMetadataForAmount({ config: bundle.config, coinType: input.coinType });
	return {
		...(await gameTransactionOptions({ input, bundle })),
		stake: toBaseUnits({ value: input.stake, fieldName: 'stake', decimals }),
		...(input.cashStake == null
			? {}
			: {
					cashStake: toBaseUnits({ value: input.cashStake, fieldName: 'cashStake', decimals }),
				}),
		...(input.betCount == null
			? {}
			: { betCount: toPositiveInteger({ value: input.betCount, fieldName: 'betCount' }) }),
	};
}

export function assertSessionGameTransaction({
	transaction,
	config,
	game,
}: {
	transaction: Transaction;
	config: McpConfig;
	game: Game;
}): void {
	const moveCalls = transaction
		.getData()
		.commands.flatMap((command) => (command.$kind === 'MoveCall' ? [command.MoveCall] : []));

	if (moveCalls.length !== 1) {
		throw new Error('Session execution only supports one verified Suigar game action.');
	}

	const [suigarCall] = moveCalls;

	if (
		suigarCall.package.toLowerCase() !== getSuigarPackageId({ config, pkg: game }).toLowerCase() ||
		suigarCall.module !== game.replaceAll('-', '_').toLowerCase()
	) {
		throw new Error(
			'Session execution rejected a transaction outside the trusted Suigar game package.',
		);
	}
}

async function buildTransactionTool({
	input,
	game,
	action,
	createTransaction,
	stake,
	stakeDisplay,
	gameInputs,
}: {
	input: TransactionToolInput;
	createTransaction: (bundle: SuigarClientBundle) => Promise<Transaction>;
} & Pick<Required<TransactionSummaryContext>, 'game'> &
	Pick<
		TransactionSummaryContext,
		'action' | 'stake' | 'stakeDisplay' | 'gameInputs'
	>): Promise<ToolTextResult> {
	const mode = getMode(input.mode);
	if (mode === 'read-only') {
		throw new Error('read-only mode must be handled before transaction execution.');
	}

	if (mode === 'execute' && input.executionWallet === 'session' && input.config) {
		throw new Error(
			'Session execution uses the trusted Suigar SDK configuration; custom config overrides are not allowed.',
		);
	}
	const bundle = createSuigarClient(getConfigInput(input));
	await enforceBetCountLimit({ game, input, bundle });
	const coin = coinMetadataForAmount({ config: bundle.config, coinType: input.coinType });
	const baseStake =
		stake ??
		(stakeDisplay == null
			? undefined
			: toBaseUnits({ value: stakeDisplay, fieldName: 'stake', decimals: coin.decimals }));
	const transaction = await createTransaction(bundle);
	const context = {
		game,
		action,
		coinType: coin.coinType,
		stake: baseStake,
		stakeDisplay,
		coinDecimals: coin.decimals,
		gasBudget: input.gasBudget,
		gameInputs,
	};
	if (mode === 'execute') {
		if (input.executionWallet === 'session') {
			assertSessionGameTransaction({ transaction, config: bundle.config, game });
			const built = await buildTransactionResult({
				mode: 'build',
				transaction,
				config: bundle.config,
				client: bundle.client,
				context,
			});
			const execution = await executeSessionTransaction({
				transaction,
				client: bundle.client,
				signer: await loadSessionSigner(input.sessionWalletId),
			});
			return asTextResponse({
				mode: 'execute',
				network: bundle.config.network,
				config: bundle.config,
				summary: built.summary,
				execution: { wallet: 'session', ...execution },
			});
		}
		const built = await buildTransactionResult({
			mode: 'build',
			transaction,
			config: bundle.config,
			client: bundle.client,
			context,
		});
		const execution = await createExecutionBridge({
			network: bundle.config.network,
			webOrigin: resolveWebOrigin({ network: bundle.config.network }),
			transactionBytesBase64: built.transactionBytesBase64 ?? '',
			summary: built.summary,
		});
		return asTextResponse({
			mode: 'execute',
			network: bundle.config.network,
			config: bundle.config,
			summary: built.summary,
			execution: { ...execution, status: 'pending' },
		});
	}
	return asTextResponse(
		await buildTransactionResult({
			mode,
			transaction,
			config: bundle.config,
			client: bundle.client,
			context,
		}),
	);
}
