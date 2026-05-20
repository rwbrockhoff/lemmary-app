import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Table } from '@artifact-ui/core';
import { useSortableTable } from '@/hooks/use-sortable-table';
import { OrdersTableHeader } from './orders-table-header';
import { OrderRow } from './order-row';
import type { OrderWithItems } from '@/types/api';

type OrdersTableProps = {
	orders: OrderWithItems[];
};

export type OrderSortKey = Extract<keyof OrderWithItems, string>;

export const OrdersTable = ({ orders }: OrdersTableProps) => {
	const navigate = useNavigate();
	const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());

	const { sortedData, sortKey, sortDirection, toggleSort } = useSortableTable<
		OrderWithItems,
		OrderSortKey
	>(orders, {
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
			<OrdersTableHeader
				sortKey={sortKey}
				sortDirection={sortDirection}
				onSort={toggleSort}
			/>
			<Table.Body>
				{sortedData.map((order) => (
					<OrderRow
						key={order.id}
						order={order}
						isExpanded={expandedOrderIds.has(order.id)}
						onRowClick={() => navigate(`/orders/${order.id}`)}
						onToggleExpand={() => toggleExpand(order.id)}
					/>
				))}
			</Table.Body>
		</Table.Root>
	);
};
