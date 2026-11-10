import type { Meta, StoryObj } from '@storybook/react-vite';
import {
	accessories,
	SOCCER_TEAM_KITS,
	type SoccerTeamCountryCode,
} from '@suigar/suifrens-display-system/accessories';
import { SuiFrenImage as SuiFrenImageAssets } from '@suigar/suifrens-display-system/image';
import { SuiFrenImage } from '@suigar/suifrens-display-system/image-inline';

const capyAttributes = {
	mainColor: '6FBBEE',
	secondaryColor: 'E6FBFF',
	skin: 'basic',
	earShape: 'default',
	expression: 'happy',
} as const;

const bullsharkAttributes = {
	mainColor: '6FBBEE',
	secondaryColor: 'E6FBFF',
	skin: 'basic',
	finStyle: 'classic',
	expression: 'happy',
} as const;

const teamShirt = accessories.find((accessory) => accessory.name === 'soccer team shirt')!;
const teamTrunks = accessories.find((accessory) => accessory.name === 'soccer team swim trunks')!;
const leftGothBoot = accessories.find((accessory) => accessory.name === 'left goth boot')!;
const rightGothBoot = accessories.find((accessory) => accessory.name === 'right goth boot')!;

const countries = Object.keys(SOCCER_TEAM_KITS).filter(
	(code) => code !== 'GLOBAL',
) as Array<SoccerTeamCountryCode>;

function buildTeamGear(country: SoccerTeamCountryCode, side: 'home' | 'away' = 'home') {
	return [
		{
			...teamShirt,
			renderOptions: { ...teamShirt.renderOptions, country, side },
		},
		{
			...teamTrunks,
			renderOptions: { ...teamTrunks.renderOptions, country, side },
		},
		leftGothBoot,
		rightGothBoot,
	];
}

const meta = {
	title: 'SuiFrenImage/Soccer Team Gear',
	component: SuiFrenImage,
	tags: ['autodocs'],
} satisfies Meta<typeof SuiFrenImage>;

export default meta;

type Story = StoryObj<typeof SuiFrenImage>;

export const AllCountries: Story = {
	render: () => (
		<div className="grid grid-cols-2 gap-3 bg-slate-100 p-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">
			{countries.map((country) => (
				<div key={country} className="rounded-xl border border-slate-300 bg-white p-2 shadow-xs">
					<div className="mb-1 flex items-center justify-between">
						<span className="text-sm font-black text-slate-900">{country}</span>
						<span className="text-[10px] font-bold text-slate-500 uppercase">Inline</span>
					</div>
					<div className="h-36">
						<SuiFrenImage
							attributes={capyAttributes}
							accessories={buildTeamGear(country)}
							shadow
							style={{ width: '100%', height: '100%' }}
						/>
					</div>
				</div>
			))}
		</div>
	),
};

export const InlineAndAssetRenderers: Story = {
	render: () => {
		const showcaseCountries: Array<SoccerTeamCountryCode> = [
			'AR',
			'BR',
			'FR',
			'GB',
			'JP',
			'MX',
			'US',
		];

		return (
			<div className="grid grid-cols-1 gap-4 bg-slate-100 p-4 md:grid-cols-2">
				{showcaseCountries.map((country) => (
					<div key={country} className="rounded-xl border border-slate-300 bg-white p-3">
						<h2 className="mb-2 text-sm font-black text-slate-900">{country}</h2>
						<div className="grid grid-cols-2 gap-3">
							<div className="h-56">
								<SuiFrenImage
									attributes={capyAttributes}
									accessories={buildTeamGear(country)}
									shadow
									style={{ width: '100%', height: '100%' }}
								/>
							</div>
							<div className="h-56">
								<SuiFrenImageAssets
									attributes={bullsharkAttributes}
									accessories={buildTeamGear(country, 'away')}
									shadow
									style={{ width: '100%', height: '100%' }}
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	},
};
