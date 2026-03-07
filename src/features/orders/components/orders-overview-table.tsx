import { useState, Fragment } from 'react';
import { useNavigate } from 'react-router';
import { Table, Badge, Text, cn } from '@artifact-ui/core';
import { getProgressColor } from '@/features/batches/batch-utils';
import { StatusBadge } from './status-badge';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import { formatDate } from '@/utils/format';
import { ChevronDownIcon } from '@/components/icons/icons';
import { OrderItemsExpanded } from './order-items-expanded/order-items-expanded';
import shared from '@/styles/shared.module.css';
import type { OrderWithItems } from '@/types/api';

type OrdersOverviewTableProps = {
	orders: OrderWithItems[];
};

export const OrdersOverviewTable = ({ orders }: OrdersOverviewTableProps) => {
	const navigate = useNavigate();
	const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());
	const { sortedData, sortKey, sortDirection, toggleSort } =
		useSortableTable(orders, {
			defaultKey: 'due_date',
			defaultDirection: 'asc',
			storageKey: 'orders-overview',
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
						className="w-1/5"
					/>
					<SortableHeader
						label="Due"
						sortKey="due_date"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-32"
					/>
					<SortableHeader
						label="Progress"
						sortKey="item_count"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-28"
					/>
					<Table.HeaderCell><Text size="2" weight="medium" color="secondary">Status</Text></Table.HeaderCell>
					<Table.HeaderCell><Text size="2" weight="medium" color="secondary">Batch</Text></Table.HeaderCell>
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
								<Table.Cell>{order.order_number}</Table.Cell>
								<Table.Cell>{order.customer_name}</Table.Cell>
								<Table.Cell>{order.due_date ? formatDate(order.due_date) : '—'}</Table.Cell>
								<Table.Cell>
									<Badge
										size="1"
										variant="soft"
										color={getProgressColor(order.items_completed, order.item_count)}
									>
										{order.items_completed}/{order.item_count}
									</Badge>
								</Table.Cell>
								<Table.Cell>
									<StatusBadge name={order.workflow_stage_name} color={order.workflow_stage_color} />
								</Table.Cell>
								<Table.Cell>
									{order.batch_name && order.batch_id ? (
										<Badge
											size="1"
											variant="soft"
											className="cursor-pointer"
											onClick={(e) => {
												e.stopPropagation();
												navigate(`/batches/${order.batch_id}`);
											}}
										>
											{order.batch_name}
										</Badge>
									) : (
										'—'
									)}
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
								<OrderItemsExpanded items={order.items} colSpan={7} />
							)}
						</Fragment>
					);
				})}
			</Table.Body>
		</Table.Root>
	);
};
