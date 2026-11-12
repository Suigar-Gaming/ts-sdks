import type { SuigarClient } from '@suigar/sdk';
import { COIN_SIDES } from '@suigar/sdk/games';
import { parseOptionalNumber, toAtomicAmount } from '@/lib/suigar-app';
import type {
	PvPAction,
	PvPCoinflipForms,
	SharedFields,
	StandardForms,
	StandardGameId,
	StandardSharedFields,
} from '@/lib/suigar-types';
import { NON_NEGATIVE_INTEGER_PATTERN } from '@/lib/validation';

type TxApi = SuigarClient['tx'];

export const PREVIEW_PLAYER_ADDRESS = `0x${'0'.repeat(64)}`;

function getBetCountInput(fields: StandardSharedFields) {
	return fields.betCount?.trim() ?? '';
}

function parseBetCount(value: string) {
	if (!NON_NEGATIVE_INTEGER_PATTERN.test(value)) {
		throw new TypeError('Bet count must be a whole number.');
	}

	const betCount = BigInt(value);
	if (betCount < BigInt(1)) {
		throw new RangeError('Bet count must be at least 1.');
	}

	return betCount;
}

function buildSharedOptions(
	owner: string,
	coinType: string,
	coinDecimals: number,
	fields: SharedFields,
) {
	const atomicStake = toAtomicAmount(fields.stake, coinDecimals);
	const baseOptions = {
		owner,
		coinType,
		stake: atomicStake,
	};
	const codeLines = [
		`owner: '${owner}',`,
		`coinType: '${coinType}',`,
		`stake: ${atomicStake.toString()}n,`,
	];

	return {
		baseOptions,
		codeLines,
	};
}

function buildStandardSharedOptions(
	owner: string,
	coinType: string,
	coinDecimals: number,
	fields: StandardSharedFields,
) {
	const { baseOptions, codeLines } = buildSharedOptions(owner, coinType, coinDecimals, fields);
	const rawBetCount = getBetCountInput(fields);

	if (rawBetCount) {
		codeLines.push(`betCount: ${rawBetCount}n,`);
	}

	return {
		baseOptions: { ...baseOptions, betCount: rawBetCount ? parseBetCount(rawBetCount) : undefined },
		codeLines,
	};
}

function toCodeBlock(factoryLine: string, codeLines: Array<string>) {
	const objectPrefix = factoryLine.endsWith('{') ? '' : factoryLine.endsWith(',') ? ' {' : '{';
	return `${factoryLine}${objectPrefix}\n${codeLines.map((line) => `\t${line}`).join('\n')}\n});`;
}

function parseKenoPicks(value: Array<string> | string) {
	const rawPicks = Array.isArray(value)
		? value
		: value
				.split(',')
				.map((pick) => pick.trim())
				.filter(Boolean);
	const picks = rawPicks.map(Number);

	if (picks.some((pick) => !Number.isSafeInteger(pick))) {
		throw new TypeError('Keno picks must be comma-separated whole numbers.');
	}

	return picks;
}

export function buildPvPPreviewFallback(
	action: 'join' | 'cancel',
	{
		owner,
		coinType,
	}: {
		owner: string;
		coinType: string;
	},
) {
	return toCodeBlock(`const tx = client.suigar.tx.pvpCoinflip.${action}Game(`, [
		`owner: '${owner}',`,
		`coinType: '${coinType}',`,
		`gameId: '0xGAME_ID',`,
	]);
}

