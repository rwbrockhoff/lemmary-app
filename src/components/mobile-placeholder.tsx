import { Flex, Heading, Stack, Text } from '@artifact-ui/core';
import { LogoIcon } from './icons';
import sharedStyles from '@/styles/shared.module.css';
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
				<a href="https://lemmary.com" className={sharedStyles.buttonLink}>
					Back to Home Page
				</a>
			</Stack>
		</Flex>
	);
};
