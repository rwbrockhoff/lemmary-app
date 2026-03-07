import { Table } from '@artifact-ui/core';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import type { LinearEntry } from '@/types/api';

type LinearTableProps = {
	items: LinearEntry[];
};

export const LinearTable = ({ items }: LinearTableProps) => {
	const { sortedData, sortKey, sortDirection, toggleSort } =
		useSortableTable(items, {
			defaultKey: 'material_type',
			defaultDirection: 'asc',
			storageKey: 'materials-linear',
		});

	return (
		<Table.Root variant="surface" size="2">
			<Table.Header>
				<Table.Row>
					<SortableHeader
						label="Material"
						sortKey="material_type"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<SortableHeader
						label="Width"
						sortKey="width"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						align="center"
					/>
					<SortableHeader
						label="Total (ft)"
						sortKey="total_feet"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						align="center"
					/>
					<SortableHeader
						label="Order (ft)"
						sortKey="feet_to_order"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						align="center"
					/>
					<Table.HeaderCell style={{ textAlign: 'center' }}>Order (yds)</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sortedData.map((item, index) => (
					<Table.Row key={`${item.material_type}-${item.width}-${index}`}>
						<Table.Cell>{item.material_type}</Table.Cell>
						<Table.Cell textAlign="center">
							{item.width ? `${item.width}"` : '—'}
						</Table.Cell>
						<Table.Cell textAlign="center">{item.total_feet}</Table.Cell>
						<Table.Cell textAlign="center">{item.feet_to_order}</Table.Cell>
						<Table.Cell textAlign="center">
							{Math.ceil(item.feet_to_order / 3)}
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
};
