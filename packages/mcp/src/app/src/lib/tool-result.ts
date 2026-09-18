// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { CallToolResult } from '@modelcontextprotocol/server';
import { asRecord } from './format.js';
import type { AnyRecord } from './types.js';

export function getToolResultPayload(result: CallToolResult): AnyRecord {
	const direct = asRecord(result.structuredContent);
	if (Object.keys(direct).length > 0) {
		return direct;
	}

	const wrapped = asRecord(asRecord(result).result);
	const wrappedPayload = asRecord(wrapped.structuredContent);
	if (Object.keys(wrappedPayload).length > 0) {
		return wrappedPayload;
	}

	const text = result.content?.find((item) => item.type === 'text')?.text;
	if (!text) {
		return {};
	}
	try {
		return asRecord(JSON.parse(text) as unknown);
	} catch {
		return { content: text };
	}
}
