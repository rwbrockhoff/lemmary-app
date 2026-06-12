import { Button, Flex, Heading, Stack, Text } from '@artifact-ui/core';
import styles from './error-boundary.module.css';

export const ErrorFallback = () => {
	return (
		<Flex align="center" justify="center" className={styles.container}>
			<Stack align="center" gap="4" className={styles.content}>
				<Heading size="5">Something went wrong</Heading>
				<Text color="secondary">An unexpected error occurred. Please try again.</Text>
				<Button asChild>
					<a href="/">Back to Home</a>
				</Button>
			</Stack>
		</Flex>
	);
};
