import type { AnimationStore } from './AnimationStore.js';
import type { AnimationPart } from './parts.js';
import { SequencePlayer } from './SequencePlayer.js';
import type {
	AnimationConfig,
	AnimationSequence,
	PartPose,
	PlaybackOptions,
	PlayState,
} from './types.js';

const DEFAULT_TRANSITION_MS = 140;

type SequenceSource = {
	sequence: AnimationSequence;
	playback?: PlaybackOptions;
} | null;

function playbackSignature(playback?: PlaybackOptions) {
	let iterations: number;
	if (playback?.iterations === 'infinite' || playback?.loop === true) {
		iterations = Infinity;
	} else if (typeof playback?.iterations === 'number') {
		iterations = Math.max(1, playback.iterations);
	} else if (typeof playback?.loop === 'number') {
		iterations = Math.max(1, playback.loop);
	} else {
		iterations = 1;
	}

	const alternate = Boolean(playback?.alternate);
	const speed = playback?.speed && playback.speed > 0 ? playback.speed : 1;
	return `${iterations}|${alternate ? 1 : 0}|${speed}`;
}

const nowMs = () => (typeof performance === 'undefined' ? Date.now() : performance.now());

function blendScaleAxis(start: number, end: number, eased: number) {
	if (start * end < 0) {
		return eased < 0.5 ? start : end;
	}
	return start + (end - start) * eased;
}

const blendPose = (from?: PartPose, to?: PartPose, progress = 1): PartPose | undefined => {
	if (!from && !to) {
		return undefined;
	}

	const eased = progress <= 0 ? 0 : progress >= 1 ? 1 : progress * progress * (3 - 2 * progress);
	const hasRotate = from?.rotate !== undefined || to?.rotate !== undefined;
	const hasTranslate = Boolean(from?.translate || to?.translate);
	const hasScale = Boolean(from?.scale || to?.scale);

	if (!hasRotate && !hasTranslate && !hasScale) {
		return undefined;
	}

	const pose: PartPose = {};

	if (hasRotate) {
		const start = from?.rotate ?? 0;
		const end = to?.rotate ?? 0;
		pose.rotate = start + (end - start) * eased;
	}

	if (hasTranslate) {
		const start = from?.translate ?? { x: 0, y: 0 };
		const end = to?.translate ?? { x: 0, y: 0 };
		pose.translate = {
			x: start.x + (end.x - start.x) * eased,
			y: start.y + (end.y - start.y) * eased,
		};
	}

	if (hasScale) {
		const start = from?.scale ?? { x: 1, y: 1 };
		const end = to?.scale ?? { x: 1, y: 1 };
		const startX = start.x ?? 1;
		const startY = start.y ?? 1;
		const endX = end.x ?? 1;
		const endY = end.y ?? 1;
		pose.scale = {
			x: blendScaleAxis(startX, endX, eased),
			y: blendScaleAxis(startY, endY, eased),
		};
	}

	return pose;
};

export class AnimationController {
	private readonly store: AnimationStore;
	private readonly player = new SequencePlayer();
	private sequenceSource: SequenceSource = null;
	private playbackSignature: string | null = null;
	private currentDirection: 1 | -1 = 1;
	private currentPlayState: PlayState = 'idle';
	private lastTrigger: string | number | undefined;
	private holdOnComplete = false;
	private transitionFrom: Map<AnimationPart, PartPose> | null = null;
	private transitionStartedAt = 0;
	private transitionDurationMs = DEFAULT_TRANSITION_MS;
	private lastPoses = new Map<AnimationPart, PartPose>();
	private completionSettled = true;

	constructor(store: AnimationStore) {
		this.store = store;
	}

