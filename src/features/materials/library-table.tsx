import { Table, Text, cn } from '@artifact-ui/core';
import shared from '@/styles/shared.module.css';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import { ExternalLinkIcon } from '@/components/icons/icons';
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
					/>
					<SortableHeader
						label="Color"
						sortKey="color"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<SortableHeader
						label="Size"
						sortKey="size"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<SortableHeader
						label="Used"
						sortKey="usage_count"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						align="center"
					/>
					<Table.HeaderCell>
						<Text size="2" weight="medium" color="secondary">
							Purchase
						</Text>
					</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sortedData.map((material) => (
					<Table.Row key={material.id}>
						<Table.Cell>{material.material_type_name}</Table.Cell>
						<Table.Cell>{material.color || '—'}</Table.Cell>
						<Table.Cell>{material.size || '—'}</Table.Cell>
						<Table.Cell textAlign="center">{material.usage_count}</Table.Cell>
						<Table.Cell>
							{material.purchase_url ? (
								<a
									href={material.purchase_url}
									target="_blank"
									rel="noopener noreferrer"
									className={cn(shared.brandLink, 'inline-flex items-center gap-1')}>
									Buy
									<ExternalLinkIcon size={14} />
								</a>
							) : (
								'—'
							)}
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
};
