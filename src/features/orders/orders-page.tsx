import {
	Heading,
	Text,
	Button,
	Tabs,
	Stack,
	Flex,
	DropdownMenu,
} from '@artifact-ui/core';
import { useNavigate } from 'react-router';
import { TabCount } from '@/components/tab-count';
import {
	RefreshIcon,
	OrdersIcon,
	InboxIcon,
	PlusIcon,
	CustomersIcon,
	WarehouseIcon,
	StorefrontIcon,
} from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { EmptyState } from '@/components/empty-state/empty-state';
import { useStore } from '@/features/settings/api/store-queries';
import { useOrdersWithItems, useSyncOrders } from './api/orders-queries';
import { OrdersOverviewTable } from './components/orders-overview-table';
import { CompletedOrdersTable } from './components/completed-orders-table';
import { WorkOrdersTable } from './components/work-orders-table';
import { OrdersSummary } from './components/orders-summary';
import { formatRelativeTime } from '@/utils/format';
import { getDueUrgency } from '@/utils/orders';
import shared from '@/styles/shared.module.css';

const OrdersPage = () => {
	const navigate = useNavigate();
	const { data, isLoading, error } = useOrdersWithItems();
	const { data: store } = useStore();
	const syncMutation = useSyncOrders();

	const orders = data?.orders;
	const lastSyncedAt = data?.lastSyncedAt;

	// Work orders are internal production
	// filtered out of the customer tabs and summary
	const customerOrders = orders?.filter((o) => o.order_type !== 'work') ?? [];
	const workOrders = orders?.filter((o) => o.order_type === 'work') ?? [];

	const overdueOrders = customerOrders.filter(
		(o) => getDueUrgency(o.due_date) === 'overdue',
	);

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
					<DropdownMenu.DropdownMenu>
						<DropdownMenu.DropdownMenuTrigger asChild>
							<Button variant="secondary" iconLeft={<PlusIcon size={16} />}>
								New
							</Button>
						</DropdownMenu.DropdownMenuTrigger>
						<DropdownMenu.DropdownMenuContent align="end" size="1">
							<DropdownMenu.DropdownMenuItem
								onClick={() => navigate('/orders/custom/new')}>
								<CustomersIcon size={16} />
								Custom order
							</DropdownMenu.DropdownMenuItem>
							<DropdownMenu.DropdownMenuItem onClick={() => navigate('/orders/work/new')}>
								<WarehouseIcon size={16} />
								Work order
							</DropdownMenu.DropdownMenuItem>
						</DropdownMenu.DropdownMenuContent>
					</DropdownMenu.DropdownMenu>
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
					store && !store.connected ? (
						<EmptyState
							icon={<StorefrontIcon size={20} />}
							title="Connect your store"
							description="Link your store to start pulling in orders."
							action={{
								label: 'Connect store',
								onClick: () => navigate('/connect-store'),
							}}
						/>
					) : (
						<EmptyState
							icon={<InboxIcon size={20} />}
							title="No orders yet"
							description="Click 'Sync Orders' to pull orders from your store."
						/>
					)
				}>
				{data?.metricSummary && <OrdersSummary metrics={data.metricSummary} />}

				{orders && orders.length > 0 && (
					<Tabs.Root defaultValue="overview">
						<Tabs.List>
							<Tabs.Trigger value="overview">
								<span className="flex items-center gap-2">
									Open Orders
									<TabCount count={customerOrders.length} />
								</span>
							</Tabs.Trigger>
							{overdueOrders.length > 0 && (
								<Tabs.Trigger value="overdue">
									<span className="flex items-center gap-2">
										Overdue
										<TabCount count={overdueOrders.length} color="danger" />
									</span>
								</Tabs.Trigger>
							)}
							<Tabs.Trigger value="work">
								<span className="flex items-center gap-2">
									Work Orders
									<TabCount count={workOrders.length} />
								</span>
							</Tabs.Trigger>
							<Tabs.Trigger value="completed">Completed</Tabs.Trigger>
						</Tabs.List>

						<Tabs.Content value="overview">
							<OrdersOverviewTable orders={customerOrders} />
						</Tabs.Content>

						{overdueOrders.length > 0 && (
							<Tabs.Content value="overdue">
								<OrdersOverviewTable orders={overdueOrders} />
							</Tabs.Content>
						)}

						<Tabs.Content value="work">
							<WorkOrdersTable orders={workOrders} />
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
