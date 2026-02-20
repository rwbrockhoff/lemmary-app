import { StrictMode } from 'react';
import type { ReactNode } from 'react';
import { ArtifactProvider } from '@artifact-ui/core';
import { QueryProvider } from './query-provider';

type AppProviderProps = {
	children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
	return (
		<StrictMode>
			<ArtifactProvider theme="light" accent="obsidian" radius="medium">
				<QueryProvider>{children}</QueryProvider>
			</ArtifactProvider>
		</StrictMode>
	);
};
