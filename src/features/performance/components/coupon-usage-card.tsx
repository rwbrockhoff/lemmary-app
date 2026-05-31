import { CouponIcon } from '@/components/icons';
import { KpiBarCard } from '@/components/kpi-bar-card/kpi-bar-card';
import type { CouponUsage } from '../api/performance-queries';

type CouponUsageCardProps = {
	usage: CouponUsage;
};

export const CouponUsageCard = ({ usage }: CouponUsageCardProps) => {
	const { withPromoCount, totalCount, avgDiscount, priorWithPromoCount, priorTotalCount } =
		usage;

	const withPromoPct =
		totalCount > 0 ? Math.round((withPromoCount / totalCount) * 100) : 0;
	const priorPct =
		priorTotalCount > 0
			? Math.round((priorWithPromoCount / priorTotalCount) * 100)
			: null;
	const delta = priorPct !== null ? withPromoPct - priorPct : 0;

	return (
		<KpiBarCard
			title="Coupon Usage"
			icon={<CouponIcon size={18} />}
			percentage={withPromoPct}
			label="Orders with promo code"
			delta={delta}
			barColor="var(--wf-stage-color-marigold)"
			footer={avgDiscount > 0 ? `$${avgDiscount.toFixed(2)} avg discount` : undefined}
			isEmpty={totalCount === 0}
			emptyMessage="No orders in this period yet"
			emptySubtext="Coupon usage appears as orders come in."
		/>
	);
};
