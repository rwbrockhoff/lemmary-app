import { Table } from '@artifact-ui/core';
import { SortableHeader } from '@/components/sortable-header';
import type { SortDirection } from '@/hooks/use-sortable-table';
import type { MaterialSortKey } from './batch-materials-table';

type BatchMaterialsTableHeaderProps = {
	isFabric: boolean;
	sortKey: MaterialSortKey;
	sortDirection: SortDirection;
	onSort: (key: MaterialSortKey) => void;
};

export const BatchMaterialsTableHeader = ({
	isFabric,
	sortKey,
	sortDirection,
	onSort,
}: BatchMaterialsTableHeaderProps) => {
	return (
		<Table.Header>
			<Table.Row>
				{!isFabric && <Table.HeaderCell className="w-10" />}
				{isFabric && (
					<SortableHeader<MaterialSortKey>
						label="Product"
						sortKey="product_name"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={onSort}
					/>
				)}
				{isFabric && (
					<SortableHeader<MaterialSortKey>
						label="Material"
						sortKey="material_type"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={onSort}
					/>
				)}
				{!isFabric && (
					<SortableHeader<MaterialSortKey>
						label="Type"
						sortKey="material_type"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={onSort}
					/>
				)}
				<SortableHeader<MaterialSortKey>
					label="Piece"
					sortKey="piece"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
				/>
				{isFabric && (
					<SortableHeader<MaterialSortKey>
						label="Color"
						sortKey="color"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={onSort}
					/>
				)}
				<SortableHeader<MaterialSortKey>
					label="Qty"
					sortKey="quantity"
					activeSortKey={sortKey}
					sortDirection={sortDirection}
					onSort={onSort}
					className="w-16"
				/>
				{isFabric && (
					<SortableHeader<MaterialSortKey>
						label="Progress"
						sortKey="progress"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={onSort}
						align="center"
					/>
				)}
			</Table.Row>
		</Table.Header>
	);
};
