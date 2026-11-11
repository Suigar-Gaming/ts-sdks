// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import sharp from 'sharp';

export async function renderImage(svg: string, format: 'svg' | 'png', width = 1024) {
	if (format === 'svg') {
		return { contentType: 'image/svg+xml', body: svg };
	}
	const body = await sharp(Buffer.from(svg)).resize({ width }).png().toBuffer();
	return { contentType: 'image/png', body };
}
