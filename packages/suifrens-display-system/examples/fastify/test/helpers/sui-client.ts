import type { SuiClientTypes } from '@mysten/sui/client';
import { vi } from 'vitest';

export const client = {
	getObject:
		vi.fn<
			(
				options: SuiClientTypes.GetObjectOptions,
			) => Promise<{ object: { type: string; content: Uint8Array } }>
		>(),
	listDynamicFields: vi.fn<
		(options: SuiClientTypes.ListDynamicFieldsOptions) => Promise<{
			dynamicFields: Array<{ name: SuiClientTypes.DynamicFieldName; $kind?: string }>;
			cursor: string | null;
			hasNextPage: boolean;
		}>
	>(),
	getDynamicObjectField:
		vi.fn<
			(
				options: SuiClientTypes.GetDynamicObjectFieldOptions,
			) => Promise<{ object: { type: string; content: Uint8Array } }>
		>(),
};
export const grpcMock = {
	SuiGrpcClient: class {
		getObject = client.getObject;
		listDynamicFields = client.listDynamicFields;
		getDynamicObjectField = client.getDynamicObjectField;
	},
};
