import { Flex, Text } from '@artifact-ui/core';
import { ErrorIcon } from '@/components/icons';
import { useServiceStatus } from '@/providers/service-status-context';
import styles from './service-banner.module.css';

export const ServiceBanner = () => {
	const isUnavailable = useServiceStatus();

	if (!isUnavailable) return null;

	return (
		<Flex align="center" justify="center" gap="2" className={styles.banner}>
			<ErrorIcon size={16} />
			<Text size="2" weight="medium">
				Service temporarily unavailable. Some features may not work.
			</Text>
		</Flex>
	);
};