export function buildStandardTransaction(
	client: { suigar: SuigarClient },
	gameId: StandardGameId,
	form: StandardForms[StandardGameId],
	owner: string,
	coinDecimals: number,
	coinType: string,
) {
	const { baseOptions, codeLines } = buildStandardSharedOptions(
		owner,
		coinType,
		coinDecimals,
		form,
	);
	const txApi: TxApi = client.suigar.tx;
	let transaction: ReturnType<TxApi['createGameBet']>;

	switch (gameId) {
		case 'coinflip': {
			const side =
				'side' in form ? COIN_SIDES.find((candidate) => candidate === form.side) : undefined;
			if (!side) {
				throw new TypeError('Form does not match the selected game.');
			}
			codeLines.push(`side: '${side}',`);
			transaction = txApi.createGameBet({ game: 'coinflip', ...baseOptions, side });
			break;
		}
		case 'keno': {
			if (!('picks' in form)) {
				throw new TypeError('Form does not match the selected game.');
			}
			const picks = parseKenoPicks(form.picks);
			codeLines.push(`configId: ${Number(form.configId)},`, `picks: [${picks.join(', ')}],`);
			transaction = txApi.createGameBet({
				game: 'keno',
				...baseOptions,
				configId: Number(form.configId),
				picks,
			});
			break;
		}
		case 'limbo': {
			if (!('targetMultiplier' in form)) {
				throw new TypeError('Form does not match the selected game.');
			}
			codeLines.push(`targetMultiplier: ${Number(form.targetMultiplier)},`);
			const scale = parseOptionalNumber(form.scale);
			if (scale != null) {
				codeLines.push(`scale: ${scale},`);
			}
			transaction = txApi.createGameBet({
				game: 'limbo',
				...baseOptions,
				targetMultiplier: Number(form.targetMultiplier),
				scale,
			});
			break;
		}
		case 'plinko': {
			if (!('configId' in form)) {
				throw new TypeError('Form does not match the selected game.');
			}
			codeLines.push(`configId: ${Number(form.configId)},`);
			transaction = txApi.createGameBet({
				game: 'plinko',
				...baseOptions,
				configId: Number(form.configId),
			});
			break;
		}
		case 'range': {
			if (!('leftPoint' in form)) {
				throw new TypeError('Form does not match the selected game.');
			}
			codeLines.push(
				`leftPoint: ${Number(form.leftPoint)},`,
				`rightPoint: ${Number(form.rightPoint)},`,
				`outOfRange: ${form.outOfRange},`,
			);
			const scale = parseOptionalNumber(form.scale);
			if (scale != null) {
				codeLines.push(`scale: ${scale},`);
			}
			transaction = txApi.createGameBet({
				game: 'range',
				...baseOptions,
				leftPoint: Number(form.leftPoint),
				rightPoint: Number(form.rightPoint),
				outOfRange: form.outOfRange,
				scale,
			});
			break;
		}
		case 'soccer': {
			if (!('countryId' in form)) {
				throw new TypeError('Form does not match the selected game.');
			}
			codeLines.push(
				`configId: ${Number(form.configId)},`,
				`countryId: ${Number(form.countryId)},`,
				`shotZoneId: ${Number(form.shotZoneId)},`,
			);
			transaction = txApi.createGameBet({
				game: 'soccer',
				...baseOptions,
				configId: Number(form.configId),
				countryId: Number(form.countryId),
				shotZoneId: Number(form.shotZoneId),
			});
			break;
		}
		case 'wheel': {
			if (!('configId' in form)) {
				throw new TypeError('Form does not match the selected game.');
			}
			codeLines.push(`configId: ${Number(form.configId)},`);
			transaction = txApi.createGameBet({
				game: 'wheel',
				...baseOptions,
				configId: Number(form.configId),
			});
			break;
		}
	}

	return {
		transaction,
		code: toCodeBlock(`const tx = client.suigar.tx.createGameBet({`, [
			`game: '${gameId}',`,
			...codeLines,
		]),
	};
}

export function buildPvPTransaction(
	client: { suigar: SuigarClient },
	action: PvPAction,
	form: PvPCoinflipForms[PvPAction],
	owner: string,
	coinDecimals: number,
	coinType: string,
) {
	const txApi = client.suigar.tx.pvpCoinflip;
	switch (action) {
		case 'create': {
			if (!('side' in form)) {
				throw new TypeError('Form does not match the selected game.');
			}
			const { baseOptions, codeLines } = buildSharedOptions(owner, coinType, coinDecimals, form);
			codeLines.push(`side: '${form.side}',`, `isPrivate: ${form.isPrivate},`);
			return {
				transaction: txApi.createGame({
					...baseOptions,
					side: form.side,
					isPrivate: form.isPrivate,
				}),
				code: toCodeBlock('const tx = client.suigar.tx.pvpCoinflip.createGame(', codeLines),
			};
		}
		case 'join':
		case 'cancel': {
			if (!('gameId' in form)) {
				throw new TypeError('Form does not match the selected game.');
			}
			const gameId = form.gameId?.trim() ?? '';
			const options = { owner, coinType, gameId };
			return {
				transaction: action === 'join' ? txApi.joinGame(options) : txApi.cancelGame(options),
				code: toCodeBlock(`const tx = client.suigar.tx.pvpCoinflip.${action}Game(`, [
					`owner: '${owner}',`,
					`coinType: '${coinType}',`,
					`gameId: '${gameId}',`,
				]),
			};
		}
		default:
			throw new RangeError(
				'Invalid PvP Coinflip action. Choose an available action and try again.',
				{ cause: action satisfies never },
			);
	}
}
