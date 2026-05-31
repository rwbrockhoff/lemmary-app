import { Table, Text } from '@artifact-ui/core';
import { SortableHeader } from '@/components/sortable-header';
import type { SortDirection } from '@/hooks/use-sortable-table';
import type { CustomerOrderSortKey } from './customer-orders-table';

type CustomerOrdersTableHeaderProps = {
	sortKey: CustomerOrderSortKey;
	sortDirection: SortDirection;
	onSort: (key: CustomerOrderSortKey) => void;
};

export const CustomerOrdersTableHeader = ({
	sortKey,
	sortDirection,
	onSort,
}: CustomerOrdersTableHeaderProps) => {
	return (
		<Table.Header>
			<Table.Row>
				<SortableHeader<CustomerOrderSortKey>
					label="Order #"
					sortKey="order_number"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-24"
				/>
				<SortableHeader<CustomerOrderSortKey>
					label="Date"
					sortKey="order_date"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-36"
				/>
				<SortableHeader<CustomerOrderSortKey>
					label="Due"
					sortKey="due_date"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-36"
				/>
				<SortableHeader<CustomerOrderSortKey>
					label="Items"
					sortKey="item_count"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-20"
				/>
				<SortableHeader<CustomerOrderSortKey>
					label="Total"
					sortKey="grand_total"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-28"
				/>
				<SortableHeader<CustomerOrderSortKey>
					label="Status"
					sortKey="fulfillment_status"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-24"
				/>
				<Table.HeaderCell>
					<Text size="2" weight="medium" color="secondary">
						Notes
					</Text>
				</Table.HeaderCell>
			</Table.Row>
		</Table.Header>
	);
};
