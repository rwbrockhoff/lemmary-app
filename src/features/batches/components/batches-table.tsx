import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Table, DropdownMenu, IconButton } from '@artifact-ui/core';
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon } from '@/components/icons/icons';
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
						<Table.HeaderCell>Name</Table.HeaderCell>
						<Table.HeaderCell>Orders</Table.HeaderCell>
						<Table.HeaderCell>Progress</Table.HeaderCell>
						<Table.HeaderCell>Status</Table.HeaderCell>
						<Table.HeaderCell>Created</Table.HeaderCell>
						<Table.HeaderCell className="w-14" />
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{batches.map((batch) => (
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
