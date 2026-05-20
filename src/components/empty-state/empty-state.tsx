import type { ReactNode } from 'react';
import { Button, Heading, Stack, Text } from '@artifact-ui/core';
import styles from './empty-state.module.css';

type EmptyStateProps = {
	icon: ReactNode;
	title: string;
	description?: string;
	action?: {
		label: string;
		onClick: () => void;
	};
};

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
	return (
		<Stack align="center" gap="3" className={styles.container}>
			<Heading size="4" iconLeft={icon}>
				{title}
			</Heading>
			{description && (
				<Text color="secondary" size="2">
					{description}
				</Text>
			)}
			{action && (
				<Button onClick={action.onClick} size="2">
					{action.label}
				</Button>
			)}
		</Stack>
	);
};
