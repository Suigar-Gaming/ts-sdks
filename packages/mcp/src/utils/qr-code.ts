// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import encodeQR, { type QrOpts } from 'qr';

export function createQrCodeDataUrl({
	text,
	options = {},
}: {
	text: string;
	options?: QrOpts;
}): string {
	return encodeQR(text, 'data-url', {
		...options,
		ecc: options.ecc ?? 'medium',
		border: options.border ?? 2,
		scale: options.scale ?? 4,
	});
}
