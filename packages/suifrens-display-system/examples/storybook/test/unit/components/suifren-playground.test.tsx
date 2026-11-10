// @vitest-environment happy-dom
import type { ComponentType } from 'react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { ControlPadPlayground } from '../../../src/components/suifren-playground.stories.js';
import { createTestRoot } from '../../helpers/react-dom.js';

const actor = vi.hoisted(() => ({
	state: {
		expression: 'happy',
		baseExpression: 'happy',
		facing: 'right',
		locomotion: 'idle',
		position: { x: 100, y: 200 },
		animationPreset: 'idle',
		animationPlayback: {},
		animationTrigger: 0,
		animationHoldOnComplete: false,
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
vi.mock('../../../src/utils/use-suifren-actor.js', () => ({ useSuiFrenActor: () => actor }));
vi.mock('@suigar/suifrens-display-system/image-inline', () => ({
	SuiFrenImageInline: () => <svg />,
}));
const Playground = ControlPadPlayground.render as ComponentType;
let view: ReturnType<typeof createTestRoot>;
beforeEach(() => {
	view = createTestRoot();
	vi.clearAllMocks();
});
afterEach(async () => {
	await view.unmount();
	window.history.replaceState(null, '', '/');
});

test('switching docs/canvas starts and stops animation frames and keyboard listeners', async () => {
	const schedule = vi.spyOn(globalThis, 'requestAnimationFrame').mockReturnValue(42);
	const cancel = vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {});
	window.history.replaceState(null, '', '/?viewMode=docs');
	await view.render(<Playground />);
	expect(schedule).not.toHaveBeenCalled();
	window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
	expect(actor.controls.setDirection).not.toHaveBeenCalled();

	window.history.replaceState(null, '', '/?viewMode=story');
	await view.render(<Playground />);
	expect(schedule).toHaveBeenCalledTimes(1);
	window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
	expect(actor.controls.setDirection).toHaveBeenLastCalledWith(1, 0);

	window.history.replaceState(null, '', '/?viewMode=docs');
	await view.render(<Playground />);
	expect(cancel).toHaveBeenCalledExactlyOnceWith(42);
	actor.controls.setDirection.mockClear();
	window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));
	expect(actor.controls.setDirection).not.toHaveBeenCalled();
	expect(schedule).toHaveBeenCalledTimes(1);
});
