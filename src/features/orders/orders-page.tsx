import { Heading, Text, Button } from '@artifact-ui/core';
import { RefreshIcon } from '@/components/icons';
import { useOrders, useSyncOrders } from './orders-queries';
import { OrdersTable } from './orders-table';

const OrdersPage = () => {
	const { data: orders, isLoading, error } = useOrders();
	const syncMutation = useSyncOrders();

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<Heading size="6">Orders</Heading>
				<Button
					onClick={() => syncMutation.mutate()}
					disabled={syncMutation.isPending}
					variant="default"
					iconLeft={<RefreshIcon size={16} />}
				>
					{syncMutation.isPending ? 'Syncing...' : 'Sync Orders'}
				</Button>
			</div>

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
