import { Table } from '@artifact-ui/core';
import { BatchMaterialsTableHeader } from './batch-materials-table-header';
import { BatchMaterialRow } from './batch-material-row';
import { BatchFabricMaterialRow } from './batch-fabric-material-row';
import { useSortableTable } from '@/hooks/use-sortable-table';
import type { BatchMaterial } from '@/types/api';

type BatchMaterialsTableProps = {
	materials: BatchMaterial[];
	onToggle: (id: string, completed: boolean) => void;
	onUpdateQty?: (id: string, completedQty: number) => void;
};

export type MaterialSortKey = Extract<keyof BatchMaterial, string> | 'progress';

export const BatchMaterialsTable = ({
	materials,
	onToggle,
	onUpdateQty,
}: BatchMaterialsTableProps) => {
	const isFabric = materials[0]?.category === 'fabric';

	const { sortedData, sortKey, sortDirection, toggleSort } = useSortableTable<
		BatchMaterial,
		MaterialSortKey
	>(materials, {
		defaultKey: 'piece',
		defaultDirection: 'asc',
		storageKey: 'batch-materials',
		customSortFns: {
			progress: (a, b) => {
				const aTotal = Number(a.quantity);
				const bTotal = Number(b.quantity);
				const aRatio = aTotal > 0 ? a.completed_qty / aTotal : 0;
				const bRatio = bTotal > 0 ? b.completed_qty / bTotal : 0;
				return aRatio - bRatio;
			},
		},
	});

	return (
		<Table.Root>
			<BatchMaterialsTableHeader
				isFabric={isFabric}
				sortKey={sortKey}
				sortDirection={sortDirection}
				onSort={toggleSort}
			/>
			<Table.Body>
				{sortedData.map((material) => {
					if (isFabric && onUpdateQty) {
						return (
							<BatchFabricMaterialRow
								key={material.id}
								material={material}
								onUpdateQty={onUpdateQty}
							/>
						);
					}
					return (
						<BatchMaterialRow key={material.id} material={material} onToggle={onToggle} />
					);
				})}
			</Table.Body>
		</Table.Root>
	);
};
