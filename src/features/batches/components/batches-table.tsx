import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Table, DropdownMenu, IconButton } from '@artifact-ui/core';
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon, ListChecksIcon } from '@/components/icons/icons';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import { BatchStatusSelect } from './batch-status-select';
import { useRenameBatch, useUpdateBatchStatus, useDeleteBatch } from '../api/batches-queries';
import { RenameBatchModal } from './rename-batch-modal';
import { DeleteBatchModal } from './delete-batch-modal';
import { formatDate } from '@/utils/format';
import type { Batch } from '@/types/api';

type BatchesTableProps = {
	batches: Batch[];
};

export const BatchesTable = ({ batches }: BatchesTableProps) => {
	const navigate = useNavigate();
	const { sortedData, sortKey, sortDirection, toggleSort } =
		useSortableTable(batches, {
			defaultKey: 'created_at',
			defaultDirection: 'desc',
			storageKey: 'batches',
			customSortFns: {
				progress: (a, b) => {
					const aRatio = a.item_count ? a.items_completed / a.item_count : 0;
					const bRatio = b.item_count ? b.items_completed / b.item_count : 0;
					return aRatio - bRatio;
				},
			},
		});
	const renameMutation = useRenameBatch();
	const statusMutation = useUpdateBatchStatus();
	const deleteMutation = useDeleteBatch();

	const [renameTarget, setRenameTarget] = useState<Batch | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<Batch | null>(null);

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

	return (
		<>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<SortableHeader
							label="Name"
							sortKey="name"
							activeSortKey={sortKey}
							sortDirection={sortDirection}
							onSort={toggleSort}
							className="w-1/3"
						/>
						<SortableHeader
							label="Orders"
							sortKey="order_count"
							activeSortKey={sortKey}
							sortDirection={sortDirection}
							onSort={toggleSort}
						/>
						<SortableHeader
							label="Progress"
							sortKey="progress"
							activeSortKey={sortKey}
							sortDirection={sortDirection}
							onSort={toggleSort}
						/>
						<SortableHeader
							label="Status"
							sortKey="status"
							activeSortKey={sortKey}
							sortDirection={sortDirection}
							onSort={toggleSort}
						/>
						<SortableHeader
							label="Created"
							sortKey="created_at"
							activeSortKey={sortKey}
							sortDirection={sortDirection}
							onSort={toggleSort}
						/>
						<Table.HeaderCell className="w-14" />
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{sortedData.map((batch) => (
						<Table.Row
							key={batch.id}
							className="cursor-pointer"
							onClick={() => navigate(`/batches/${batch.id}`)}
						>
							<Table.Cell>
								{batch.name}
							</Table.Cell>
							<Table.Cell>{batch.order_count}</Table.Cell>
							<Table.Cell>
								{batch.items_completed}/{batch.item_count} items
							</Table.Cell>
							<Table.Cell onClick={(e) => e.stopPropagation()}>
								<BatchStatusSelect
									value={batch.status}
									onChange={(status) =>
										statusMutation.mutate({ batchId: batch.id, status })
									}
								/>
							</Table.Cell>
							<Table.Cell>{formatDate(batch.created_at)}</Table.Cell>
							<Table.Cell>
								<DropdownMenu.DropdownMenu>
									<DropdownMenu.DropdownMenuTrigger asChild>
										<IconButton
											icon={<EllipsisHorizontalIcon size={16} />}
											label="Batch options"
											size="1"
											variant="ghost"
											color="neutral"
											onClick={(e) => e.stopPropagation()}
										/>
									</DropdownMenu.DropdownMenuTrigger>
									<DropdownMenu.DropdownMenuContent align="end" size="1">
										<DropdownMenu.DropdownMenuItem
											onClick={(e) => {
												e.stopPropagation();
												navigate(`/batches/${batch.id}/edit`);
											}}
										>
											<ListChecksIcon size={14} />
											Edit Orders
										</DropdownMenu.DropdownMenuItem>
										<DropdownMenu.DropdownMenuItem
											onClick={(e) => {
												e.stopPropagation();
												setRenameTarget(batch);
											}}
										>
											<PencilIcon size={14} />
											Rename
										</DropdownMenu.DropdownMenuItem>
										<DropdownMenu.DropdownMenuSeparator />
										<DropdownMenu.DropdownMenuItem
											onClick={(e) => {
												e.stopPropagation();
												setDeleteTarget(batch);
											}}
										>
											<TrashIcon size={14} />
											Delete
										</DropdownMenu.DropdownMenuItem>
									</DropdownMenu.DropdownMenuContent>
								</DropdownMenu.DropdownMenu>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>

			<RenameBatchModal
				open={!!renameTarget}
				onOpenChange={(open) => !open && setRenameTarget(null)}
				currentName={renameTarget?.name ?? ''}
				onRename={handleRename}
				isPending={renameMutation.isPending}
			/>

			<DeleteBatchModal
				open={!!deleteTarget}
				onOpenChange={(open) => !open && setDeleteTarget(null)}
				batchName={deleteTarget?.name ?? ''}
				onDelete={handleDelete}
				isPending={deleteMutation.isPending}
			/>
		</>
	);
};
