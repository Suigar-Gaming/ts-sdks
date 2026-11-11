// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, expect, test } from 'vitest';

const directory = mkdtempSync(join(tmpdir(), 'suifrens-codegen-'));
const script = fileURLToPath(
	new URL('../../../scripts/generate-accessory-assets.ts', import.meta.url),
);

beforeAll(() => {
	const artwork = join(directory, 'src/accessories/artwork');
	mkdirSync(artwork, { recursive: true });
	writeFileSync(
		join(artwork, 'fixture.svg'),
		`<?xml version="1.0"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 3000 3000" data-reactroot="">
<!-- Adapted by Suigar from the SuiFrens Display System by Mysten Labs. -->
<defs><clipPath id="clip-v1.2345"><rect width="100.12345" height="100"/></clipPath></defs>
<style>.paint { clip-path: url("#clip-v1.2345") } #outline { fill: red }</style>
<g class="paint" clip-path="url('#clip-v1.2345')"><path id="outline" d="M0.12345 0 L100.12345 100"/></g>
<use href="#clip-v1.2345"/>
<use xlink:href="#outline"/>
<animate begin="outline.end" attributeName="opacity" from="0" to="1" dur="1s"/>
</svg>`,
	);
	writeFileSync(
		join(artwork, 'limbs.svg'),
		`<svg viewBox="0 0 3000 3000">
<g id="fixture-body"><g><path d="M0 0L10 10"/></g></g>
<g id="fixture-backleg"><path d="M20 20L30 30"/></g>
<g id="fixture-frontleg"><path d="M40 40L50 50"/></g>
</svg>`,
	);
	execFileSync(process.execPath, [script], { cwd: directory, timeout: 10_000 });
});

afterAll(() => rmSync(directory, { recursive: true, force: true }));

test('optimizes SVG content without corrupting IDs, references or the artwork notice', () => {
	const svg = readFileSync(join(directory, 'src/generated/accessory-assets/fixture.svg'), 'utf8');
	expect(svg.match(/<svg\b/g)).toHaveLength(1);
	expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
	expect(svg).not.toContain('<?xml');
	expect(svg).not.toContain('xlink:');
	expect(svg).not.toContain('data-reactroot');
	expect(svg).not.toContain('100.12345');
	expect(svg).toContain(
		'<!-- Adapted by Suigar from the SuiFrens Display System by Mysten Labs. -->',
	);
	for (const layer of ['default', 'body', 'left', 'right']) {
		expect(svg).toContain(`<symbol id="${layer}"`);
		expect(svg).toContain(`id="fixture-${layer}-clip-v1.2345"`);
		expect(svg).toContain(`url(#fixture-${layer}-clip-v1.2345)`);
		expect(svg).toContain(`href="#fixture-${layer}-clip-v1.2345"`);
		expect(svg).toContain(`href="#fixture-${layer}-outline"`);
		expect(svg).toContain(`begin="fixture-${layer}-outline.end"`);
		expect(svg).toContain(`class="fixture-${layer}-paint"`);
		expect(svg).toContain(`.fixture-${layer}-paint`);
		expect(svg).toContain(`#fixture-${layer}-outline`);
	}
});

test('preserves nested role groups for independently animated body and legs', () => {
	const svg = readFileSync(join(directory, 'src/generated/accessory-assets/limbs.svg'), 'utf8');
	for (const part of ['body', 'rightLeg', 'leftLeg']) {
		expect(svg).toContain(`<symbol id="${part}"`);
	}
	expect(svg).toContain('id="limbs-body-fixture-body"');
	expect(svg).toContain('id="limbs-rightLeg-fixture-backleg"');
	expect(svg).toContain('id="limbs-leftLeg-fixture-frontleg"');
	expect(svg).toContain('<g><path');
	expect(svg).not.toContain('<symbol id="default"');
	expect(
		readFileSync(join(directory, 'src/generated/accessory-asset-manifest.ts'), 'utf8'),
	).toContain('"limbs"');
});
