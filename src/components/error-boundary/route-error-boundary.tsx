import { useEffect } from 'react';
import { useRouteError } from 'react-router';
import { Sentry } from '@/utils/sentry';
import { ErrorFallback } from './error-fallback';

// Caught by React Router's data router when a route render throws
// Reports to Sentry and renders fallback UI

export const RouteErrorBoundary = () => {
	const error = useRouteError();

	useEffect(() => {
		if (error instanceof Error) {
			console.error('Route error:', error);
			Sentry.captureException(error);
		} else {
			console.error('Route error (non-Error):', error);
			Sentry.captureException(new Error(String(error)));
		}
	}, [error]);

	return <ErrorFallback />;
};
