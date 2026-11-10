import { createContext, type JSX, type ReactNode, useContext } from 'react';
import type { AccessoryMetadata, SuiFrenSpecies } from '../../utils/accessoryUtils.js';

export type BodyAccessoryProps = {
	lor?: 'left' | 'right';
	body?: boolean;
};

export type AccessoryRendererProps = BodyAccessoryProps & {
	accessory: AccessoryMetadata;
	species: SuiFrenSpecies;
};

export type AccessoryRenderer = (props: AccessoryRendererProps) => JSX.Element | null;

const AccessoryRendererContext = createContext<AccessoryRenderer | null>(null);

export function AccessoryRendererProvider({
	renderer,
	children,
}: {
	renderer: AccessoryRenderer;
	children: ReactNode;
}) {
	return (
		<AccessoryRendererContext.Provider value={renderer}>
			{children}
		</AccessoryRendererContext.Provider>
	);
}

export function AccessorySlot(props: AccessoryRendererProps) {
	const renderer = useContext(AccessoryRendererContext);
	return renderer ? renderer(props) : null;
}
