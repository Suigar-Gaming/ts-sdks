'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type PersistentFormsStore<T> = {
	value: T;
	setValue: (nextValue: T | ((currentValue: T) => T)) => void;
};

/** Declare once at module scope to share one typed store between route mounts. */
export function createPersistentForms<T extends object>(key: string, initialValue: T) {
	const store = create<PersistentFormsStore<T>>()(
		persist(
			(set) => ({
				value: initialValue,
				setValue: (nextValue) => {
					set((current) => ({
						value: typeof nextValue === 'function' ? nextValue(current.value) : nextValue,
					}));
				},
			}),
			{
				name: key,
				storage: createJSONStorage(() => localStorage),
			},
		),
	);
	return function usePersistentForms() {
		const value = store((state) => state.value);
		const setValue = store((state) => state.setValue);
		return [value, setValue] as const;
	};
}
