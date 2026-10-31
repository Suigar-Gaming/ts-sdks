// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { fromHex } from '@mysten/sui/utils';
import { bytesToHex, equalBytes as nobleEqualBytes, randomBytes } from '@noble/ciphers/utils.js';

export const HEX_16_BYTE_PATTERN: RegExp = /^[0-9a-f]{32}$/iu;
export const HEX_32_BYTE_PATTERN: RegExp = /^[0-9a-f]{64}$/iu;

const nodeTimingSafeEqual = import('node:crypto')
	.then(({ timingSafeEqual }) => timingSafeEqual)
	.catch(() => null);

export async function equalBytes(a: Uint8Array, b: Uint8Array): Promise<boolean> {
	if (a.length !== b.length) {
		return false;
	}

	const timingSafeEqual = await nodeTimingSafeEqual;
	return timingSafeEqual === null ? nobleEqualBytes(a, b) : timingSafeEqual(a, b);
}

export async function sameState(left: string, right: string): Promise<boolean> {
	if (
		left.length !== right.length ||
		!HEX_32_BYTE_PATTERN.test(left) ||
		!HEX_32_BYTE_PATTERN.test(right)
	) {
		return false;
	}

	return equalBytes(fromHex(left), fromHex(right));
}

export function randomHex(byteLength: number): string {
	return bytesToHex(randomBytes(byteLength));
}

export function randomUuid(): string {
	const globalCrypto = typeof globalThis === 'object' ? globalThis.crypto : null;
	if (typeof globalCrypto?.randomUUID === 'function') {
		return globalCrypto.randomUUID();
	}

	const bytes = randomBytes(16);
	bytes[6] = (bytes[6]! & 0x0f) | 0x40;
	bytes[8] = (bytes[8]! & 0x3f) | 0x80;
	const hex = bytesToHex(bytes);
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
