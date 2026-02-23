import { Table } from '@artifact-ui/core';
import { StatusBadge } from './status-badge';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import { formatDate, formatCurrency } from '@/utils/format';
import type { Order } from '@/types/api';

type OrdersTableProps = {
	orders: Order[];
};

export const OrdersTable = ({ orders }: OrdersTableProps) => {
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
						className="w-1/3"
					/>
					<SortableHeader
						label="Date"
						sortKey="order_date"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<Table.HeaderCell>Status</Table.HeaderCell>
					<SortableHeader
						label="Items"
						sortKey="item_count"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<SortableHeader
						label="Total"
						sortKey="grand_total"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						align="end"
					/>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sortedData.map((order) => (
					<Table.Row key={order.id}>
						<Table.Cell>{order.order_number}</Table.Cell>
						<Table.Cell>{order.customer_name}</Table.Cell>
						<Table.Cell>{formatDate(order.order_date)}</Table.Cell>
						<Table.Cell>
							<StatusBadge status={order.fulfillment_status} />
						</Table.Cell>
						<Table.Cell textAlign="center">{order.item_count}</Table.Cell>
						<Table.Cell textAlign="end">
							{formatCurrency(order.grand_total)}
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
};
