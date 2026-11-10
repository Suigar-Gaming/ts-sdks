// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { expect, it } from 'vitest';
import { ExpressionCard } from '../../src/components/suifrens/ExpressionCard.js';
import '../../src/tailwind.css';

for (const theme of ['light', 'dark']) {
	it(`renders the Bullshark portrait in the ${theme} theme`, async () => {
		const host = document.body.appendChild(document.createElement('div'));
		host.className = 'story-page';
		host.dataset['theme'] = theme;
		host.style.width = '176px';
		const root = createRoot(host);
		try {
			flushSync(() =>
				root.render(
					<ExpressionCard
						detail="head"
						style={{ width: 112, height: 112 }}
						attributes={{
							finStyle: 'classic',
							skin: 'basic',
							expression: 'happy',
							mainColor: '6FBBEE',
							secondaryColor: 'E6FBFF',
						}}
					/>,
				),
			);
			const portrait = host.querySelector('svg');
			if (!portrait) throw new Error('Bullshark portrait did not render');
			await expect.element(portrait).toMatchScreenshot(`bullshark-${theme}`);
		} finally {
			root.unmount();
			host.remove();
		}
	});
}