	applyConfig(config: AnimationConfig | null) {
		if (!config) {
			this.sequenceSource = null;
			this.playbackSignature = null;
			this.currentDirection = 1;
			this.currentPlayState = 'idle';
			this.lastTrigger = undefined;
			this.holdOnComplete = false;
			this.transitionFrom = null;
			this.lastPoses.clear();
			this.player.stop();
			this.store.clear();
			this.completionSettled = true;
			return;
		}

		const sequence = this.resolveSequence(config);
		if (!sequence) {
			this.sequenceSource = null;
			this.playbackSignature = null;
			this.currentDirection = 1;
			this.currentPlayState = 'idle';
			this.lastTrigger = undefined;
			this.holdOnComplete = false;
			this.transitionFrom = null;
			this.lastPoses.clear();
			this.player.stop();
			this.store.clear();
			this.completionSettled = true;
			return;
		}

		const direction: 1 | -1 = config.direction === 'reverse' ? -1 : 1;
		const startAt = config.startAt ?? (direction === -1 ? 'end' : 'start');
		const incomingSignature = playbackSignature(config.playback);
		const sequenceChanged = this.sequenceSource?.sequence !== sequence;
		const playbackChanged = this.playbackSignature !== incomingSignature;
		const triggerChanged = config.trigger !== undefined && config.trigger !== this.lastTrigger;
		const directionChanged = direction !== this.currentDirection;
		const transitionMs =
			typeof config.transitionMs === 'number' && config.transitionMs >= 0
				? config.transitionMs
				: DEFAULT_TRANSITION_MS;
		this.transitionDurationMs = transitionMs;
		const playState = this.resolvePlayState(config);
		const shouldTransition =
			transitionMs > 0 &&
			playState !== 'idle' &&
			playState !== 'stopped' &&
			(sequenceChanged || triggerChanged || directionChanged) &&
			this.lastPoses.size > 0;

		if (shouldTransition) {
			this.transitionFrom = new Map(this.lastPoses);
			this.transitionStartedAt = nowMs();
		} else if (transitionMs === 0) {
			this.transitionFrom = null;
		}

		if (sequenceChanged) {
			this.player.load(sequence, config.playback, { direction, startAt });
		} else {
			if (playbackChanged) {
				this.player.setPlayback(config.playback);
			}
			if (directionChanged) {
				this.player.setDirection(direction, true, startAt);
			}
		}

		if (triggerChanged) {
			this.player.restart(startAt);
			this.syncCurrentPoses();
		} else if (sequenceChanged || playbackChanged || directionChanged) {
			this.syncCurrentPoses();
		}

		this.sequenceSource = { sequence, playback: config.playback };
		this.playbackSignature = incomingSignature;
		this.currentDirection = direction;
		this.holdOnComplete = Boolean(config.holdOnComplete);
		this.lastTrigger = config.trigger;

		this.currentPlayState = playState;

		switch (playState) {
			case 'running':
				this.player.play();
				this.completionSettled = false;
				break;
			case 'paused':
				this.player.pause();
				this.syncCurrentPoses();
				this.completionSettled = true;
				break;
			case 'idle':
			case 'stopped':
			default:
				this.player.stop(true);
				this.player.setDirection(direction, true, startAt);
				this.store.clear();
				this.transitionFrom = null;
				this.lastPoses.clear();
				this.completionSettled = true;
				break;
		}

		if (playState === 'running' && config.trigger !== undefined) {
			this.player.play();
		}
	}

	stop() {
		this.player.stop();
		this.currentPlayState = 'idle';
		this.store.clear();
		this.transitionFrom = null;
		this.lastPoses.clear();
		this.completionSettled = true;
	}

	needsAnimationFrame() {
		return this.currentPlayState === 'running' && this.player.isPlaying();
	}

	update(deltaMs: number) {
		if (this.player.update(deltaMs)) {
			this.syncCurrentPoses();
		}

		if (!this.player.isPlaying()) {
			this.settleCompletedPlayback();
		}

		return this.needsAnimationFrame();
	}

	private resolveSequence(config: AnimationConfig): AnimationSequence | null {
		if ('sequence' in config) {
			return config.sequence;
		}
		return null;
	}

	private resolvePlayState(config: AnimationConfig): PlayState {
		if (config.playState) {
			return config.playState;
		}
		if (config.autoPlay === false) {
			return 'idle';
		}
		return 'running';
	}

	private settleCompletedPlayback() {
		if (this.completionSettled) {
			return;
		}
		if (this.currentPlayState === 'running' && this.holdOnComplete && this.player.hasActivePose()) {
			this.syncCurrentPoses();
		} else {
			this.store.clear();
			this.transitionFrom = null;
			this.lastPoses.clear();
		}
		this.completionSettled = true;
	}

	private syncCurrentPoses() {
		const poses = this.player.getCurrentPoses();
		const nextPoses = new Map<AnimationPart, PartPose>();
		const parts = new Set<AnimationPart>(poses.keys());

		if (this.transitionFrom) {
			for (const part of this.transitionFrom.keys()) {
				parts.add(part);
			}
		}

		let progress = 1;
		if (this.transitionFrom && this.transitionDurationMs > 0) {
			const elapsed = nowMs() - this.transitionStartedAt;
			if (elapsed >= this.transitionDurationMs) {
				this.transitionFrom = null;
			} else {
				progress = Math.min(Math.max(elapsed / this.transitionDurationMs, 0), 1);
			}
		}

		for (const part of parts) {
			const targetPose = poses.get(part);
			const blendedPose =
				this.transitionFrom && progress < 1
					? blendPose(this.transitionFrom.get(part), targetPose, progress)
					: targetPose;
			if (blendedPose) {
				nextPoses.set(part, blendedPose);
			}
		}

		this.store.setPoses(nextPoses);
		this.lastPoses = nextPoses;
	}
}
