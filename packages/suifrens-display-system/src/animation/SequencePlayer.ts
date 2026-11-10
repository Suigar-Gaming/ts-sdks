import { getEasing } from './easing.js';
import type { AnimationPart } from './parts.js';
import type { AnimationSequence, AnimationTrack, PartPose, PlaybackOptions } from './types.js';

export type NormalizedPlayback = {
	iterations: number;
	alternate: boolean;
	speed: number;
};

const EPSILON = 0.0001;

function interpolateScaleAxis(start: number, end: number, eased: number) {
	if (start * end < 0) {
		return eased < 0.5 ? start : end;
	}
	return start + (end - start) * eased;
}

export function normalizePlayback(playback?: PlaybackOptions): NormalizedPlayback {
	let iterations: number;
	if (playback?.iterations === 'infinite') {
		iterations = Infinity;
	} else if (typeof playback?.iterations === 'number') {
		iterations = Math.max(1, playback.iterations);
	} else if (playback?.loop === true) {
		iterations = Infinity;
	} else if (typeof playback?.loop === 'number') {
		iterations = Math.max(1, playback.loop);
	} else {
		iterations = 1;
	}

	return {
		iterations,
		alternate: Boolean(playback?.alternate),
		speed: playback?.speed && playback.speed > 0 ? playback.speed : 1,
	};
}

export function interpolatePose(track: AnimationTrack, time: number): PartPose | undefined {
	if (!track.keyframes.length) {
		return undefined;
	}

	const duration = track.keyframes[track.keyframes.length - 1]?.at ?? 0;
	if (duration <= 0) {
		return track.keyframes[track.keyframes.length - 1]?.pose;
	}

	let previous = track.keyframes[0];
	let next = track.keyframes[track.keyframes.length - 1];

	for (let index = 0; index < track.keyframes.length; index++) {
		const frame = track.keyframes[index];
		if (frame.at <= time) {
			previous = frame;
		}
		if (frame.at >= time) {
			next = frame;
			break;
		}
	}

	if (!previous || !next) {
		return undefined;
	}

	if (next.at === previous.at) {
		return next.pose;
	}

	const localProgress = (time - previous.at) / (next.at - previous.at);
	const easing = getEasing(next.ease ?? previous.ease);
	const eased = easing(Math.min(Math.max(localProgress, 0), 1));

	const pose: PartPose = {};

	if (previous.pose.rotate !== undefined || next.pose.rotate !== undefined) {
		const start = previous.pose.rotate ?? 0;
		const end = next.pose.rotate ?? 0;
		pose.rotate = start + (end - start) * eased;
	}

	if (previous.pose.translate || next.pose.translate) {
		const start = previous.pose.translate ?? { x: 0, y: 0 };
		const end = next.pose.translate ?? { x: 0, y: 0 };
		pose.translate = {
			x: start.x + (end.x - start.x) * eased,
			y: start.y + (end.y - start.y) * eased,
		};
	}

	if (previous.pose.scale || next.pose.scale) {
		const start = previous.pose.scale ?? { x: 1, y: 1 };
		const end = next.pose.scale ?? { x: 1, y: 1 };
		const startX = start.x ?? 1;
		const startY = start.y ?? 1;
		const endX = end.x ?? 1;
		const endY = end.y ?? 1;
		pose.scale = {
			x: interpolateScaleAxis(startX, endX, eased),
			y: interpolateScaleAxis(startY, endY, eased),
		};
	}

	return pose;
}

export function interpolateSequencePoses(sequence: AnimationSequence, time: number) {
	const poses = new Map<AnimationPart, PartPose>();
	const effectiveTime = Math.min(Math.max(time, 0), sequence.duration);

	for (const track of sequence.tracks) {
		const pose = interpolatePose(track, effectiveTime);
		if (pose) {
			poses.set(track.part, pose);
		}
	}

	return poses;
}

