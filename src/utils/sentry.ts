import * as Sentry from '@sentry/react';

let initialized = false;

export const initSentry = () => {
	if (initialized) return;

	// Only run in production
	if (!import.meta.env.PROD) return;

	const dsn = import.meta.env.VITE_SENTRY_DSN;
	if (!dsn) return;

	Sentry.init({
		dsn,
		environment: import.meta.env.MODE,
	});

	initialized = true;
};

export { Sentry };
