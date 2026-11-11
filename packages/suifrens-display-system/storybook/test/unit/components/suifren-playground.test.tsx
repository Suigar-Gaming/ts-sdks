// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

// @vitest-environment happy-dom
import { composeStory } from '@storybook/react-vite';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import meta, {
	ControlPadPlayground,
} from '../../../src/components/suifrens/suifren-playground.stories.js';
import type { SuiFrenActorPose } from '../../../src/utils/use-suifren-actor.js';
import { createTestRoot } from '../../helpers/react-dom.js';

const actor = vi.hoisted(() => ({
	state: {
		expression: 'happy',
		baseExpression: 'happy',
		facing: 'right',
		locomotion: 'idle',
		position: { x: 100, y: 200 },
		animation: { preset: 'idle', trigger: 0 },
	},
	poseRef: { current: { position: { x: 100, y: 200 }, facing: 'right', elevation: 0 } },
	controls: {
		setDirection: vi.fn<(x: number, y: number) => void>(),
		setRun: vi.fn<(enabled: boolean) => void>(),
		setCrouch: vi.fn<(enabled: boolean) => void>(),
		requestJump: vi.fn<() => void>(),
		triggerEmote: vi.fn<(name: string, duration: number) => void>(),
		reset: vi.fn<() => void>(),
	},
}));
const useActor = vi.hoisted(() =>
	vi.fn<({ onPose }: { onPose: (pose: SuiFrenActorPose) => void }) => typeof actor>(),
);
vi.mock('../../../src/utils/use-suifren-actor.js', () => ({ useSuiFrenActor: useActor }));
vi.mock('@suigar/suifrens-display-system/image-inline', () => ({
	SuiFrenImageInline: () => <svg />,
}));
const Playground = composeStory(ControlPadPlayground, meta);
let view: ReturnType<typeof createTestRoot>;
beforeEach(() => {
	view = createTestRoot();
	vi.clearAllMocks();
	useActor.mockReturnValue(actor);
});
afterEach(async () => {
	await view.unmount();
	window.history.replaceState(null, '', '/');
});

test('docs renders jump elevation from the actor and leaves global keyboard shortcuts to canvas', async () => {
	window.history.replaceState(null, '', '/?viewMode=docs');
	await view.render(<Playground />);
	view.container.querySelector<HTMLButtonElement>('button[aria-label="Jump"]')!.click();
	expect(actor.controls.requestJump).toHaveBeenCalledOnce();
	const sprite = view.container.querySelector<HTMLElement>('[style*="will-change"]')!;
	const pose = { position: { x: 480, y: 420 }, elevation: 0, facing: 'right' } as const;
	const { onPose } = useActor.mock.calls[0]![0];
	onPose(pose);
	const grounded = sprite.style.transform;
	onPose({ ...pose, elevation: 80 });
	expect(sprite.style.transform).not.toBe(grounded);
	onPose(pose);
	expect(sprite.style.transform).toBe(grounded);
	window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
	expect(actor.controls.setDirection).not.toHaveBeenCalled();

	window.history.replaceState(null, '', '/?viewMode=story');
	await view.render(<Playground />);
	window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
	expect(actor.controls.setDirection).toHaveBeenLastCalledWith(1, 0);

	window.history.replaceState(null, '', '/?viewMode=docs');
	await view.render(<Playground />);
	actor.controls.setDirection.mockClear();
	window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));
	expect(actor.controls.setDirection).not.toHaveBeenCalled();
});

test('turning the character mirrors only the image and keeps the emote label readable', async () => {
	useActor.mockReturnValue({ ...actor, state: { ...actor.state, expression: 'heartEyes' } });
	await view.render(<Playground />);
	const sprite = view.container.querySelector<HTMLElement>('[style*="will-change"]')!;
	const image = sprite.querySelector('svg')!.parentElement!;
	const label = Array.from(sprite.querySelectorAll('div')).find(
		(element) => element.childElementCount === 0 && element.textContent === 'heartEyes',
	)!;
	const { onPose } = useActor.mock.calls[0]![0];
	const pose = { position: { x: 480, y: 420 }, elevation: 0 };
	for (const facing of ['left', 'right', 'left'] as const) {
		onPose({ ...pose, facing });
		expect(sprite.style.getPropertyValue('--sprite-facing')).toBe(facing === 'left' ? '-1' : '1');
		expect(sprite.style.transform).toBe('translate3d(150%, 75%, 0)');
		expect(image.style.transform).toBe('scaleX(var(--sprite-facing, 1))');
		expect(image.contains(label)).toBe(false);
		expect(label.style.transform).toBe('');
	}
});
