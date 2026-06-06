import { Heading, Text, Button, Tabs, Stack, Flex } from '@artifact-ui/core';
import { Link } from 'react-router';
import { RefreshIcon, OrdersIcon, InboxIcon, PlusIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { EmptyState } from '@/components/empty-state/empty-state';
import { useOrdersWithItems, useSyncOrders } from './api/orders-queries';
import { OrdersTable } from './components/orders-table';
import { OrdersOverviewTable } from './components/orders-overview-table';
import { CompletedOrdersTable } from './components/completed-orders-table';
import { OrdersSummary } from './components/orders-summary';
import { formatRelativeTime } from '@/utils/format';
import shared from '@/styles/shared.module.css';

const OrdersPage = () => {
	const { data, isLoading, error } = useOrdersWithItems();
	const syncMutation = useSyncOrders();

	const orders = data?.orders;
	const lastSyncedAt = data?.lastSyncedAt;

	const pendingOrders = orders?.filter((o) => o.fulfillment_status === 'pending');

	return (
		<div className={shared.pageContainer}>
			<Flex justify="between" align="center" className="mb-6">
				<Stack gap="1">
					<Heading size="6" iconLeft={<OrdersIcon size={20} />}>
						Orders
					</Heading>
					{lastSyncedAt && (
						<Text size="1" color="secondary">
							Last synced {formatRelativeTime(lastSyncedAt)}
						</Text>
					)}
				</Stack>
				<Flex gap="2">
					<Button asChild variant="secondary" iconLeft={<PlusIcon size={16} />}>
						<Link to="/orders/custom/new">New Order</Link>
					</Button>
					<Button
						onClick={() => syncMutation.mutate()}
						disabled={syncMutation.isPending}
						variant="default"
						iconLeft={<RefreshIcon size={16} />}>
						{syncMutation.isPending ? 'Syncing...' : 'Sync Orders'}
					</Button>
				</Flex>
			</Flex>

			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error}
				errorState={<ErrorState description="Failed to load orders. Try again later." />}
				isEmpty={orders?.length === 0}
				emptyState={
					<EmptyState
						icon={<InboxIcon size={20} />}
						title="No orders yet"
						description="Click 'Sync Orders' to pull orders from your store."
					/>
				}>
				{pendingOrders && pendingOrders.length > 0 && (
					<OrdersSummary orders={pendingOrders} />
				)}

				{orders && orders.length > 0 && (
					<Tabs.Root defaultValue="overview">
						<Tabs.List>
							<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
							<Tabs.Trigger value="orders">Order Details</Tabs.Trigger>
							<Tabs.Trigger value="completed">Completed</Tabs.Trigger>
						</Tabs.List>

						<Tabs.Content value="overview">
							<OrdersOverviewTable orders={pendingOrders ?? []} />
						</Tabs.Content>

						<Tabs.Content value="orders">
							<OrdersTable orders={orders ?? []} />
						</Tabs.Content>

						<Tabs.Content value="completed">
							<CompletedOrdersTable />
						</Tabs.Content>
					</Tabs.Root>
				)}
			</LoadingWrapper>
		</div>
	);
};

export default OrdersPage;
