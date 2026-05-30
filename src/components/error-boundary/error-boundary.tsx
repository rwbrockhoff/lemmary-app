import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Sentry } from '@/utils/sentry';
import { ErrorFallback } from './error-fallback';

type ErrorBoundaryProps = {
	children: ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
};

// Outer backstop for errors that happen outside the router

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
		Sentry.captureException(error, {
			extra: { componentStack: errorInfo.componentStack },
		});
	}

	render() {
		if (this.state.hasError) return <ErrorFallback />;
		return this.props.children;
	}
}
