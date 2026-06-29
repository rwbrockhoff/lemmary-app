import { Table, Text } from '@artifact-ui/core';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import { LibraryRow } from './library-row';
import type { MaterialLibraryItem } from '@/types/api';

type LibraryTableProps = {
	items: MaterialLibraryItem[];
};

export const LibraryTable = ({ items }: LibraryTableProps) => {
	const { sortedData, sortKey, sortDirection, toggleSort } = useSortableTable(items, {
		defaultKey: 'material_type_name',
		defaultDirection: 'asc',
		storageKey: 'materials-library',
	});

	return (
		<Table.Root variant="surface" size="2">
			<Table.Header>
				<Table.Row>
					<SortableHeader
						label="Type"
						sortKey="material_type_name"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-1/4"
					/>
					<SortableHeader
						label="Category"
						sortKey="measurement"
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
						className="w-1/6 pl-6"
					/>
					<SortableHeader
						label="Size"
						sortKey="size"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="pl-6"
					/>
					<SortableHeader
						label="Used in"
						sortKey="usage_count"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<Table.HeaderCell>
						<Text size="2" weight="medium" color="secondary">
							Purchase
						</Text>
					</Table.HeaderCell>
					<Table.HeaderCell className="w-16" aria-label="Actions" />
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sortedData.map((material) => (
					<LibraryRow key={material.id} material={material} />
				))}
			</Table.Body>
		</Table.Root>
	);
};
