#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
project=$(mktemp -d)
trap 'rm -rf "$project"' EXIT
pnpm pack --pack-destination "$project"
cp test/distribution/consumer/* "$project/"
vitest_version=$(node -p "require('vitest/package.json').version")
happy_dom_version=$(node -p "require('happy-dom/package.json').version")
cd "$project"
echo '{"type":"module","private":true}' > package.json
major=${1%%.*}
npm install --ignore-scripts --no-audit --no-fund ./*.tgz "react@$1" "react-dom@$1" "@types/react@$major" "@types/react-dom@$major" typescript@5.9.3 "vitest@$vitest_version" "happy-dom@$happy_dom_version"
node --experimental-strip-types entries.mts
./node_modules/.bin/vitest run
