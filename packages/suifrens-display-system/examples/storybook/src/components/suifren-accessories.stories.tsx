import type { Meta, StoryObj } from '@storybook/react-vite';
import { accessories } from '@suigar/suifrens-display-system/accessories';
import { SuiFrenImageInline } from '@suigar/suifrens-display-system/image-inline';

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

const meta = {
	title: 'SuiFrenImageInline/Accessories',
	component: SuiFrenImageInline,
	tags: ['autodocs'],
} satisfies Meta<typeof SuiFrenImageInline>;

export default meta;

type Story = StoryObj<typeof SuiFrenImageInline>;

export const AllAccessories: Story = {
	render: () => (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
			{accessories.map((accessory) => (
				<div
					key={accessory.name}
					className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
				>
					<div className="flex items-baseline justify-between gap-2">
						<span className="text-sm font-semibold text-slate-800">{accessory.name}</span>
						<span className="text-xs font-semibold text-slate-500">{accessory.type}</span>
					</div>
					<div className="mt-4 grid grid-cols-2 gap-3">
						<div className="flex flex-col items-center gap-2">
							<div className="h-44 w-44">
								<SuiFrenImageInline
									attributes={bullsharkAttributes}
									accessories={[accessory]}
									shadow
									style={{ width: '100%', height: '100%' }}
								/>
							</div>
							<span className="text-xs font-semibold text-slate-600">Bullshark</span>
						</div>
						<div className="flex flex-col items-center gap-2">
							<div className="h-44 w-44">
								<SuiFrenImageInline
									attributes={capyAttributes}
									accessories={[accessory]}
									shadow
									style={{ width: '100%', height: '100%' }}
								/>
							</div>
							<span className="text-xs font-semibold text-slate-600">Capy</span>
						</div>
					</div>
				</div>
			))}
		</div>
	),
};
