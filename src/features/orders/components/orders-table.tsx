import { useState, Fragment } from 'react';
import { useNavigate } from 'react-router';
import { Table, Text, Flex, cn } from '@artifact-ui/core';
import { ExternalLinkIcon, ChevronDownIcon } from '@/components/icons/icons';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import { formatDate, formatCurrency } from '@/utils/format';
import { OrderItemsExpanded } from './order-items-expanded/order-items-expanded';
import shared from '@/styles/shared.module.css';
import type { OrderWithItems } from '@/types/api';

type OrdersTableProps = {
	orders: OrderWithItems[];
};

export const OrdersTable = ({ orders }: OrdersTableProps) => {
	const navigate = useNavigate();
	const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());
	const { sortedData, sortKey, sortDirection, toggleSort } =
		useSortableTable(orders, {
			defaultKey: 'order_date',
			defaultDirection: 'desc',
			storageKey: 'orders',
		});

	const toggleExpand = (orderId: string) => {
		setExpandedOrderIds((prev) => {
			const next = new Set(prev);
			if (next.has(orderId)) {
				next.delete(orderId);
			} else {
				next.add(orderId);
			}
			return next;
		});
	};

	return (
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
						className="w-1/4"
					/>
					<SortableHeader
						label="Date"
						sortKey="order_date"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-36"
					/>
					<SortableHeader
						label="Due"
						sortKey="due_date"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-36"
					/>
					<SortableHeader
						label="Items"
						sortKey="item_count"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-14"
					/>
					<SortableHeader
						label="Total"
						sortKey="grand_total"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-28"
						align="end"
					/>
					<Table.HeaderCell className="w-14" />
					<Table.HeaderCell className="w-14" />
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sortedData.map((order) => {
					const isExpanded = expandedOrderIds.has(order.id);

					return (
						<Fragment key={order.id}>
							<Table.Row
								className="cursor-pointer"
								onClick={() => navigate(`/orders/${order.id}`)}
							>
								<Table.Cell><Text size="2" weight="medium">{order.order_number}</Text></Table.Cell>
								<Table.Cell>{order.customer_name}</Table.Cell>
								<Table.Cell>{formatDate(order.order_date)}</Table.Cell>
								<Table.Cell>{order.due_date ? formatDate(order.due_date) : '—'}</Table.Cell>
								<Table.Cell>{order.item_count}</Table.Cell>
								<Table.Cell className="text-end">
									{order.grand_total ? formatCurrency(order.grand_total) : '—'}
								</Table.Cell>
								<Table.Cell>
									<Flex justify="center">
										{order.order_url && (
											<a
												href={order.order_url}
												target="_blank"
												rel="noopener noreferrer"
												onClick={(e) => e.stopPropagation()}
												className="text-gray-400 hover:text-gray-600"
											>
												<ExternalLinkIcon size={14} />
											</a>
										)}
									</Flex>
								</Table.Cell>
								<Table.Cell>
									<button
										type="button"
										className="cursor-pointer p-1 rounded hover:bg-gray-100"
										onClick={(e) => {
											e.stopPropagation();
											toggleExpand(order.id);
										}}
									>
										<ChevronDownIcon
											size={16}
											className={cn(shared.expandIcon, isExpanded && shared.expandIconOpen)}
										/>
									</button>
								</Table.Cell>
							</Table.Row>
							{isExpanded && (
								<OrderItemsExpanded items={order.items} colSpan={8} />
							)}
						</Fragment>
					);
				})}
			</Table.Body>
		</Table.Root>
	);
};
