// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Transaction } from '@mysten/sui/transactions';
import { afterEach, assert, vi } from 'vitest';

afterEach(() => {
	vi.resetModules();
});

export async function loadTransactionModuleWithMock<TModule extends Record<string, unknown>>(
	contractPath: string,
	mockExports: Record<string, unknown>,
	transactionModulePath: string,
) {
	vi.doMock(contractPath, () => mockExports);
	return (await import(transactionModulePath)) as TModule;
}

export function createZeroCoinThunk(coinType: string) {
	return (tx: Transaction) =>
		tx.moveCall({
			target: '0x2::coin::zero',
			typeArguments: [coinType],
		});
}

type ContractCallMock = (options: unknown) => (tx: Transaction) => unknown;

export function createUnusedContractCallMock() {
	return vi.fn<ContractCallMock>();
}

/** Checks command presence and kind before returning its Move call arguments. */
export function getMoveCall(data: ReturnType<Transaction['getData']>, index: number) {
	const command = data.commands[index];
	assert(command?.$kind === 'MoveCall', `Expected MoveCall at command ${index}`);
	return command.MoveCall;
}
