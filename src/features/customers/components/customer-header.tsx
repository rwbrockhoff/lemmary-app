import { Heading, Text } from '@artifact-ui/core';
import { CustomerTierBadge } from './customer-tier-badge';
import { formatCurrencyShort, formatDate } from '@/utils/format';
import type { CustomerDetail } from '@/types/api';
import styles from './customer-header.module.css';

type CustomerHeaderProps = {
	customer: CustomerDetail;
};

export const CustomerHeader = ({ customer }: CustomerHeaderProps) => {
	const lifetimeSpend = Number(customer.lifetimeSpend);
	const avgOrderValue = customer.orderCount > 0 ? lifetimeSpend / customer.orderCount : 0;

	return (
		<div className={styles.header}>
			<div className={styles.identity}>
				<Heading size="6">{customer.name}</Heading>
				<CustomerTierBadge tier={customer.tier} />
			</div>
			<Text size="2" color="secondary">
				{customer.email}
			</Text>

			<div className={styles.stats}>
				<div className={styles.stat}>
					<Text size="2" color="secondary">
						Total orders
					</Text>
					<Text size="4" weight="medium">
						{customer.orderCount}
					</Text>
				</div>
				<div className={styles.stat}>
					<Text size="2" color="secondary">
						Lifetime spend
					</Text>
					<Text size="4" weight="medium">
						{formatCurrencyShort(lifetimeSpend)}
					</Text>
				</div>
				<div className={styles.stat}>
					<Text size="2" color="secondary">
						Avg order
					</Text>
					<Text size="4" weight="medium">
						{formatCurrencyShort(avgOrderValue)}
					</Text>
				</div>
				<div className={styles.stat}>
					<Text size="2" color="secondary">
						Customer since
					</Text>
					<Text size="4" weight="medium">
						{formatDate(customer.firstOrderDate)}
					</Text>
				</div>
			</div>
		</div>
	);
};
