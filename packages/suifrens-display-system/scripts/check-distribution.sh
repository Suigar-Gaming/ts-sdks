#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
project=$(mktemp -d)
trap 'rm -rf "$project"' EXIT
pnpm pack --pack-destination "$project"
cp test/distribution/*.mjs "$project/"
node --input-type=module - "$project" <<'JS'
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import pkg from './package.json' with { type: 'json' };
const entries = ['.', './image', './image-inline', './accessories', './colors',
	'./attributes', './animation', './types'];
assert.deepEqual(Object.keys(pkg.exports).sort(), [...entries].sort());
const imports = entries.map(entry =>
	`import * as ${entry === '.' ? 'root' : entry.slice(2).replaceAll('-', '_')} from '${pkg.name}${entry.slice(1)}';`
);
writeFileSync(process.argv[2] + '/entries.mts', imports.join('\n') + '\nexport const species = [root.CapyImage, root.BullsharkImage];\n');
JS
happy_dom_version=$(node -p "require('happy-dom/package.json').version")
cd "$project"
echo '{"type":"module","private":true}' > package.json
major=${1%%.*}
npm install --ignore-scripts --no-audit --no-fund ./*.tgz "react@$1" "react-dom@$1" "@types/react@$major" "@types/react-dom@$major" typescript@5.9.3 "happy-dom@$happy_dom_version"
node --experimental-strip-types entries.mts
./node_modules/.bin/tsc --strict --noEmit --module nodenext --target es2022 entries.mts
node consumer.mjs
node refs.mjs
