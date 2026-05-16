import { Card, Heading, Text, Flex } from '@artifact-ui/core';
import { CouponIcon } from '@/components/icons';
import { DeltaIndicator } from '@/components/delta-indicator/delta-indicator';
import type { CouponUsage } from '../api/performance-queries';
import styles from './coupon-usage-card.module.css';

type CouponUsageCardProps = {
	usage: CouponUsage;
};

export const CouponUsageCard = ({ usage }: CouponUsageCardProps) => {
	const {
		withPromoCount,
		totalCount,
		avgDiscount,
		priorWithPromoCount,
		priorTotalCount,
	} = usage;

	if (totalCount === 0) {
		return (
			<Card.Root>
				<div className={styles.container}>
					<Flex align="center" gap="2" className={styles.heading}>
						<CouponIcon size={18} />
						<Heading size="5">Coupon Usage</Heading>
					</Flex>
					<Text className={styles.empty} size="2">
						No orders in this period yet.
					</Text>
				</div>
			</Card.Root>
		);
	}

	const withPromoPct = Math.round((withPromoCount / totalCount) * 100);
	const noPromoPct = 100 - withPromoPct;

	const priorPct =
		priorTotalCount > 0
			? Math.round((priorWithPromoCount / priorTotalCount) * 100)
			: null;
	const delta = priorPct !== null ? withPromoPct - priorPct : 0;

	return (
		<Card.Root>
			<div className={styles.container}>
				<Flex align="center" gap="2" className={styles.heading}>
					<CouponIcon size={18} />
					<Heading size="5">Coupon Usage</Heading>
				</Flex>
				<div className={styles.body}>
					<div className={styles.bar}>
						<div className={styles.noPromo} style={{ height: `${noPromoPct}%` }} />
						<div
							className={styles.withPromo}
							style={{ height: `${withPromoPct}%` }}
						/>
					</div>
					<div className={styles.stats}>
						<div className={styles.bigNumber}>{withPromoPct}%</div>
						<div className={styles.label}>Orders with promo code</div>
						{avgDiscount > 0 && (
							<div className={styles.subtitle}>
								${avgDiscount.toFixed(2)} avg discount
							</div>
						)}
						<div className={styles.deltaSlot}>
							<DeltaIndicator delta={delta} />
						</div>
					</div>
				</div>
			</div>
		</Card.Root>
	);
};
