// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import {
	type ElementType,
	isValidElement,
	type ReactElement,
	type Ref,
	type RefObject,
	useEffect,
	useImperativeHandle,
	useRef,
} from 'react';
import type { AnimationPart } from '../types/animation.type.js';
import { useAnimationStore } from './AnimationContext.js';
import { matchPartByTransform } from './parts.js';

type AnimatedAccessoryProps = {
	children: ReactElement;
	fallbackPart?: AnimationPart | undefined;
};

const REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
const REACT_MEMO_TYPE = Symbol.for('react.memo');

function canAttachRefToType(type: unknown): boolean {
	if (!type) {
		return false;
	}
	if (typeof type === 'string') {
		return true;
	}
	if (typeof type === 'function') {
		return Boolean((type as any).prototype?.isReactComponent);
	}
	if (typeof type === 'object') {
		const $$typeof = (type as { $$typeof?: symbol }).$$typeof;
		if ($$typeof === REACT_FORWARD_REF_TYPE) {
			return true;
		}
		if ($$typeof === REACT_MEMO_TYPE) {
			return canAttachRefToType((type as { type?: unknown }).type);
		}
	}
	return false;
}

function getElementRef(element: ReactElement): Ref<SVGElement> | undefined {
	// React 19 stores refs in props; React 18 stores them on the element.
	// Inspect data properties so neither version's deprecated getter is invoked.
	const propsRef = Object.getOwnPropertyDescriptor(element.props, 'ref');
	if (propsRef && 'value' in propsRef) {
		return propsRef.value;
	}
	const elementRef = Object.getOwnPropertyDescriptor(element, 'ref');
	return elementRef && 'value' in elementRef ? elementRef.value : undefined;
}

export function AnimatedAccessory({ children, fallbackPart }: AnimatedAccessoryProps) {
	const store = useAnimationStore();
	const localRef = useRef<SVGElement | null>(null);
	const childRef =
		isValidElement(children) && canAttachRefToType(children.type)
			? getElementRef(children)
			: undefined;
	// Update external refs after every commit, including child key/type changes.
	useImperativeHandle(childRef, () => localRef.current!);

	useEffect(() => {
		if (!store) {
			return;
		}
		const svgElement = localRef.current;
		if (!svgElement) {
			return;
		}

		const registrations: Array<() => void> = [];
		const targets = [
			...(svgElement.matches('g[transform]') ? [svgElement as SVGGraphicsElement] : []),
			...svgElement.querySelectorAll<SVGGraphicsElement>('g[transform]'),
		];
		let matchedTarget = false;

		targets.forEach((target) => {
			const part = matchPartByTransform(target.getAttribute('transform'));
			if (!part) {
				return;
			}
			matchedTarget = true;
			registrations.push(store.registerElement(part, target));
		});

		if (!matchedTarget && fallbackPart) {
			registrations.push(store.registerElement(fallbackPart, svgElement as SVGGraphicsElement));
		}

		return () => {
			registrations.forEach((cleanup) => cleanup());
		};
	}, [store, fallbackPart]);

	if (!isValidElement(children)) {
		return children;
	}

	if (canAttachRefToType(children.type)) {
		const Child = children.type as ElementType;
		return (
			<Child
				{...(children.props as Record<string, unknown>)}
				key={children.key}
				ref={localRef}
				data-suifren-animation-part={fallbackPart}
			/>
		);
	}

	return (
		<g ref={localRef as RefObject<SVGGElement | null>} data-suifren-animation-part={fallbackPart}>
			{children}
		</g>
	);
}
