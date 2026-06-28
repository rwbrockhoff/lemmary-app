import { Table, Text } from '@artifact-ui/core';
import { OrderNumberLabel } from '@/components/orders/order-number-label';
import { formatDate, formatCurrency } from '@/utils/format';
import { useFormatDateTz } from '@/hooks/use-format-date-tz';
import type { CustomerOrder } from '@/types/api';

type CustomerOrdersRowProps = {
	order: CustomerOrder;
	onClick: () => void;
};

export const CustomerOrdersRow = ({ order, onClick }: CustomerOrdersRowProps) => {
	const formatTz = useFormatDateTz();
	return (
		<Table.Row className="cursor-pointer" onClick={onClick}>
			<Table.Cell>
				<OrderNumberLabel orderNumber={order.order_number} orderType={order.order_type} />
			</Table.Cell>
			<Table.Cell>{formatTz(order.order_date)}</Table.Cell>
			<Table.Cell>{order.due_date ? formatDate(order.due_date) : '—'}</Table.Cell>
			<Table.Cell>{order.item_count}</Table.Cell>
			<Table.Cell>{formatCurrency(order.grand_total)}</Table.Cell>
			<Table.Cell className="capitalize">{order.fulfillment_status}</Table.Cell>

			<Table.Cell className="truncate max-w-0">
				{order.order_notes ? (
					<Text size="2" title={order.order_notes}>
						{order.order_notes}
					</Text>
				) : (
					<Text size="2" color="secondary">
						—
					</Text>
				)}
			</Table.Cell>
		</Table.Row>
	);
};
