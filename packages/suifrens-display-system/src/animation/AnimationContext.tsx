// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import type { AnimationConfig } from '../types/animation.type.js';
import { AnimationController } from './animation-controller.js';
import { AnimationStore } from './animation-store.js';
import { matchPartByTransform } from './parts.js';
import { observePlaybackVisibility } from './playback-visibility.js';
import {
	isDeferredPreset,
	loadDeferredPresetSequence,
	resolvePresetSequenceSync,
} from './presets/resolver.js';
import { startWaapiAnimation } from './waapi-backend.js';

type AnimationContextValue = {
	store: AnimationStore;
	controller: AnimationController;
};

type AnimationProviderProps = {
	animation?: AnimationConfig | null;
	children: ReactNode;
};

const AnimationContext = createContext<AnimationContextValue | null>(null);

function useResolvedAnimationConfig(animation: AnimationConfig | null): AnimationConfig | null {
	const presetName = animation && 'preset' in animation ? animation.preset : undefined;
	const immediateSequence = presetName ? resolvePresetSequenceSync(presetName) : undefined;
	const [deferred, setDeferred] = useState<{
		preset: string;
		sequence: ReturnType<typeof resolvePresetSequenceSync> | null;
	} | null>(null);

	useEffect(() => {
		if (!presetName || immediateSequence || !isDeferredPreset(presetName)) {
			return undefined;
		}

		let cancelled = false;

		loadDeferredPresetSequence(presetName)
			.then((sequence) => {
				if (!cancelled) {
					setDeferred({ preset: presetName, sequence });
				}

				return undefined;
			})
			.catch(() => {
				if (!cancelled) {
					setDeferred({ preset: presetName, sequence: null });
				}
			});

		return () => {
			cancelled = true;
		};
	}, [immediateSequence, presetName]);

	return useMemo<AnimationConfig | null>(() => {
		if (!animation) {
			return null;
		}

		if ('sequence' in animation) {
			return animation;
		}

		const { preset, ...rest } = animation;
		const resolvedSequence =
			immediateSequence ?? (deferred && deferred.preset === preset ? deferred.sequence : null);
		if (!resolvedSequence) {
			return null;
		}

		return {
			...rest,
			sequence: resolvedSequence,
		};
	}, [animation, deferred, immediateSequence]);
}

export function AnimationProvider({ animation = null, children }: AnimationProviderProps) {
	const resolvedAnimation = useResolvedAnimationConfig(animation);
	const store = useMemo(() => new AnimationStore(), []);
	const controller = useMemo(() => new AnimationController(store), [store]);
	const rootRef = useRef<SVGGElement | null>(null);

	useEffect(() => {
		const root = rootRef.current;
		if (!root) {
			return undefined;
		}

		const unregister: Array<() => void> = [];
		root.querySelectorAll<SVGGraphicsElement>('g[transform]').forEach((target) => {
			const part = matchPartByTransform(target.getAttribute('transform'));
			if (part) {
				unregister.push(store.registerElement(part, target));
			}
		});

		return () => unregister.forEach((cleanup) => cleanup());
	}, [store]);

	useEffect(() => {
		controller.stop();
		const waapi = startWaapiAnimation(store, resolvedAnimation);
		const root = rootRef.current;
		if (waapi.handled) {
			const disconnect = observePlaybackVisibility(root, waapi.play, waapi.pause);
			return () => {
				disconnect();
				waapi.cleanup();
			};
		}

		controller.applyConfig(resolvedAnimation);
		if (!controller.needsAnimationFrame()) {
			return undefined;
		}

		let raf: number | null = null;
		let last = performance.now();

		const tick = (time: number): void => {
			raf = null;
			const delta = time - last;
			last = time;
			if (controller.update(delta)) {
				raf = requestAnimationFrame(tick);
			}
		};

		const play = (): void => {
			if (raf === null && controller.needsAnimationFrame()) {
				last = performance.now();
				raf = requestAnimationFrame(tick);
			}
		};
		const pause = (): void => {
			if (raf !== null) {
				cancelAnimationFrame(raf);
				raf = null;
			}
		};
		const disconnect = observePlaybackVisibility(root, play, pause);
		return () => {
			disconnect();
			pause();
		};
	}, [controller, resolvedAnimation, store]);

	const value = useMemo<AnimationContextValue>(() => ({ store, controller }), [store, controller]);

	return (
		<AnimationContext.Provider value={value}>
			<g ref={rootRef}>{children}</g>
		</AnimationContext.Provider>
	);
}

export function useAnimationStore(): AnimationStore | null {
	return useContext(AnimationContext)?.store ?? null;
}

export function useAnimationController(): AnimationController | null {
	const context = useContext(AnimationContext);
	return context?.controller ?? null;
}
