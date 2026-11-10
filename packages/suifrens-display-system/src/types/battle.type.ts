// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { CSSProperties, ReactNode } from 'react';
import type { AnimationConfig, PlaybackOptions } from './animation.type.js';
import type { SuiFrenAttributes } from './suifren.type.js';

export type MinecraftHealthBarProps = {
	health: number;
	maxHealth?: number;
	hearts?: number;
	size?: number;
	label?: ReactNode;
	showNumbers?: boolean;
	style?: CSSProperties;
};

export type SuiFrenBattleSpriteProps = {
	attributes: SuiFrenAttributes;
	animation?: AnimationConfig | null;
	health: number;
	maxHealth: number;
	label?: ReactNode;
	facing?: 'left' | 'right';
	size?: number;
	shadow?: boolean;
	healthBarProps?: Omit<MinecraftHealthBarProps, 'health' | 'maxHealth' | 'label'>;
	imageStyle?: CSSProperties;
	hitFlashTrigger?: string | number | null;
	style?: CSSProperties;
};

export type DuelSide = 'left' | 'right';

export type DuelHealth = Record<DuelSide, number>;

export type DuelFighterState<TExpression extends string = string> = {
	health: number;
	maxHealth: number;
	expression: TExpression;
	baseExpression: TExpression;
	animation: AnimationConfig | null;
	status: 'alive' | 'dead';
};

export type DuelState<TExpression extends string = string> = {
	left: DuelFighterState<TExpression>;
	right: DuelFighterState<TExpression>;
	phase: string;
	running: boolean;
};

export type DuelWaitStep = {
	type: 'wait';
	ms: number;
	label?: string;
};

export type DuelPoseStep<TExpression extends string = string> = {
	type: 'pose';
	label: string;
	side: DuelSide;
	preset: string;
	playback?: PlaybackOptions;
	holdOnComplete?: boolean;
	expression?: TExpression;
	durationMs?: number;
	revertToIdle?: boolean;
};

export type DuelAttackStep<TExpression extends string = string> = {
	type: 'attack';
	label: string;
	attacker: { side: DuelSide; preset: string; expression?: TExpression };
	target: {
		damage: number;
		preset?: string;
		delayMs?: number;
		expression?: TExpression;
	};
	afterMs?: number;
};

export type DuelDeathStep<TExpression extends string = string> = {
	type: 'death';
	label: string;
	side: DuelSide;
	preset: string;
	expression?: TExpression;
	afterMs?: number;
};

export type DuelVictoryStep<TExpression extends string = string> = {
	type: 'victory';
	label: string;
	side: DuelSide;
	preset?: string;
	iterations?: number;
	expression?: TExpression;
	afterMs?: number;
};

export type DuelStep<TExpression extends string = string> =
	| DuelWaitStep
	| DuelPoseStep<TExpression>
	| DuelAttackStep<TExpression>
	| DuelDeathStep<TExpression>
	| DuelVictoryStep<TExpression>;

export type DuelScript<TExpression extends string = string> = {
	name: string;
	steps: Array<DuelStep<TExpression>>;
};

export type UseDuelScriptOptions<TExpression extends string = string> = {
	script: DuelScript<TExpression>;
	baseExpression: Record<DuelSide, TExpression>;
	maxHealth?: number | DuelHealth;
	initialHealth?: number | DuelHealth;
	idlePreset?: string;
	autoStart?: boolean;
	disabled?: boolean;
};

export type UseDuelScriptResult<TExpression extends string> = {
	state: DuelState<TExpression>;
	restart: () => void;
	stop: () => void;
	reset: () => void;
};
