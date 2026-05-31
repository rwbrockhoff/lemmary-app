import { useNavigate } from 'react-router';
import { Table } from '@artifact-ui/core';
import { CustomerOrdersRow } from './customer-orders-row';
import { CustomerOrdersTableHeader } from './customer-orders-table-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import type { CustomerOrder } from '@/types/api';

type CustomerOrdersTableProps = {
	orders: CustomerOrder[];
};

export type CustomerOrderSortKey = Extract<keyof CustomerOrder, string>;

export const CustomerOrdersTable = ({ orders }: CustomerOrdersTableProps) => {
	const navigate = useNavigate();

	const { sortedData, sortKey, sortDirection, toggleSort } = useSortableTable<
		CustomerOrder,
		CustomerOrderSortKey
	>(orders, {
		defaultKey: 'order_date',
		defaultDirection: 'desc',
		storageKey: 'customer-orders',
	});

	return (
		<Table.Root>
			<CustomerOrdersTableHeader
				sortKey={sortKey}
				sortDirection={sortDirection}
				onSort={toggleSort}
			/>
			<Table.Body>
				{sortedData.map((order) => (
					<CustomerOrdersRow
						key={order.id}
						order={order}
						onClick={() => navigate(`/orders/${order.id}`)}
					/>
				))}
			</Table.Body>
		</Table.Root>
	);
};
