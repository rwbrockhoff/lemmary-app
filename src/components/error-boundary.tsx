import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button, Heading, Text } from '@artifact-ui/core';

type ErrorBoundaryProps = {
	children: ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
};

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): ErrorBoundaryState {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
	}

	handleReset = () => {
		this.setState({ hasError: false });
		window.location.href = '/';
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
					<Heading size="5">Something went wrong</Heading>
					<Text color="secondary">
						An unexpected error occurred. Please try again.
					</Text>
					<Button onClick={this.handleReset}>Back to Home</Button>
				</div>
			);
		}

		return this.props.children;
	}
}
