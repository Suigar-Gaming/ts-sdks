import { useEffect, useRef, useState } from 'react';
import { useAnimationStore } from './AnimationContext.js';
import type { AnimationPart } from './parts.js';

type Options = {
	pivotOverride?: { x: number; y: number };
};

export function useAnimatedPartTransform(
	part: AnimationPart,
	baseTransform: string,
	options?: Options,
) {
	const store = useAnimationStore();
	const [transform, setTransform] = useState(baseTransform);
	const baseRef = useRef(baseTransform);
	const directDomTransforms = store?.usesDirectDomTransforms ?? false;

	useEffect(() => {
		baseRef.current = baseTransform;
		if (store && !directDomTransforms) {
			store.refresh(part);
		}
	}, [baseTransform, directDomTransforms, part, store]);

	useEffect(() => {
		if (!store || directDomTransforms) {
			return;
		}
		const registration = {
			getBaseTransform: () => baseRef.current,
			setTransform: (value: string) => setTransform(value),
			pivotOverride: options?.pivotOverride,
		};
		const unregister = store.register(part, registration);
		return unregister;
	}, [directDomTransforms, store, part, options?.pivotOverride]);

	return !store || directDomTransforms ? baseTransform : transform;
}
