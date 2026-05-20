import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Flex, Heading, Stack, Text } from '@artifact-ui/core';
import sharedStyles from '@/styles/shared.module.css';
import styles from './error-boundary.module.css';

type ErrorBoundaryProps = {
	children: ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
};

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
	}

	render() {
		if (this.state.hasError) {
			return (
				<Flex align="center" justify="center" className={styles.container}>
					<Stack align="center" gap="4" className={styles.content}>
						<Heading size="5">Something went wrong</Heading>
						<Text color="secondary">An unexpected error occurred. Please try again.</Text>
						<a href="/" className={sharedStyles.buttonLink}>
							Back to Home
						</a>
					</Stack>
				</Flex>
			);
		}

		return this.props.children;
	}
}
