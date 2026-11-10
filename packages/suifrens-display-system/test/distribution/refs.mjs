import assert from 'node:assert/strict';
import { Window } from 'happy-dom';
import { createElement, createRef } from 'react';
import { flushSync } from 'react-dom';
import { AnimatedAccessory } from '@suigar/suifrens-display-system/animation';

const window = new Window();
globalThis.window = window;
globalThis.document = window.document;
const { createRoot } = await import('react-dom/client');
const root = createRoot(document.body.appendChild(document.createElement('div')));
const ref = createRef();
flushSync(() =>
	root.render(
		createElement('svg', null, createElement(AnimatedAccessory, null, createElement('g', { ref }))),
	),
);
assert.ok(ref.current);
assert.equal(ref.current, document.querySelector('g'));
root.unmount();
assert.equal(ref.current, null);
await window.happyDOM.close();
