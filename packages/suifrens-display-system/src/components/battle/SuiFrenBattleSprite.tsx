import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';
import type { AnimationConfig } from '../../animation/types.js';
import { SuiFrenImage } from '../SuiFrenImage.js';
import type { SuiFrenAttributes } from '../types.js';
import { MinecraftHealthBar, type MinecraftHealthBarProps } from './MinecraftHealthBar.js';

const HIT_FLASH_FILTER_ID = 'hit-flash-red';

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

export function SuiFrenBattleSprite({
	attributes,
	animation = null,
	health,
	maxHealth,
	label,
	facing = 'right',
	size = 220,
	shadow = true,
	healthBarProps,
	imageStyle,
	hitFlashTrigger,
	style,
}: SuiFrenBattleSpriteProps) {
	const spriteSize = Math.max(120, size);
	const healthBarOffset = spriteSize * 0.12;
	const [flash, setFlash] = useState({
		trigger: hitFlashTrigger,
		active: hitFlashTrigger !== undefined && hitFlashTrigger !== null,
	});
	// A new hit starts a fresh flash without remounting the animated SuiFren.
	if (!Object.is(flash.trigger, hitFlashTrigger)) {
		setFlash({
			trigger: hitFlashTrigger,
			active: hitFlashTrigger !== undefined && hitFlashTrigger !== null ? true : flash.active,
		});
	}
	const flashTimeoutRef = useRef<number | null>(null);
	const baseFilter =
		typeof imageStyle?.filter === 'string' && imageStyle.filter !== 'none' ? imageStyle.filter : '';
	const hitFlashFilter = `url(#${HIT_FLASH_FILTER_ID})`;
	const combinedFilter = flash.active
		? [baseFilter, hitFlashFilter].filter(Boolean).join(' ')
		: (imageStyle?.filter ?? '');
	const resolvedImageStyle = {
		...imageStyle,
		...(combinedFilter ? { filter: combinedFilter } : {}),
	};

	useEffect(() => {
		if (hitFlashTrigger === undefined || hitFlashTrigger === null) {
			return;
		}
		if (flashTimeoutRef.current) {
			window.clearTimeout(flashTimeoutRef.current);
		}
		flashTimeoutRef.current = window.setTimeout(() => {
			setFlash((current) => ({ ...current, active: false }));
			flashTimeoutRef.current = null;
		}, 160);
	}, [hitFlashTrigger]);

	useEffect(
		() => () => {
			if (flashTimeoutRef.current) {
				window.clearTimeout(flashTimeoutRef.current);
				flashTimeoutRef.current = null;
			}
		},
		[],
	);

	return (
		<div
			style={{
				position: 'relative',
				width: spriteSize,
				height: spriteSize,
				...style,
			}}
		>
			<svg
				aria-hidden="true"
				focusable="false"
				style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
			>
				<defs>
					<filter id={HIT_FLASH_FILTER_ID} colorInterpolationFilters="sRGB">
						<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
					</filter>
				</defs>
			</svg>
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: -healthBarOffset,
					transform: 'translateX(-50%)',
					pointerEvents: 'none',
				}}
			>
				<MinecraftHealthBar
					health={health}
					maxHealth={maxHealth}
					label={label}
					{...healthBarProps}
				/>
			</div>

			<div
				style={{
					width: '100%',
					height: '100%',
					position: 'relative',
					transform: facing === 'left' ? 'scaleX(-1)' : undefined,
					transformOrigin: '50% 80%',
				}}
			>
				<div style={{ width: '100%', height: '100%', ...resolvedImageStyle }}>
					<SuiFrenImage
						attributes={attributes}
						shadow={shadow}
						style={{ width: '100%', height: '100%' }}
						animation={animation}
					/>
				</div>
			</div>
		</div>
	);
}
