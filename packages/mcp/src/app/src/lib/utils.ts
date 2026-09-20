// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(inputs));
}
