import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Table, Checkbox, Badge, cn } from '@artifact-ui/core';
import { StatusBadge } from '@/features/orders/components/status-badge';
import { getProgressColor } from '../batch-utils';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import styles from '@/styles/shared.module.css';
import { formatDate, formatCurrency } from '@/utils/format';
import type { BatchOrder, BatchOrderItem } from '@/types/api';

type BatchOrdersTableProps = {
	batchId: string;
	orders: BatchOrder[];
	orderItems: BatchOrderItem[];
	onToggle: (id: string, completed: boolean) => void;
};

type OrderSortKey = Extract<keyof BatchOrder, string> | 'progress';

export const BatchOrdersTable = ({
	batchId,
	orders,
	orderItems,
	onToggle,
}: BatchOrdersTableProps) => {
	const navigate = useNavigate();

	const progressByOrder = useMemo(() => {
		const map = new Map<string, number>();
		for (const order of orders) {
			const items = orderItems.filter(
				(i) => i.batch_order_id === order.id,
			);
			const completed = items.filter((i) => i.is_complete).length;
			const total = items.length;
			map.set(order.id, total > 0 ? completed / total : 0);
		}
		return map;
	}, [orders, orderItems]);

	const { sortedData, sortKey, sortDirection, toggleSort } =
		useSortableTable<BatchOrder, OrderSortKey>(orders, {
			defaultKey: 'order_date',
			defaultDirection: 'asc',
			customSortFns: {
				progress: (a, b) =>
					(progressByOrder.get(a.id) ?? 0) -
					(progressByOrder.get(b.id) ?? 0),
			},
		});

	return (
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell className="w-10" />
					<SortableHeader<OrderSortKey>
						label="Order #"
						sortKey="order_number"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-28"
					/>
					<SortableHeader<OrderSortKey>
						label="Customer"
						sortKey="customer_name"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-1/4"
					/>
					<SortableHeader<OrderSortKey>
						label="Date"
						sortKey="order_date"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-32"
					/>
					<SortableHeader<OrderSortKey>
						label="Due"
						sortKey="due_date"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-32"
					/>
					<SortableHeader<OrderSortKey>
						label="Total"
						sortKey="grand_total"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						align="end"
					/>
					<Table.HeaderCell>Status</Table.HeaderCell>
					<SortableHeader<OrderSortKey>
						label="Progress"
						sortKey="progress"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						align="center"
					/>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sortedData.map((order) => {
					const items = orderItems.filter(
						(i) => i.batch_order_id === order.id,
					);
					const completed = items.filter((i) => i.is_complete).length;
					const total = items.length;

					return (
						<Table.Row
							key={order.id}
							className={cn('cursor-pointer', order.completed && styles.completedRow)}
							onClick={() =>
								navigate(`/orders/${order.order_id}?from=batch&batchId=${batchId}`)
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
							<Table.Cell>
								{order.due_date ? formatDate(order.due_date) : '—'}
							</Table.Cell>
							<Table.Cell textAlign="end">
								{formatCurrency(order.grand_total)}
							</Table.Cell>
							<Table.Cell>
								<StatusBadge name={order.workflow_stage_name} color={order.workflow_stage_color} />
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
