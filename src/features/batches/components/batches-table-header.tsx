import { Table } from '@artifact-ui/core';
import { SortableHeader } from '@/components/sortable-header';
import type { SortDirection } from '@/hooks/use-sortable-table';
import type { BatchSortKey } from './batches-table';

type BatchesTableHeaderProps = {
	sortKey: BatchSortKey;
	sortDirection: SortDirection;
	onSort: (key: BatchSortKey) => void;
};

export const BatchesTableHeader = ({
	sortKey,
	sortDirection,
	onSort,
}: BatchesTableHeaderProps) => {
	return (
		<Table.Header>
			<Table.Row>
				<SortableHeader<BatchSortKey>
					label="Name"
					sortKey="name"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-1/3"
				/>
				<SortableHeader<BatchSortKey>
					label="Orders"
					sortKey="order_count"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
				/>
				<SortableHeader<BatchSortKey>
					label="Progress"
					sortKey="progress"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
				/>
				<SortableHeader<BatchSortKey>
					label="Status"
					sortKey="status"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
				/>
				<SortableHeader<BatchSortKey>
					label="Created"
					sortKey="created_at"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
				/>
				<Table.HeaderCell className="w-14" />
			</Table.Row>
		</Table.Header>
	);
};
