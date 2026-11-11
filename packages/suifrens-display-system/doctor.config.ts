// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { defineConfig } from 'react-doctor/api';

export default defineConfig({
	blocking: 'warning',
	ignore: { files: ['examples/**', 'test/**', 'scripts/**', '*.config.ts'] },
	share: false,
	noScore: true,
});
