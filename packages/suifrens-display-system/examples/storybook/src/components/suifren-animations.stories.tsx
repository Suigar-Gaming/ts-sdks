import type { Meta, StoryObj } from '@storybook/react-vite';
import { accessories } from '@suigar/suifrens-display-system/accessories';
import { SuiFrenImage } from '@suigar/suifrens-display-system/image-inline';
import { PRESET_CATALOG } from '../animation/preset-catalog.js';

const bullsharkAttributes = {
	mainColor: '6FBBEE',
	secondaryColor: 'E6FBFF',
	skin: 'basic',
	finStyle: 'classic',
	expression: 'happy',
} as const;

const capyAttributes = {
	mainColor: '6FBBEE',
	secondaryColor: 'E6FBFF',
	skin: 'basic',
	earShape: 'default',
	expression: 'happy',
} as const;

const microphoneAccessory = accessories.find((accessory) => accessory.name === 'microphone');

function getPreviewAccessories(presetName: string) {
	return presetName === 'talkMicrophone' && microphoneAccessory ? [microphoneAccessory] : undefined;
}

const meta = {
	title: 'SuiFrenImage/Animations',
	component: SuiFrenImage,
	tags: ['autodocs'],
} satisfies Meta<typeof SuiFrenImage>;

export default meta;

type Story = StoryObj<typeof SuiFrenImage>;

export const Presets: Story = {
	render: () => (
		<div className="flex flex-col gap-10">
			{PRESET_CATALOG.map((group) => (
				<section key={group.title}>
					<h2 className="mb-4 text-base font-semibold text-slate-900">{group.title}</h2>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{group.presets.map((preset) => (
							<div
								key={preset.name}
								className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
							>
								<div className="flex items-baseline justify-between gap-2">
									<span className="text-sm font-semibold text-slate-800">{preset.label}</span>
									<span className="font-mono text-[11px] text-slate-500">{preset.name}</span>
								</div>
								<div className="mt-4 grid grid-cols-2 gap-3">
									<div className="flex flex-col items-center gap-2">
										<div className="h-44 w-44">
											<SuiFrenImage
												attributes={bullsharkAttributes}
												accessories={getPreviewAccessories(preset.name)}
												shadow
												style={{ width: '100%', height: '100%' }}
												animation={preset.config}
											/>
										</div>
										<span className="text-xs font-semibold text-slate-600">Bullshark</span>
									</div>
									<div className="flex flex-col items-center gap-2">
										<div className="h-44 w-44">
											<SuiFrenImage
												attributes={capyAttributes}
												accessories={getPreviewAccessories(preset.name)}
												shadow
												style={{ width: '100%', height: '100%' }}
												animation={preset.config}
											/>
										</div>
										<span className="text-xs font-semibold text-slate-600">Capy</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</section>
			))}
		</div>
	),
};
