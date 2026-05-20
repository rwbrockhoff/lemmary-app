import { useState } from 'react';
import type { ReactNode } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServiceStatusContext } from './service-status-context';

const isServiceError = (error: unknown): boolean => {
	if (!(error instanceof Error)) return false;
	const msg = error.message.toLowerCase();

	return (
		msg.includes('failed to fetch') ||
		msg.includes('service unavailable') ||
		msg.includes('bad gateway') ||
		msg.includes('network')
	);
};

type QueryProviderProps = {
	children: ReactNode;
};

export const QueryProvider = ({ children }: QueryProviderProps) => {
	const [isUnavailable, setIsUnavailable] = useState(false);

	const handleQueryError = (error: unknown) => {
		if (isServiceError(error)) setIsUnavailable(true);
	};

	const handleQuerySuccess = () => {
		setIsUnavailable((prev) => (prev ? false : prev));
	};

	const [queryClient] = useState(
		() =>
			new QueryClient({
				queryCache: new QueryCache({
					onError: handleQueryError,
					onSuccess: handleQuerySuccess,
				}),
				defaultOptions: {
					queries: {
						staleTime: 2 * 60 * 1000,
						gcTime: 10 * 60 * 1000,
					},
				},
			}),
	);

	return (
		<ServiceStatusContext.Provider value={isUnavailable}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</ServiceStatusContext.Provider>
	);
};
