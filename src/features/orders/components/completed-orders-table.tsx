import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Table, Text, Button, Flex, cn } from '@artifact-ui/core';
import shared from '@/styles/shared.module.css';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import { useCompletedOrders } from '../api/orders-queries';
import { formatDate, formatCurrency } from '@/utils/format';
import { ExternalLinkIcon } from '@/components/icons/icons';
import { CustomerNameWithNotes } from '@/components/customer-name-with-notes/customer-name-with-notes';
import { OrderNumberLabel } from '@/components/orders/order-number-label';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';

export const CompletedOrdersTable = () => {
	const navigate = useNavigate();
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useCompletedOrders();

	const orders = useMemo(() => data?.pages.flatMap((page) => page.orders) ?? [], [data]);

	const { sortedData, sortKey, sortDirection, toggleSort } = useSortableTable(orders, {
		defaultKey: 'fulfilled_on',
		defaultDirection: 'desc',
		storageKey: 'orders-completed',
	});

	return (
		<LoadingWrapper
			isLoading={isLoading}
			skeleton={<PageSpinner />}
			isEmpty={orders.length === 0}
			emptyState={<Text color="secondary">No completed orders.</Text>}>
			<Table.Root variant="surface" size="2">
				<Table.Header>
					<Table.Row>
						<SortableHeader
							label="Order"
							sortKey="order_number"
							activeSortKey={sortKey}
							sortDirection={sortDirection}
							onSort={toggleSort}
							className="w-20"
						/>
						<SortableHeader
							label="Customer"
							sortKey="customer_name"
							activeSortKey={sortKey}
							sortDirection={sortDirection}
							onSort={toggleSort}
							className="w-1/5"
						/>
						<SortableHeader
							label="Ordered"
							sortKey="order_date"
							activeSortKey={sortKey}
							sortDirection={sortDirection}
							onSort={toggleSort}
						/>
						<SortableHeader
							label="Fulfilled"
							sortKey="fulfilled_on"
							activeSortKey={sortKey}
							sortDirection={sortDirection}
							onSort={toggleSort}
						/>
						<SortableHeader
							label="Items"
							sortKey="item_count"
							activeSortKey={sortKey}
							sortDirection={sortDirection}
							onSort={toggleSort}
							className="w-16"
						/>
						<SortableHeader
							label="Total"
							sortKey="grand_total"
							activeSortKey={sortKey}
							sortDirection={sortDirection}
							onSort={toggleSort}
							align="end"
						/>
						<Table.HeaderCell className="text-end">
							<Text size="2" weight="medium" color="secondary">
								Tracking
							</Text>
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{sortedData.map((order) => (
						<Table.Row
							key={order.id}
							className="cursor-pointer"
							onClick={() => navigate(`/orders/${order.id}`)}>
							<Table.Cell>
								<OrderNumberLabel
									orderNumber={order.order_number}
									orderType={order.order_type}
								/>
							</Table.Cell>
							<Table.Cell>
								<CustomerNameWithNotes
									name={order.customer_name}
									hasNotes={Boolean(order.order_notes)}
								/>
							</Table.Cell>
							<Table.Cell>{formatDate(order.order_date)}</Table.Cell>
							<Table.Cell>
								{order.fulfilled_on ? formatDate(order.fulfilled_on) : '—'}
							</Table.Cell>
							<Table.Cell>{order.item_count}</Table.Cell>
							<Table.Cell className="text-end">
								{order.grand_total ? formatCurrency(order.grand_total) : '—'}
							</Table.Cell>
							<Table.Cell textAlign="end">
								{order.tracking_url ? (
									<a
										href={order.tracking_url}
										target="_blank"
										rel="noopener noreferrer"
										onClick={(e) => e.stopPropagation()}
										className={cn(
											shared.brandLink,
											'inline-flex items-center gap-1 justify-end',
										)}>
										{order.carrier_name ?? 'Track'}
										<ExternalLinkIcon size={14} />
									</a>
								) : (
									'—'
								)}
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
			{hasNextPage && (
				<Flex justify="center" className="pt-4">
					<Button
						variant="outline"
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}>
						{isFetchingNextPage ? 'Loading...' : 'Load More'}
					</Button>
				</Flex>
			)}
		</LoadingWrapper>
	);
};
