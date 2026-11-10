import { createContext, type ReactNode, useContext } from 'react';
import type { AccessoryRenderer, AccessoryRendererProps } from '../../types/accessory.type.js';

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
