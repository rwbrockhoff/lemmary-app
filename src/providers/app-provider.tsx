import { StrictMode } from 'react';
import type { ReactNode } from 'react';
import { ArtifactProvider } from '@artifact-ui/core';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { useTheme } from './theme-context';

type AppProviderProps = {
	children: ReactNode;
};

const ThemedArtifact = ({ children }: { children: ReactNode }) => {
	const { theme } = useTheme();
	return (
		<ArtifactProvider theme={theme} accent="patina" radius="medium">
			{children}
		</ArtifactProvider>
	);
};

export const AppProvider = ({ children }: AppProviderProps) => {
	return (
		<StrictMode>
			<ThemeProvider>
				<ThemedArtifact>
					<QueryProvider>{children}</QueryProvider>
				</ThemedArtifact>
			</ThemeProvider>
		</StrictMode>
	);
};
