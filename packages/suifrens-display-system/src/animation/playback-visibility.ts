// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

const VIEWPORT_MARGIN = 100;

export function observePlaybackVisibility(
	root: SVGGElement | null,
	play: () => void,
	pause: () => void,
): () => void {
	const media = window.matchMedia('(prefers-reduced-motion: reduce)');
	let intersects = true;
	const sync = (): void => {
		if (intersects && document.visibilityState !== 'hidden' && !media.matches) {
			play();
		} else {
			pause();
		}
	};
	let observer: IntersectionObserver | undefined;
	if (root && typeof IntersectionObserver !== 'undefined') {
		const rect = root.getBoundingClientRect();
		intersects =
			rect.bottom >= -VIEWPORT_MARGIN &&
			rect.right >= -VIEWPORT_MARGIN &&
			rect.top <= window.innerHeight + VIEWPORT_MARGIN &&
			rect.left <= window.innerWidth + VIEWPORT_MARGIN;
		observer = new IntersectionObserver(
			([entry]) => {
				intersects = entry?.isIntersecting ?? true;
				sync();
			},
			{ rootMargin: `${VIEWPORT_MARGIN}px` },
		);
		observer.observe(root);
	}
	document.addEventListener('visibilitychange', sync);
	media.addEventListener?.('change', sync);
	sync();
	return () => {
		observer?.disconnect();
		document.removeEventListener('visibilitychange', sync);
		media.removeEventListener?.('change', sync);
	};
}
