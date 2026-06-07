import { Table, Text } from '@artifact-ui/core';
import { SortableHeader } from '@/components/sortable-header';
import type { SortDirection } from '@/hooks/use-sortable-table';
import type { OrderSortKey } from './batch-orders-table';

type BatchOrdersTableHeaderProps = {
	sortKey: OrderSortKey;
	sortDirection: SortDirection;
	onSort: (key: OrderSortKey) => void;
};

export const BatchOrdersTableHeader = ({
	sortKey,
	sortDirection,
	onSort,
}: BatchOrdersTableHeaderProps) => {
	return (
		<Table.Header>
			<Table.Row>
				<Table.HeaderCell className="w-10" />
				<SortableHeader<OrderSortKey>
					label="Order #"
					sortKey="order_number"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-32"
				/>
				<SortableHeader<OrderSortKey>
					label="Customer"
					sortKey="customer_name"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-1/5"
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
					label="Progress"
					sortKey="progress"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-28"
				/>
				<Table.HeaderCell>
					<Text size="2" weight="medium" color="secondary">
						Status
					</Text>
				</Table.HeaderCell>
			</Table.Row>
		</Table.Header>
	);
};
