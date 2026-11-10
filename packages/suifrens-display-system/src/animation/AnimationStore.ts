import {
	IDENTITY_MATRIX,
	matrixToString,
	multiplyMatrix,
	parseMatrix,
	rotateMatrix,
	scaleMatrix,
	translateMatrix,
} from './matrix.js';
import { type AnimationPart, getPartDefinition } from './parts.js';
import type { PartPose } from './types.js';

export type AnimationRegistration = {
	getBaseTransform: () => string | undefined;
	setTransform: (value: string) => void;
	pivotOverride?: { x: number; y: number };
	lastTransform?: string;
	element?: SVGGraphicsElement;
};

type ElementRegistration = {
	references: number;
	unregister: () => void;
};

const ZERO_POSE: PartPose = {};
const TRANSLATE_SCALE = 4;

export function composePartTransform(
	part: AnimationPart,
	baseTransform: string | undefined,
	poses: ReadonlyMap<AnimationPart, PartPose>,
	pivotOverride?: { x: number; y: number },
) {
	const baseMatrix = parseMatrix(baseTransform) ?? IDENTITY_MATRIX;
	let composed = baseMatrix;
	const pose = poses.get(part) ?? ZERO_POSE;

	const pivotSource = pivotOverride ?? getPartDefinition(part).pivot;

	if (pose.scale) {
		const scale = scaleMatrix(pose.scale.x ?? 1, pose.scale.y ?? 1, pivotSource.x, pivotSource.y);
		composed = multiplyMatrix(scale, composed);
	}

	if (pose.rotate !== undefined) {
		const rotate = rotateMatrix(pose.rotate, pivotSource.x, pivotSource.y);
		composed = multiplyMatrix(rotate, composed);
	}

	if (pose.translate) {
		const translate = translateMatrix(
			pose.translate.x * TRANSLATE_SCALE,
			pose.translate.y * TRANSLATE_SCALE,
		);
		composed = multiplyMatrix(translate, composed);
	}

	let parent = getPartDefinition(part).parent;
	while (parent) {
		const parentPose = poses.get(parent);
		if (parentPose) {
			const parentPivot = getPartDefinition(parent).pivot;
			if (parentPose.scale) {
				const scale = scaleMatrix(
					parentPose.scale.x ?? 1,
					parentPose.scale.y ?? 1,
					parentPivot.x,
					parentPivot.y,
				);
				composed = multiplyMatrix(scale, composed);
			}
			if (parentPose.rotate !== undefined) {
				const rotate = rotateMatrix(parentPose.rotate, parentPivot.x, parentPivot.y);
				composed = multiplyMatrix(rotate, composed);
			}
			if (parentPose.translate) {
				const translate = translateMatrix(
					parentPose.translate.x * TRANSLATE_SCALE,
					parentPose.translate.y * TRANSLATE_SCALE,
				);
				composed = multiplyMatrix(translate, composed);
			}
		}
		parent = getPartDefinition(parent).parent;
	}

	return matrixToString(composed);
}

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
	) {
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

	register(part: AnimationPart, registration: AnimationRegistration) {
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

	setPose(part: AnimationPart, pose: PartPose | undefined) {
		if (!pose || (pose.rotate === undefined && !pose.translate && !pose.scale)) {
			this.poses.delete(part);
		} else {
			this.poses.set(part, pose);
		}
		this.notifyWithDependents(part);
	}

	setPoses(poses: Map<AnimationPart, PartPose>) {
		this.poses = new Map(poses);
		for (const part of this.registrations.keys()) {
			this.notify(part);
		}
	}

	clear() {
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

	getAnimationTargets() {
		return Array.from(this.registrations.entries()).flatMap(([part, registrations]) =>
			Array.from(registrations, (registration) => ({
				part,
				element: registration.element,
				baseTransform: registration.getBaseTransform(),
				pivotOverride: registration.pivotOverride,
			})),
		);
	}

	getAnimationTargetsForParts(parts: ReadonlySet<AnimationPart>) {
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

	refresh(part: AnimationPart) {
		this.notify(part);
	}

	private notify(part: AnimationPart) {
		const pose = this.poses.get(part) ?? ZERO_POSE;
		const registrations = this.registrations.get(part);
		if (!registrations) {
			return;
		}
		for (const registration of registrations) {
			this.setTransform(registration, this.compose(part, registration, pose));
		}
	}

	private setTransform(registration: AnimationRegistration, value: string) {
		if (registration.lastTransform === value) {
			return;
		}
		registration.lastTransform = value;
		registration.setTransform(value);
	}

	private notifyWithDependents(part: AnimationPart) {
		for (const registeredPart of this.registrations.keys()) {
			if (registeredPart === part || this.isDependentOn(registeredPart, part)) {
				this.notify(registeredPart);
			}
		}
	}

	private isDependentOn(part: AnimationPart, ancestor: AnimationPart) {
		let current = getPartDefinition(part).parent;
		while (current) {
			if (current === ancestor) {
				return true;
			}
			current = getPartDefinition(current).parent;
		}
		return false;
	}

	private compose(part: AnimationPart, registration: AnimationRegistration, pose: PartPose) {
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
