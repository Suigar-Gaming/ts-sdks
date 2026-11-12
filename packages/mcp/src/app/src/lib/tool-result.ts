// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { type AnyRecord, asRecord } from '../../../utils/record.js';

export function getToolResultPayload(result: unknown): AnyRecord {
	const envelope = asRecord(result);
	const direct = asRecord(envelope['structuredContent']);
	if (Object.keys(direct).length > 0) {
		return direct;
	}

	const wrapped = asRecord(envelope['result']);
	const wrappedPayload = asRecord(wrapped['structuredContent']);
	if (Object.keys(wrappedPayload).length > 0) {
		return wrappedPayload;
	}

	const content = envelope['content'];
	const textItem: unknown = Array.isArray(content)
		? content.find((item) => asRecord(item)['type'] === 'text')
		: undefined;
	const text = asRecord(textItem)['text'];
	if (typeof text !== 'string' || !text) {
		return {};
	}
	try {
		return asRecord(JSON.parse(text) as unknown);
	} catch {
		return { content: text };
	}
}
