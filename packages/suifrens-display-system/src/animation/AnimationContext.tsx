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
import {
	isDeferredPreset,
	loadDeferredPresetSequence,
	resolvePresetSequenceSync,
} from './preset-resolver.js';
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

function useResolvedAnimationConfig(animation: AnimationConfig | null) {
	const presetName = animation && 'preset' in animation ? animation.preset : undefined;
	const immediateSequence = presetName ? resolvePresetSequenceSync(presetName) : undefined;
	const [deferred, setDeferred] = useState<{
		preset: string;
		sequence: ReturnType<typeof resolvePresetSequenceSync> | null;
	} | null>(null);

	useEffect(() => {
		if (!presetName || immediateSequence || !isDeferredPreset(presetName)) {
			return;
		}

		let cancelled = false;

		loadDeferredPresetSequence(presetName)
			.then((sequence) => {
				if (!cancelled) {
					setDeferred({ preset: presetName, sequence });
				}
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
			return;
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
		const media = window.matchMedia('(prefers-reduced-motion: reduce)');
		let isIntersecting = true;

		if (waapi.handled) {
			const syncPlayback = () => {
				if (document.visibilityState !== 'hidden' && isIntersecting && !media.matches) {
					waapi.play();
				} else {
					waapi.pause();
				}
			};
			const observer =
				root && typeof IntersectionObserver !== 'undefined'
					? new IntersectionObserver(
							([entry]) => {
								isIntersecting = entry?.isIntersecting ?? true;
								syncPlayback();
							},
							{ rootMargin: '100px' },
						)
					: null;

			if (root && observer) {
				const rect = root.getBoundingClientRect();
				isIntersecting =
					rect.bottom >= -100 &&
					rect.right >= -100 &&
					rect.top <= window.innerHeight + 100 &&
					rect.left <= window.innerWidth + 100;
				observer.observe(root);
			}
			document.addEventListener('visibilitychange', syncPlayback);
			media.addEventListener?.('change', syncPlayback);
			syncPlayback();

			return () => {
				observer?.disconnect();
				document.removeEventListener('visibilitychange', syncPlayback);
				media.removeEventListener?.('change', syncPlayback);
				waapi.cleanup();
			};
		}

		controller.applyConfig(resolvedAnimation);
		if (!controller.needsAnimationFrame()) {
			return;
		}

		let raf = 0;
		let last = performance.now();

		const tick = (time: number) => {
			raf = 0;
			const delta = time - last;
			last = time;
			if (controller.update(delta)) {
				raf = requestAnimationFrame(tick);
			}
		};

		const schedule = () => {
			if (
				document.visibilityState === 'hidden' ||
				!isIntersecting ||
				media.matches ||
				raf !== 0 ||
				!controller.needsAnimationFrame()
			) {
				return;
			}
			last = performance.now();
			raf = requestAnimationFrame(tick);
		};

		const onPlaybackAvailabilityChange = () => {
			if (document.visibilityState === 'hidden' || media.matches) {
				cancelAnimationFrame(raf);
				raf = 0;
			} else {
				schedule();
			}
		};

		const observer =
			root && typeof IntersectionObserver !== 'undefined'
				? new IntersectionObserver(
						([entry]) => {
							isIntersecting = entry?.isIntersecting ?? true;
							if (isIntersecting) {
								schedule();
							} else {
								cancelAnimationFrame(raf);
								raf = 0;
							}
						},
						{ rootMargin: '100px' },
					)
				: null;
		if (root && observer) {
			observer.observe(root);
		}

		document.addEventListener('visibilitychange', onPlaybackAvailabilityChange);
		media.addEventListener?.('change', onPlaybackAvailabilityChange);
		schedule();

		return () => {
			observer?.disconnect();
			document.removeEventListener('visibilitychange', onPlaybackAvailabilityChange);
			media.removeEventListener?.('change', onPlaybackAvailabilityChange);
			cancelAnimationFrame(raf);
		};
	}, [controller, resolvedAnimation, store]);

	const value = useMemo<AnimationContextValue>(() => ({ store, controller }), [store, controller]);

	return (
		<AnimationContext.Provider value={value}>
			<g ref={rootRef}>{children}</g>
		</AnimationContext.Provider>
	);
}

export function useAnimationStore() {
	return useContext(AnimationContext)?.store ?? null;
}

export function useAnimationController() {
	const context = useContext(AnimationContext);
	return context?.controller ?? null;
}
