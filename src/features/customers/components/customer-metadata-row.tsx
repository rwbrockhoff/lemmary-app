import { Link } from 'react-router';
import { Text, Flex } from '@artifact-ui/core';
import { CustomerTierBadge } from './customer-tier-badge';
import type { CustomerTier } from '@/types/api';
import styles from './customer-metadata-row.module.css';

type CustomerMetadataRowProps = {
	name: string;
	email: string | null;
	tier: CustomerTier | null;
	fromOrderId?: string;
};

export const CustomerMetadataRow = ({
	name,
	email,
	tier,
	fromOrderId,
}: CustomerMetadataRowProps) => {
	const href = email
		? `/customers/${encodeURIComponent(email)}${
				fromOrderId ? `?from=order&orderId=${fromOrderId}` : ''
			}`
		: null;

	return (
		<Flex gap="4" align="center">
			<Text size="2" color="secondary" className={styles.label}>
				Customer
			</Text>
			{href ? (
				<Link to={href} className={styles.link}>
					{name}
				</Link>
			) : (
				<Text size="2">{name}</Text>
			)}
			{tier && <CustomerTierBadge tier={tier} />}
		</Flex>
	);
};
