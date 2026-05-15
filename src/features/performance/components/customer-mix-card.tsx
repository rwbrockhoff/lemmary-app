import { Card, Heading, Text, Flex } from '@artifact-ui/core';
import { CustomersIcon } from '@/components/icons';
import { DeltaIndicator } from '@/components/delta-indicator/delta-indicator';
import type { CustomerMix } from '../api/performance-queries';
import styles from './customer-mix-card.module.css';

type CustomerMixCardProps = {
	mix: CustomerMix;
};

export const CustomerMixCard = ({ mix }: CustomerMixCardProps) => {
	const {
		returningCount,
		totalCount,
		priorReturningCount,
		priorTotalCount,
	} = mix;

	if (totalCount === 0) {
		return (
			<Card.Root>
				<div className={styles.container}>
					<Flex align="center" gap="2" className={styles.heading}>
						<CustomersIcon size={18} />
						<Heading size="5">Customer Mix</Heading>
					</Flex>
					<Text className={styles.empty} size="2">
						No customers in this period yet.
					</Text>
				</div>
			</Card.Root>
		);
	}

	const returningPct = Math.round((returningCount / totalCount) * 100);
	const newPct = 100 - returningPct;

	const priorReturningPct =
		priorTotalCount > 0
			? Math.round((priorReturningCount / priorTotalCount) * 100)
			: null;
	const delta = priorReturningPct !== null ? returningPct - priorReturningPct : 0;

	return (
		<Card.Root>
			<div className={styles.container}>
				<Flex align="center" gap="2" className={styles.heading}>
					<CustomersIcon size={18} />
					<Heading size="5">Customer Mix</Heading>
				</Flex>
				<div className={styles.body}>
					<div className={styles.bar}>
						<div className={styles.new} style={{ height: `${newPct}%` }} />
						<div
							className={styles.returning}
							style={{ height: `${returningPct}%` }}
						/>
					</div>
					<div className={styles.stats}>
						<div className={styles.bigNumber}>{returningPct}%</div>
						<div className={styles.label}>Returning customers</div>
						<div className={styles.deltaSlot}>
							<DeltaIndicator delta={delta} />
						</div>
					</div>
				</div>
			</div>
		</Card.Root>
	);
};
