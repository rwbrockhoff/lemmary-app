import { useState, type ReactNode } from 'react';
import { ThemeContext, type Theme } from './theme-context';

const STORAGE_KEY = 'artifact-theme';

const VALID_THEMES: Theme[] = ['light', 'dark', 'slate', 'canvas'];

const getInitialTheme = (): Theme => {
	const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
	if (stored && VALID_THEMES.includes(stored)) return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

type ThemeProviderProps = {
	children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const [theme, setTheme] = useState<Theme>(getInitialTheme);

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
	);
};
