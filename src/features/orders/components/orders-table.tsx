import { useNavigate } from 'react-router';
import { Table, Badge } from '@artifact-ui/core';
import { getProgressColor } from '@/features/batches/batch-utils';
import { StatusBadge } from './status-badge';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import { formatDate } from '@/utils/format';
import type { Order } from '@/types/api';

type OrdersTableProps = {
	orders: Order[];
};

export const OrdersTable = ({ orders }: OrdersTableProps) => {
	const navigate = useNavigate();
	const { sortedData, sortKey, sortDirection, toggleSort } =
		useSortableTable(orders, {
			defaultKey: 'order_date',
			defaultDirection: 'desc',
		});

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
						className="w-24"
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
						className="w-32"
					/>
					<SortableHeader
						label="Due"
						sortKey="due_date"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-32"
					/>
					<Table.HeaderCell>Progress</Table.HeaderCell>
					<Table.HeaderCell>Status</Table.HeaderCell>
					<SortableHeader
						label="Items"
						sortKey="item_count"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					</Table.Row>
			</Table.Header>
			<Table.Body>
				{sortedData.map((order) => (
					<Table.Row
						key={order.id}
						className="cursor-pointer"
						onClick={() => navigate(`/orders/${order.id}`)}
					>
						<Table.Cell>{order.order_number}</Table.Cell>
						<Table.Cell>{order.customer_name}</Table.Cell>
						<Table.Cell>{formatDate(order.order_date)}</Table.Cell>
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
						<Table.Cell textAlign="center">{order.item_count}</Table.Cell>
						</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
};
