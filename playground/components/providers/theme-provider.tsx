'use client';

import {
	type ThemeProviderProps,
	ThemeProvider as NextThemesProvider,
	useTheme,
} from 'next-themes';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export { useTheme };
