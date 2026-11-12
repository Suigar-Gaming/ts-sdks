// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { type AnyRecord, asRecord, isRecord } from '../../../utils/record.js';
import type { DefinitionEntry } from './types.js';

const HIDDEN_DYNAMIC_ENTRY_KEYS = new Set<string>([
	'game_details',
	'metadata',
	'player',
	'coin_type',
	'unsafe_oracle_usd_coin_price',
	'adjusted_oracle_usd_coin_price',
]);

export function stringify(value: unknown): string {
	return JSON.stringify(
		value,
		(_key, item: unknown) => (typeof item === 'bigint' ? item.toString() : item),
		2,
	);
}

export function formatValue(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.length > 0 ? value.join(', ') : null;
	}
	if (isRecord(value)) {
		if (typeof value['label'] === 'string' && typeof value['id'] === 'string') {
			return `${value['label']} (${value['id']})`;
		}
		if (typeof value['id'] === 'string') {
			return value['id'];
		}
		return stringify(value);
	}
	return value;
}

export function labelFor(key: string): string {
	return key
		.replaceAll(/([a-z0-9])([A-Z])/gu, '$1 $2')
		.replaceAll('_', ' ')
		.replaceAll(/\b\w/gu, (character) => character.toUpperCase());
}

export function dynamicEntries(record: AnyRecord): Array<DefinitionEntry> {
	return Object.entries(record).reduce<Array<DefinitionEntry>>((entries, [key, value]) => {
		if (key.endsWith('_display') || HIDDEN_DYNAMIC_ENTRY_KEYS.has(key)) {
			return entries;
		}
		entries.push([labelFor(key), record[`${key}_display`] ?? value]);
		return entries;
	}, []);
}

export function amountText(value: unknown): unknown {
	const amount = asRecord(value);
	if (typeof amount['display'] === 'string' && typeof amount['raw'] === 'string') {
		return `${amount['display']} (${amount['raw']} base units)`;
	}
	return value;
}

export function visibleDefinitionEntries(entries: Array<DefinitionEntry>): Array<DefinitionEntry> {
	return entries.reduce<Array<DefinitionEntry>>((visibleEntries, [label, value]) => {
		const formattedValue = formatValue(value);
		if (formattedValue != null && formattedValue !== '') {
			visibleEntries.push([label, formattedValue]);
		}
		return visibleEntries;
	}, []);
}

export function valueTone({
	label,
	value,
}: {
	label: string;
	value: unknown;
}): 'error' | 'success' | null {
	const text = String(value).toLowerCase();
	const lowerLabel = label.toLowerCase();
	if (text === 'success') {
		return 'success';
	}
	if (value === false || lowerLabel.includes('error') || text === 'failed') {
		return 'error';
	}
	return null;
}
