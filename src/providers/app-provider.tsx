import { StrictMode } from 'react';
import type { ReactNode } from 'react';
import { QueryProvider } from './query-provider';

type AppProviderProps = {
	children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
	return (
		<StrictMode>
			<QueryProvider>{children}</QueryProvider>
		</StrictMode>
	);
};
