// @vitest-environment happy-dom
import { act, StrictMode } from 'react';
import { expect, test, vi } from 'vitest';
import { useDuelScript } from '../../../src/hooks/use-duel-script.js';
import type { DuelScript } from '../../../src/types/battle.type.js';
import { createTestRoot } from '../../helpers/react-dom.js';

const script: DuelScript = { name: 'Duel', steps: [{ type: 'wait', ms: 100, label: 'Waiting' }] };
const baseExpression = { left: 'happy', right: 'happy' };

function Duel() {
	const { state, restart } = useDuelScript({ script, baseExpression, autoStart: false });
	return (
		<button onClick={restart}>
			{state.running ? 'Running' : 'Stopped'}: {state.phase}
		</button>
	);
}

test('an interrupted duel cannot mark its replacement as finished', async () => {
	vi.useFakeTimers();
	const view = createTestRoot();
	try {
		await view.render(
			<StrictMode>
				<Duel />
			</StrictMode>,
		);
		const button = view.container.querySelector('button')!;
		await act(async () => button.click());
		await act(async () => vi.advanceTimersByTimeAsync(50));
		await act(async () => button.click());
		await act(async () => vi.advanceTimersByTimeAsync(50));
		expect(button.textContent).toBe('Running: Waiting');
		await act(async () => vi.advanceTimersByTimeAsync(50));
		expect(button.textContent).toBe('Stopped: Complete');
	} finally {
		await view.unmount();
		vi.useRealTimers();
	}
});
