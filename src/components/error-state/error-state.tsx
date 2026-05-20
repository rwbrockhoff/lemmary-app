import { Button, Heading, Stack, Text } from '@artifact-ui/core';
import { ErrorIcon, RefreshIcon } from '@/components/icons';
import styles from './error-state.module.css';

type ErrorStateProps = {
	title?: string;
	description?: string;
	onRetry?: () => void;
	retryLabel?: string;
};

export const ErrorState = ({
	title = 'Something went wrong',
	description = 'There was an error loading this data.',
	onRetry,
	retryLabel = 'Try Again',
}: ErrorStateProps) => {
	return (
		<Stack align="center" gap="3" className={styles.container}>
			<Heading size="4" iconLeft={<ErrorIcon size={20} />} color="danger">
				{title}
			</Heading>
			<Text color="secondary" size="2">
				{description}
			</Text>
			{onRetry && (
				<Button
					onClick={onRetry}
					variant="outline"
					size="2"
					iconLeft={<RefreshIcon size={16} />}>
					{retryLabel}
				</Button>
			)}
		</Stack>
	);
};
