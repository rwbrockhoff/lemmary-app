import { Button, Flex, Heading, Stack, Text } from '@artifact-ui/core';
import { LogoIcon } from '../icons';
import styles from './mobile-placeholder.module.css';

export const MobilePlaceholder = () => {
	return (
		<Flex align="center" justify="center" className={styles.container}>
			<Stack align="center" gap="6" className={styles.content}>
				<Flex align="center" gap="3">
					<LogoIcon size={40} />
					<Heading size="8">Lemmary</Heading>
				</Flex>
				<Text size="5" color="secondary">
					This dashboard is optimized for desktop. Please visit on a larger screen.
				</Text>
				<Button asChild>
					<a href="https://lemmary.com">Back to Home Page</a>
				</Button>
			</Stack>
		</Flex>
	);
};
