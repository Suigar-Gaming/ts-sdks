// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type {
	AnimationConfig,
	AnimationSequence,
	AnimationTarget,
	PlaybackOptions,
} from '../types/animation.type.js';
import { matrixToAnimationTransform, parseMatrix } from '../utils/matrix.js';
import { type AnimationStore, composePartTransform } from './animation-store.js';
import { interpolateSequencePoses, normalizePlayback } from './sequence-player.js';

type BackendPreference = 'auto' | 'waapi' | 'fallback';

type WaapiTarget = AnimationTarget & {
	element: SVGGraphicsElement;
};

type WaapiStartResult =
	| {
			handled: true;
			cleanup: () => void;
			pause: () => void;
			play: () => void;
	  }
	| {
			handled: false;
	  };

const SAMPLE_INTERVAL_MS = 1000 / 30;

declare global {
	var __SUIFREN_ANIMATION_BACKEND__: BackendPreference | undefined;
}

function resolveBackendPreference(): BackendPreference {
	return globalThis.__SUIFREN_ANIMATION_BACKEND__ ?? 'auto';
}

function supportsSvgWaapi(): boolean {
	return (
		typeof SVGElement !== 'undefined' &&
		typeof Element !== 'undefined' &&
		typeof Element.prototype.animate === 'function'
	);
}

function getTargets(store: AnimationStore, sequence: AnimationSequence): Array<WaapiTarget> {
	const animatedParts = new Set(sequence.tracks.map((track) => track.part));
	return store
		.getAnimationTargetsForParts(animatedParts)
		.filter((target): target is WaapiTarget => Boolean(target.element));
}

function playbackDuration(sequence: AnimationSequence, playback?: PlaybackOptions): number {
	const normalized = normalizePlayback(playback);
	return sequence.duration / normalized.speed;
}

function playbackIterations(playback?: PlaybackOptions): number {
	return normalizePlayback(playback).iterations;
}

function playbackDirection(
	direction: AnimationConfig['direction'],
	playback?: PlaybackOptions,
): PlaybackDirection {
	const alternate = normalizePlayback(playback).alternate;
	if (direction === 'reverse') {
		return alternate ? 'alternate-reverse' : 'reverse';
	}
	return alternate ? 'alternate' : 'normal';
}

function buildOffsets(sequence: AnimationSequence): Array<number> {
	const offsets = new Set<number>([0, sequence.duration]);
	for (let time = SAMPLE_INTERVAL_MS; time < sequence.duration; time += SAMPLE_INTERVAL_MS) {
		offsets.add(Math.min(sequence.duration, time));
	}
	for (const track of sequence.tracks) {
		for (const frame of track.keyframes) {
			offsets.add(Math.min(Math.max(frame.at, 0), sequence.duration));
		}
	}
	return Array.from(offsets).sort((a, b) => a - b);
}

function buildTargetKeyframes(
	target: WaapiTarget,
	sequence: AnimationSequence,
	offsets: Array<number>,
): Array<Keyframe> {
	const duration = Math.max(sequence.duration, 1);
	return offsets.map((time) => ({
		offset: time / duration,
		transform: matrixToAnimationTransform(
			parseMatrix(
				composePartTransform(
					target.part,
					target.baseTransform,
					interpolateSequencePoses(sequence, time),
					target.pivotOverride,
				),
			)!,
		),
		easing: 'linear',
	}));
}

const sequenceKeyframeCache = new WeakMap<AnimationSequence, Map<string, Array<Keyframe>>>();

function getTargetKeyframes(
	target: WaapiTarget,
	sequence: AnimationSequence,
	offsets: Array<number>,
): Array<Keyframe> {
	let cache = sequenceKeyframeCache.get(sequence);
	if (!cache) {
		cache = new Map();
		sequenceKeyframeCache.set(sequence, cache);
	}
	const pivot = target.pivotOverride;
	const key = `${target.part}|${target.baseTransform ?? ''}|${pivot?.x ?? ''}|${pivot?.y ?? ''}`;
	const cached = cache.get(key);
	if (cached) {
		return cached;
	}
	const keyframes = buildTargetKeyframes(target, sequence, offsets);
	cache.set(key, keyframes);
	return keyframes;
}

function setBaseTransforms(targets: Array<WaapiTarget>): void {
	for (const target of targets) {
		if (target.baseTransform) {
			target.element.setAttribute('transform', target.baseTransform);
		} else {
			target.element.removeAttribute('transform');
		}
	}
}

export function startWaapiAnimation(
	store: AnimationStore,
	config: AnimationConfig | null,
): WaapiStartResult {
	const preference = resolveBackendPreference();
	if (preference === 'fallback') {
		return { handled: false };
	}

	if (!config) {
		store.clear();
		return {
			handled: true,
			cleanup: () => undefined,
			pause: () => undefined,
			play: () => undefined,
		};
	}

	if (!('sequence' in config)) {
		return { handled: false };
	}

	if (!supportsSvgWaapi()) {
		return preference === 'waapi'
			? {
					handled: true,
					cleanup: () => undefined,
					pause: () => undefined,
					play: () => undefined,
				}
			: { handled: false };
	}

	const playState = config.playState ?? (config.autoPlay === false ? 'idle' : 'running');
	const targets = getTargets(store, config.sequence);

	if (playState === 'idle' || playState === 'stopped') {
		store.clear();
		setBaseTransforms(targets);
		return {
			handled: true,
			cleanup: () => undefined,
			pause: () => undefined,
			play: () => undefined,
		};
	}

	if (!targets.length) {
		return { handled: false };
	}

	const sequence = config.sequence;
	if (sequence.duration <= 0) {
		return { handled: false };
	}

	store.clear();
	setBaseTransforms(targets);

	const offsets = buildOffsets(sequence);
	const animations = targets.map((target) => {
		const animation = target.element.animate(getTargetKeyframes(target, sequence, offsets), {
			duration: playbackDuration(sequence, config.playback),
			iterations: playbackIterations(config.playback),
			direction: playbackDirection(config.direction, config.playback),
			easing: 'linear',
			fill: config.holdOnComplete ? 'forwards' : 'none',
		});

		if (config.startAt === 'end') {
			animation.currentTime = playbackDuration(sequence, config.playback);
		}
		if (playState === 'paused') {
			animation.pause();
		}

		if (!config.holdOnComplete) {
			animation.finished.then(() => animation.cancel()).catch(() => undefined);
		}

		return animation;
	});

	return {
		handled: true,
		pause: () => {
			for (const animation of animations) {
				animation.pause();
			}
		},
		play: () => {
			if (playState !== 'running') {
				return;
			}
			for (const animation of animations) {
				if (animation.currentTime !== null) {
					animation.play();
				}
			}
		},
		cleanup: () => {
			for (const animation of animations) {
				animation.cancel();
			}
			setBaseTransforms(targets);
		},
	};
}
