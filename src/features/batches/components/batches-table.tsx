import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Table } from '@artifact-ui/core';
import { useSortableTable } from '@/hooks/use-sortable-table';
import { BatchesTableHeader } from './batches-table-header';
import { BatchRow } from './batch-row';
import { RenameBatchModal } from './rename-batch-modal';
import { DeleteBatchModal } from './delete-batch-modal';
import {
	useRenameBatch,
	useUpdateBatchStatus,
	useDeleteBatch,
} from '../api/batches-queries';
import { getBatchStatusRank } from '../utils/batch-utils';
import { usePrintBatchSlips } from '../hooks/use-print-batch-slips';
import type { Batch } from '@/types/api';

type BatchesTableProps = {
	batches: Batch[];
};

export type BatchSortKey = Extract<keyof Batch, string> | 'progress';

export const BatchesTable = ({ batches }: BatchesTableProps) => {
	const navigate = useNavigate();
	const renameMutation = useRenameBatch();
	const statusMutation = useUpdateBatchStatus();
	const deleteMutation = useDeleteBatch();
	const { print: printSlips } = usePrintBatchSlips();

	const [renameTarget, setRenameTarget] = useState<Batch | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<Batch | null>(null);

	const { sortedData, sortKey, sortDirection, toggleSort } = useSortableTable<
		Batch,
		BatchSortKey
	>(batches, {
		defaultKey: 'created_at',
		defaultDirection: 'desc',
		storageKey: 'batches',
		customSortFns: {
			progress: (a, b) => {
				const aRatio = a.item_count ? a.items_completed / a.item_count : 0;
				const bRatio = b.item_count ? b.items_completed / b.item_count : 0;
				return aRatio - bRatio;
			},
			status: (a, b) => getBatchStatusRank(a.status) - getBatchStatusRank(b.status),
		},
	});

	const handleRename = (name: string) => {
		if (!renameTarget) return;
		renameMutation.mutate(
			{ batchId: renameTarget.id, name },
			{ onSuccess: () => setRenameTarget(null) },
		);
	};

	const handleDelete = () => {
		if (!deleteTarget) return;
		deleteMutation.mutate(deleteTarget.id, {
			onSuccess: () => setDeleteTarget(null),
		});
	};

	const handleCloseRename = (open: boolean) => {
		if (!open) setRenameTarget(null);
	};

	const handleCloseDelete = (open: boolean) => {
		if (!open) setDeleteTarget(null);
	};

	return (
		<>
			<Table.Root>
				<BatchesTableHeader
					sortKey={sortKey}
					sortDirection={sortDirection}
					onSort={toggleSort}
				/>
				<Table.Body>
					{sortedData.map((batch) => (
						<BatchRow
							key={batch.id}
							batch={batch}
							onRowClick={() => navigate(`/batches/${batch.id}`)}
							onPrint={() => printSlips(batch.id)}
							onStatusChange={(status) =>
								statusMutation.mutate({ batchId: batch.id, status })
							}
							onEditOrders={() => navigate(`/batches/${batch.id}/edit`)}
							onRename={() => setRenameTarget(batch)}
							onDelete={() => setDeleteTarget(batch)}
						/>
					))}
				</Table.Body>
			</Table.Root>

			<RenameBatchModal
				open={!!renameTarget}
				onOpenChange={handleCloseRename}
				currentName={renameTarget?.name ?? ''}
				onRename={handleRename}
				isPending={renameMutation.isPending}
			/>

			<DeleteBatchModal
				open={!!deleteTarget}
				onOpenChange={handleCloseDelete}
				batchName={deleteTarget?.name ?? ''}
				onDelete={handleDelete}
				isPending={deleteMutation.isPending}
			/>
		</>
	);
};
