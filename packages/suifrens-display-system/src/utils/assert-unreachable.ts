// Adapted by Suigar from the SuiFrens Display System by Mysten Labs.
// Copyright (c) Suigar (modifications)
// SPDX-License-Identifier: Apache-2.0

export function assertUnreachable(value: never): never {
	throw new Error(`ERROR! Encountered an unexpected value: ${String(value)}`);
}
