'use client';

import { CirclePlus, ShieldX, Swords } from 'lucide-react';
import { PVP_COINFLIP_ACTIONS } from '@suigar/sdk/games';
import type { PvPAction, PvPGameId, StandardGameId } from '@/lib/suigar-types';

export const STANDARD_GAME_OPTIONS = [
	{ value: 'coinflip', label: 'Coinflip' },
	{ value: 'keno', label: 'Keno' },
	{ value: 'limbo', label: 'Limbo' },
	{ value: 'plinko', label: 'Plinko' },
	{ value: 'range', label: 'Range' },
	{ value: 'soccer', label: 'Soccer' },
	{ value: 'wheel', label: 'Wheel' },
] as const satisfies ReadonlyArray<{ value: StandardGameId; label: string }>;

const PVP_ACTION_METADATA = {
	create: { label: 'Create', icon: CirclePlus },
	join: { label: 'Join', icon: Swords },
	cancel: { label: 'Cancel', icon: ShieldX },
} as const satisfies Record<
	PvPAction,
	{
		label: string;
		icon: React.ComponentType<{ className?: string | undefined }>;
	}
>;

export const PVP_ACTION_OPTIONS = PVP_COINFLIP_ACTIONS.map((value) => ({
	value,
	...PVP_ACTION_METADATA[value],
}));

export const PVP_GAME_OPTIONS = [
	{ value: 'pvp-coinflip', label: 'PvP Coinflip' },
] as const satisfies ReadonlyArray<{ value: PvPGameId; label: string }>;
