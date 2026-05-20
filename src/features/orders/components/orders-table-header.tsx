import { Table } from '@artifact-ui/core';
import { SortableHeader } from '@/components/sortable-header';
import type { SortDirection } from '@/hooks/use-sortable-table';
import type { OrderSortKey } from './orders-table';

type OrdersTableHeaderProps = {
	sortKey: OrderSortKey;
	sortDirection: SortDirection;
	onSort: (key: OrderSortKey) => void;
};

export const OrdersTableHeader = ({
	sortKey,
	sortDirection,
	onSort,
}: OrdersTableHeaderProps) => {
	return (
		<Table.Header>
			<Table.Row>
				<SortableHeader<OrderSortKey>
					label="Order"
					sortKey="order_number"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-20"
				/>
				<SortableHeader<OrderSortKey>
					label="Customer"
					sortKey="customer_name"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-1/4"
				/>
				<SortableHeader<OrderSortKey>
					label="Date"
					sortKey="order_date"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-36"
				/>
				<SortableHeader<OrderSortKey>
					label="Due"
					sortKey="due_date"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-36"
				/>
				<SortableHeader<OrderSortKey>
					label="Items"
					sortKey="item_count"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-14"
				/>
				<SortableHeader<OrderSortKey>
					label="Total"
					sortKey="grand_total"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-28"
					align="end"
				/>
				<Table.HeaderCell className="w-14" />
				<Table.HeaderCell className="w-14" />
			</Table.Row>
		</Table.Header>
	);
};
