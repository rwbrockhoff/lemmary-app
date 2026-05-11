import type { ReactNode } from 'react';
import { Card, Flex, Stack, Text } from '@artifact-ui/core';
import { BrandMark } from '@/components/brand-mark';
import styles from './auth-layout.module.css';

type AuthLayoutProps = {
	children: ReactNode;
};

export const AuthLayout = ({ children }: AuthLayoutProps) => {
	return (
		<Flex align="center" justify="center" className={styles.container}>
			<Stack align="center" gap="5">
				<Stack align="center" gap="1">
					<BrandMark size="lg" />
					<Text size="2" color="tertiary">
						Automated reporting for small businesses
					</Text>
				</Stack>
				<Card.Root size="3" className={styles.card}>
					<Card.Body>{children}</Card.Body>
				</Card.Root>
			</Stack>
		</Flex>
	);
};
