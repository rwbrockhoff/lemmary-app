import { Flex, Heading, Stack, Text } from '@artifact-ui/core';
import sharedStyles from '@/styles/shared.module.css';
import styles from './error-boundary.module.css';

export const ErrorFallback = () => {
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
};
