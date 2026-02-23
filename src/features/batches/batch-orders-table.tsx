import { useNavigate } from 'react-router';
import { Table, Checkbox, Badge, cn } from '@artifact-ui/core';
import { getProgressColor } from './batch-utils';
import styles from '@/styles/shared.module.css';
import { formatDate, formatCurrency } from '@/utils/format';
import type { BatchOrder, BatchOrderItem } from '@/types/api';

type BatchOrdersTableProps = {
	batchId: string;
	orders: BatchOrder[];
	orderItems: BatchOrderItem[];
	onToggle: (id: string, completed: boolean) => void;
};

export const BatchOrdersTable = ({
	batchId,
	orders,
	orderItems,
	onToggle,
}: BatchOrdersTableProps) => {
	const navigate = useNavigate();

	return (
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell className="w-10" />
					<Table.HeaderCell className="w-24">Order #</Table.HeaderCell>
					<Table.HeaderCell>Customer</Table.HeaderCell>
					<Table.HeaderCell>Date</Table.HeaderCell>
					<Table.HeaderCell style={{ textAlign: 'right' }}>Total</Table.HeaderCell>
					<Table.HeaderCell style={{ textAlign: 'center' }}>Progress</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{orders.map((order) => {
					const items = orderItems.filter(
						(i) => i.batch_order_id === order.id,
					);
					const completed = items.reduce(
						(sum, i) => sum + i.completed_qty,
						0,
					);
					const total = items.reduce(
						(sum, i) => sum + i.quantity,
						0,
					);

					return (
						<Table.Row
							key={order.id}
							className={cn('cursor-pointer', order.completed && styles.completedRow)}
							onClick={() =>
								navigate(
									`/batches/${batchId}/orders/${order.id}`,
								)
							}
						>
							<Table.Cell onClick={(e) => e.stopPropagation()}>
								<Checkbox
									checked={order.completed}
									onCheckedChange={() =>
										onToggle(order.id, !order.completed)
									}
								/>
							</Table.Cell>
							<Table.Cell>{order.order_number}</Table.Cell>
							<Table.Cell>{order.customer_name}</Table.Cell>
							<Table.Cell>
								{formatDate(order.order_date)}
							</Table.Cell>
							<Table.Cell textAlign="end">
								{formatCurrency(order.grand_total)}
							</Table.Cell>
							<Table.Cell textAlign="center">
								<Badge
									size="1"
									variant="soft"
									color={getProgressColor(completed, total)}
								>
									{completed}/{total}
								</Badge>
							</Table.Cell>
						</Table.Row>
					);
				})}
			</Table.Body>
		</Table.Root>
	);
};
