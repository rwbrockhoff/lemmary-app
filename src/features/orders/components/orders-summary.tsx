import { Grid } from '@artifact-ui/core';
import { formatCurrencyShort } from '@/utils/format';
import { StatCard } from './stat-card';
import type { OrderMetrics } from '@/types/api';

type OrdersSummaryProps = {
	metrics: OrderMetrics;
};

export const OrdersSummary = ({ metrics }: OrdersSummaryProps) => {
	return (
		<Grid columns={3} gap="4" className="mb-6">
			<StatCard label="Orders Due This Week" value={metrics.dueThisWeek} />
			<StatCard label="Items to Make" value={metrics.totalItems} />
			<StatCard label="Open Revenue" value={formatCurrencyShort(metrics.revenue)} />
		</Grid>
	);
};
