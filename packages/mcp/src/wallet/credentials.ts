// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import { readFileSync } from 'node:fs';
import { chmod, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { isValidSuiAddress } from '@mysten/sui/utils';
import { SUPPORTED_SUI_NETWORKS, type SuigarNetwork } from '@suigar/sdk';
import { ensureSuigarMcpDataDirectory, SUIGAR_MCP_DATA_DIRECTORY } from './storage.js';

const CREDENTIALS_FILE: string = join(SUIGAR_MCP_DATA_DIRECTORY, 'credentials.json');

type WalletType = 'wallet' | 'zklogin';

export type WalletProfile = {
	address: string;
	walletType: WalletType;
	frontendOrigin: string;
	connectedAt: string;
};

type Credentials = {
	version: 1;
	defaultNetwork: SuigarNetwork;
	profiles: Partial<Record<SuigarNetwork, WalletProfile>>;
};

function empty(): Credentials {
	return {
		version: 1,
		defaultNetwork: 'testnet',
		profiles: {},
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isValidSuigarNetwork(value: unknown): value is SuigarNetwork {
	return typeof value === 'string' && SUPPORTED_SUI_NETWORKS.includes(value as SuigarNetwork);
}

function isValidWalletProfile(value: unknown): value is WalletProfile {
	if (!isRecord(value)) {
		return false;
	}
	return (
		typeof value.address === 'string' &&
		isValidSuiAddress(value.address) &&
		(value.walletType === 'wallet' || value.walletType === 'zklogin') &&
		typeof value.frontendOrigin === 'string' &&
		typeof value.connectedAt === 'string'
	);
}

function isValidCredentials(value: unknown): value is Credentials {
	if (!isRecord(value)) {
		return false;
	}
	if (
		value.version !== 1 ||
		!isValidSuigarNetwork(value.defaultNetwork) ||
		!isRecord(value.profiles)
	) {
		return false;
	}

	return Object.entries(value.profiles).every(
		([network, profile]) => isValidSuigarNetwork(network) && isValidWalletProfile(profile),
	);
}

export function credentialsPath(): string {
	return CREDENTIALS_FILE;
}

/**
 * Reads the configured network without requiring callers to load full credentials. This is
 * intentionally synchronous because runtime client creation is synchronous.
 */
export function readPersistedDefaultNetwork(): SuigarNetwork {
	try {
		const value: unknown = JSON.parse(readFileSync(CREDENTIALS_FILE, 'utf8'));
		const network = isRecord(value) ? value.defaultNetwork : undefined;
		return isValidSuigarNetwork(network) ? network : 'testnet';
	} catch {
		return 'testnet';
	}
}

export async function loadCredentials(): Promise<Credentials> {
	try {
		const parsed: unknown = JSON.parse(await readFile(CREDENTIALS_FILE, 'utf8'));
		return isValidCredentials(parsed) ? parsed : empty();
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			return empty();
		}
		throw error;
	}
}

export async function saveCredentials(credentials: Credentials): Promise<void> {
	await ensureSuigarMcpDataDirectory();
	await writeFile(CREDENTIALS_FILE, `${JSON.stringify(credentials, null, 2)}\n`, {
		mode: 0o600,
	});
	await chmod(CREDENTIALS_FILE, 0o600);
}

export async function saveProfile(
	network: SuigarNetwork,
	profile: WalletProfile,
): Promise<Credentials> {
	const credentials = await loadCredentials();
	credentials.defaultNetwork = network;
	credentials.profiles[network] = profile;
	await saveCredentials(credentials);
	return credentials;
}

export async function setDefaultNetwork(network: SuigarNetwork): Promise<Credentials> {
	const credentials = await loadCredentials();
	credentials.defaultNetwork = network;
	await saveCredentials(credentials);
	return credentials;
}

export async function removeProfile(network: SuigarNetwork): Promise<Credentials> {
	const credentials = await loadCredentials();
	delete credentials.profiles[network];
	await saveCredentials(credentials);
	return credentials;
}

export async function clearCredentials(): Promise<void> {
	await rm(CREDENTIALS_FILE, { force: true });
}
