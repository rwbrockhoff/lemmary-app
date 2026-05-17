import { Grid } from '@artifact-ui/core';
import { formatCurrencyShort } from '@/utils/format';
import { StatCard } from './stat-card';
import type { Order } from '@/types/api';

type OrdersSummaryProps = {
	orders: Order[];
};

export const OrdersSummary = ({ orders }: OrdersSummaryProps) => {
	const totalItems = orders.reduce((sum, o) => sum + o.item_count, 0);
	const totalRevenue = orders.reduce((sum, o) => sum + Number(o.grand_total ?? 0), 0);

	return (
		<Grid columns={3} gap="4" className="mb-6">
			<StatCard label="Open Orders" value={orders.length} />
			<StatCard label="Total Items" value={totalItems} />
			<StatCard label="Revenue" value={formatCurrencyShort(totalRevenue)} />
		</Grid>
	);
};
