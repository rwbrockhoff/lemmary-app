import { Heading, Text, Button } from '@artifact-ui/core';
import { RefreshIcon, OrdersIcon } from '@/components/icons';
import { useOrders, useSyncOrders } from './api/orders-queries';
import { OrdersTable } from './components/orders-table';
import { OrdersSummary } from './components/orders-summary';
import { formatRelativeTime } from '@/utils/format';

const OrdersPage = () => {
	const { data, isLoading, error } = useOrders();
	const syncMutation = useSyncOrders();

	const orders = data?.orders;
	const lastSyncedAt = data?.lastSyncedAt;

	const pendingOrders = orders?.filter(
		(o) => o.fulfillment_status === 'pending',
	);

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<div className="flex flex-col gap-1">
					<Heading size="6" iconLeft={<OrdersIcon size={20} />}>Orders</Heading>
					{lastSyncedAt && (
						<Text size="1" color="secondary">
							Last synced {formatRelativeTime(lastSyncedAt)}
						</Text>
					)}
				</div>
				<Button
					onClick={() => syncMutation.mutate()}
					disabled={syncMutation.isPending}
					variant="default"
					iconLeft={<RefreshIcon size={16} />}
				>
					{syncMutation.isPending ? 'Syncing...' : 'Sync Orders'}
				</Button>
			</div>

			{pendingOrders && pendingOrders.length > 0 && (
				<OrdersSummary orders={pendingOrders} />
			)}

			{isLoading && <Text color="secondary">Loading orders...</Text>}

			{error && (
				<Text color="danger">Failed to load orders. Is the API running?</Text>
			)}

			{orders && orders.length === 0 && (
				<Text color="secondary">
					No orders yet. Click "Sync Orders" to pull from Squarespace.
				</Text>
			)}

			{orders && orders.length > 0 && <OrdersTable orders={orders} />}
		</div>
	);
};

export default OrdersPage;
