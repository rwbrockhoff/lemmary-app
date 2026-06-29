import { Table } from '@artifact-ui/core';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import type { FabricEntry } from '@/types/api';

type FabricTableProps = {
	items: FabricEntry[];
};

export const FabricTable = ({ items }: FabricTableProps) => {
	const { sortedData, sortKey, sortDirection, toggleSort } = useSortableTable(items, {
		defaultKey: 'product_name',
		defaultDirection: 'asc',
		storageKey: 'materials-fabric',
	});

	return (
		<Table.Root variant="surface" size="2">
			<Table.Header>
				<Table.Row>
					<SortableHeader
						label="Product"
						sortKey="product_name"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<SortableHeader
						label="Material"
						sortKey="material_type"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<SortableHeader
						label="Piece"
						sortKey="piece"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<SortableHeader
						label="Color"
						sortKey="color"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<SortableHeader
						label="Qty"
						sortKey="total_quantity"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						align="center"
					/>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sortedData.map((item, index) => (
					<Table.Row
						key={`${item.product_name}-${item.material_type}-${item.piece}-${item.color}-${index}`}>
						<Table.Cell>{item.product_name}</Table.Cell>
						<Table.Cell>{item.material_type}</Table.Cell>
						<Table.Cell>{item.piece}</Table.Cell>
						<Table.Cell>{item.color || '—'}</Table.Cell>
						<Table.Cell textAlign="center">{item.total_quantity}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
};
