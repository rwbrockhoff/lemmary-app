import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark' | 'slate' | 'canvas';

export const THEMES: { value: Theme; label: string }[] = [
	{ value: 'light', label: 'Light' },
	{ value: 'dark', label: 'Dark' },
	{ value: 'canvas', label: 'Canvas' },
	{ value: 'slate', label: 'Slate' },
];

export type ThemeContextValue = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const useTheme = () => {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
	return ctx;
};
