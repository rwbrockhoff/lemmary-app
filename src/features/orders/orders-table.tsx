import { Table } from '@artifact-ui/core';
import { StatusBadge } from './status-badge';
import { formatDate, formatCurrency } from '@/utils/format';
import type { Order } from '@/types/api';

type OrdersTableProps = {
	orders: Order[];
};

export const OrdersTable = ({ orders }: OrdersTableProps) => {
	return (
		<Table.Root variant="surface" size="2" highlight>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell className="w-24">Order</Table.HeaderCell>
					<Table.HeaderCell className="w-1/3">Customer</Table.HeaderCell>
					<Table.HeaderCell>Date</Table.HeaderCell>
					<Table.HeaderCell>Status</Table.HeaderCell>
					<Table.HeaderCell textAlign="center">Items</Table.HeaderCell>
					<Table.HeaderCell textAlign="end">Total</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{orders.map((order) => (
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
