// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

export type SuiFrenGesture = 'thumbs_up' | 'thumbs_down' | 'point';

export interface SuiFrenGestureProps {
	gesture?: SuiFrenGesture | undefined;
}
