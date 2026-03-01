import { Table } from '@artifact-ui/core';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import type { HardwareEntry } from '@/types/api';

type HardwareTableProps = {
	items: HardwareEntry[];
};

export const HardwareTable = ({ items }: HardwareTableProps) => {
	const { sortedData, sortKey, sortDirection, toggleSort } =
		useSortableTable(items, {
			defaultKey: 'piece',
			defaultDirection: 'asc',
		});

	return (
		<Table.Root variant="surface" size="2">
			<Table.Header>
				<Table.Row>
					<SortableHeader
						label="Piece"
						sortKey="piece"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<SortableHeader
						label="Qty"
						sortKey="total_count"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						align="center"
					/>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sortedData.map((item, index) => (
					<Table.Row key={`${item.piece}-${index}`}>
						<Table.Cell>{item.piece}</Table.Cell>
						<Table.Cell textAlign="center">{item.total_count}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
};
