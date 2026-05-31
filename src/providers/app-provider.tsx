import { StrictMode } from 'react';
import type { ReactNode } from 'react';
import { ArtifactProvider, Tooltip } from '@artifact-ui/core';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { useTheme } from './theme-context';
import { ToastContextProvider } from './toast-provider';

type AppProviderProps = {
	children: ReactNode;
};

const ThemedArtifact = ({ children }: { children: ReactNode }) => {
	const { theme } = useTheme();
	return (
		<ArtifactProvider theme={theme} accent="patina" radius="medium">
			<Tooltip.Provider delayDuration={300}>{children}</Tooltip.Provider>
		</ArtifactProvider>
	);
};

export const AppProvider = ({ children }: AppProviderProps) => {
	return (
		<StrictMode>
			<ThemeProvider>
				<ThemedArtifact>
					<QueryProvider>
						<ToastContextProvider>{children}</ToastContextProvider>
					</QueryProvider>
				</ThemedArtifact>
			</ThemeProvider>
		</StrictMode>
	);
};