export class SequencePlayer {
	private sequence: AnimationSequence | null = null;
	private playback: NormalizedPlayback = normalizePlayback();
	private time = 0;
	private direction: 1 | -1 = 1;
	private completedIterations = 0;
	private playing = false;
	private currentPoses = new Map<AnimationPart, PartPose>();

	load(
		sequence: AnimationSequence,
		playback?: PlaybackOptions,
		options?: { direction?: 1 | -1; startAt?: 'start' | 'end' },
	) {
		this.sequence = sequence;
		this.playback = normalizePlayback(playback);
		this.direction = options?.direction ?? 1;
		this.time =
			options?.startAt === 'end' || (this.direction === -1 && options?.startAt !== 'start')
				? sequence.duration
				: 0;
		this.completedIterations = 0;
		this.playing = false;
		this.currentPoses.clear();
		this.recalculate();
	}

	play() {
		if (!this.sequence) {
			return;
		}
		this.playing = true;
	}

	pause() {
		this.playing = false;
	}

	stop(resetTime = true) {
		this.playing = false;
		if (resetTime && this.sequence) {
			this.time = this.direction === -1 ? this.sequence.duration : 0;
		}
		this.direction = 1;
		this.completedIterations = 0;
		this.currentPoses.clear();
	}

	isPlaying() {
		return this.playing;
	}

	hasSequence() {
		return Boolean(this.sequence);
	}

	setPlayback(playback?: PlaybackOptions) {
		this.playback = normalizePlayback(playback);
		this.completedIterations = 0;
		this.recalculate();
	}

	setDirection(
		direction: 1 | -1,
		resetTime = false,
		position: 'start' | 'end' = direction === -1 ? 'end' : 'start',
	) {
		if (!this.sequence) {
			return;
		}
		this.direction = direction;
		if (resetTime) {
			this.time = position === 'end' ? this.sequence.duration : 0;
			this.completedIterations = 0;
			this.recalculate();
		}
	}

	restart(position: 'start' | 'end' = this.direction === -1 ? 'end' : 'start') {
		if (!this.sequence) {
			return;
		}
		this.completedIterations = 0;
		this.time = position === 'end' ? this.sequence.duration : 0;
		this.currentPoses.clear();
		this.recalculate();
	}

	getDuration() {
		return this.sequence?.duration ?? 0;
	}

	getTime() {
		return this.time;
	}

	setTime(time: number) {
		if (!this.sequence) {
			return;
		}
		this.time = Math.min(Math.max(time, 0), this.sequence.duration);
		this.recalculate();
	}

	hasActivePose() {
		return this.currentPoses.size > 0;
	}

	update(deltaMs: number) {
		if (!this.sequence || !this.playing) {
			return false;
		}

		const duration = this.sequence.duration;
		if (duration <= 0) {
			return false;
		}

		const advanceBy = deltaMs * this.playback.speed;

		if (this.direction === 1) {
			this.time += advanceBy;
			if (this.time >= duration - EPSILON) {
				this.time = duration;
				this.handleIterationEnd();
			}
		} else {
			this.time -= advanceBy;
			if (this.time <= EPSILON) {
				this.time = 0;
				this.handleIterationEnd();
			}
		}

		this.recalculate();
		return true;
	}

	getCurrentPoses() {
		return this.currentPoses;
	}

	private handleIterationEnd() {
		this.completedIterations += 1;

		if (this.completedIterations >= this.playback.iterations) {
			this.playing = false;
			return;
		}

		if (this.playback.alternate) {
			this.direction = this.direction === 1 ? -1 : 1;
		} else {
			if (this.sequence) {
				this.time = this.direction === 1 ? 0 : this.sequence.duration;
			} else {
				this.time = 0;
			}
		}
	}

	private recalculate() {
		if (!this.sequence) {
			return;
		}

		const effectiveTime =
			this.playback.alternate && this.direction === -1
				? this.sequence.duration - this.time
				: this.time;

		this.currentPoses.clear();

		for (const track of this.sequence.tracks) {
			const pose = interpolatePose(track, effectiveTime);
			if (pose) {
				this.currentPoses.set(track.part, pose);
			}
		}
	}
}
