import type { BullsharkAttributes } from './bullshark-image/types.js';
import type { CapyAttributes } from './capy-image/types.js';

export enum SuiFrenType {
	BULLSHARK = 'BULLSHARK',
	CAPY = 'CAPY',
}

export type SuiFrenAttributes = CapyAttributes | BullsharkAttributes;
