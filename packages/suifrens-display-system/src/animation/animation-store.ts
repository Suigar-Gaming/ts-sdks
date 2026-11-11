// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { composePartTransform } from '../helpers/animation/compose-part-transform.js';
import type {
	AnimationPart,
	AnimationRegistration,
	AnimationTarget,
	PartPose,
} from '../types/animation.type.js';
import { getPartDefinition } from './parts.js';

type ElementRegistration = {
	references: number;
	unregister: () => void;
};

const ZERO_POSE: PartPose = {};

export class AnimationStore {
	public readonly usesDirectDomTransforms = true;
	private registrations = new Map<AnimationPart, Set<AnimationRegistration>>();
	private poses = new Map<AnimationPart, PartPose>();
	private elementRegistrations = new WeakMap<
		SVGGraphicsElement,
		Map<AnimationPart, ElementRegistration>
	>();

	registerElement(
		part: AnimationPart,
		element: SVGGraphicsElement,
		pivotOverride?: { x: number; y: number },
	): () => void {
		let partRegistrations = this.elementRegistrations.get(element);
		if (!partRegistrations) {
			partRegistrations = new Map();
			this.elementRegistrations.set(element, partRegistrations);
		}
		const existing = partRegistrations.get(part);
		if (existing) {
			existing.references += 1;
			return () => {
				existing.references -= 1;
				if (!existing.references) {
					existing.unregister();
					partRegistrations.delete(part);
				}
			};
		}

		const baseTransform = element.getAttribute('transform') ?? undefined;
		const unregister = this.register(part, {
			getBaseTransform: () => baseTransform,
			setTransform: (value) => element.setAttribute('transform', value),
			pivotOverride,
			element,
		});
		const registration = { references: 1, unregister };
		partRegistrations.set(part, registration);
		return () => {
			registration.references -= 1;
			if (!registration.references) {
				registration.unregister();
				partRegistrations.delete(part);
			}
		};
	}

	register(part: AnimationPart, registration: AnimationRegistration): () => void {
		const existing = this.registrations.get(part);
		if (existing) {
			existing.add(registration);
		} else {
			this.registrations.set(part, new Set([registration]));
		}
		const pose = this.poses.get(part) ?? ZERO_POSE;
		this.setTransform(registration, this.compose(part, registration, pose));
		return () => {
			const collection = this.registrations.get(part);
			if (!collection) {
				return;
			}
			collection.delete(registration);
			if (!collection.size) {
				this.registrations.delete(part);
			}
		};
	}

	setPose(part: AnimationPart, pose: PartPose | undefined): void {
		if (!pose || (pose.rotate === undefined && !pose.translate && !pose.scale)) {
			this.poses.delete(part);
		} else {
			this.poses.set(part, pose);
		}
		this.notifyWithDependents(part);
	}

	setPoses(poses: Map<AnimationPart, PartPose>): void {
		this.poses = new Map(poses);
		for (const part of this.registrations.keys()) {
			this.notify(part);
		}
	}

	clear(): void {
		if (!this.poses.size) {
			return;
		}
		this.poses.clear();
		for (const part of this.registrations.keys()) {
			this.notify(part);
		}
	}

	getRegisteredParts(): Array<AnimationPart> {
		return Array.from(this.registrations.keys());
	}

	getAnimationTargets(): Array<AnimationTarget> {
		return Array.from(this.registrations.entries()).flatMap(([part, registrations]) =>
			Array.from(registrations, (registration) => ({
				part,
				element: registration.element,
				baseTransform: registration.getBaseTransform(),
				pivotOverride: registration.pivotOverride,
			})),
		);
	}

	getAnimationTargetsForParts(parts: ReadonlySet<AnimationPart>): Array<AnimationTarget> {
		return this.getAnimationTargets().filter(({ part }) => {
			let current: AnimationPart | undefined = part;
			while (current) {
				if (parts.has(current)) {
					return true;
				}
				current = getPartDefinition(current).parent;
			}
			return false;
		});
	}

	refresh(part: AnimationPart): void {
		this.notify(part);
	}

	private notify(part: AnimationPart): void {
		const pose = this.poses.get(part) ?? ZERO_POSE;
		const registrations = this.registrations.get(part);
		if (!registrations) {
			return;
		}
		for (const registration of registrations) {
			this.setTransform(registration, this.compose(part, registration, pose));
		}
	}

	private setTransform(registration: AnimationRegistration, value: string): void {
		if (registration.lastTransform === value) {
			return;
		}
		registration.lastTransform = value;
		registration.setTransform(value);
	}

	private notifyWithDependents(part: AnimationPart): void {
		for (const registeredPart of this.registrations.keys()) {
			if (registeredPart === part || this.isDependentOn(registeredPart, part)) {
				this.notify(registeredPart);
			}
		}
	}

	private isDependentOn(part: AnimationPart, ancestor: AnimationPart): boolean {
		let current = getPartDefinition(part).parent;
		while (current) {
			if (current === ancestor) {
				return true;
			}
			current = getPartDefinition(current).parent;
		}
		return false;
	}

	private compose(
		part: AnimationPart,
		registration: AnimationRegistration,
		pose: PartPose,
	): string {
		const poses = new Map(this.poses);
		poses.set(part, pose);
		return composePartTransform(
			part,
			registration.getBaseTransform(),
			poses,
			registration.pivotOverride,
		);
	}
}
