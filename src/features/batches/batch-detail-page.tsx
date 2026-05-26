import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Tabs, DropdownMenu, IconButton } from '@artifact-ui/core';
import { PageHeader } from '@/components/page-header';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import {
	EllipsisHorizontalIcon,
	PencilIcon,
	TrashIcon,
	ListChecksIcon,
} from '@/components/icons/icons';
import { BatchStatusSelect } from './components/batch-status-select';
import {
	useBatch,
	useToggleComplete,
	useUpdateMaterialQty,
	useRenameBatch,
	useUpdateBatchStatus,
	useDeleteBatch,
} from './api/batches-queries';
import { RenameBatchModal } from './components/rename-batch-modal';
import { DeleteBatchModal } from './components/delete-batch-modal';
import { BatchOrdersTable } from './components/batch-orders-table';
import { BatchItemsTable } from './components/batch-items-table';
import { BatchMaterialsTable } from './components/batch-materials-table';
import shared from '@/styles/shared.module.css';

const BatchDetailPage = () => {
	const { batchId } = useParams<{ batchId: string }>();
	const navigate = useNavigate();
	const { data: batch, isLoading, error } = useBatch(batchId!);
	const toggleComplete = useToggleComplete(batchId!);
	const updateMaterialQty = useUpdateMaterialQty(batchId!);
	const renameMutation = useRenameBatch();
	const statusMutation = useUpdateBatchStatus();
	const deleteMutation = useDeleteBatch();

	const [showRename, setShowRename] = useState(false);
	const [showDelete, setShowDelete] = useState(false);

	const handleRename = (name: string) => {
		renameMutation.mutate(
			{ batchId: batchId!, name },
			{ onSuccess: () => setShowRename(false) },
		);
	};

	const handleDelete = () => {
		deleteMutation.mutate(batchId!, {
			onSuccess: () => navigate('/batches'),
		});
	};

	const handleToggle = (
		type: 'orders' | 'items' | 'materials',
		id: string,
		completed: boolean,
	) => {
		toggleComplete.mutate({ type, id, completed });
	};

	const handleUpdateQty = (id: string, completedQty: number) => {
		updateMaterialQty.mutate({ id, completedQty });
	};

	const fabricMaterials = batch?.materials.filter((m) => m.category === 'fabric') ?? [];
	const linearMaterials = batch?.materials.filter((m) => m.category === 'linear') ?? [];
	const hardwareMaterials =
		batch?.materials.filter((m) => m.category === 'hardware') ?? [];

	return (
		<div className={shared.pageContainer}>
			<PageHeader
				segments={[{ label: 'Batches', to: '/batches' }]}
				title={batch && batch.name}
				actions={
					batch && (
						<>
							<BatchStatusSelect
								value={batch.status}
								onChange={(status) =>
									statusMutation.mutate({ batchId: batchId!, status })
								}
							/>
							<DropdownMenu.DropdownMenu>
								<DropdownMenu.DropdownMenuTrigger asChild>
									<IconButton
										icon={<EllipsisHorizontalIcon size={16} />}
										label="Batch options"
										size="1"
										variant="ghost"
										color="neutral"
									/>
								</DropdownMenu.DropdownMenuTrigger>
								<DropdownMenu.DropdownMenuContent align="end" size="1">
									<DropdownMenu.DropdownMenuItem
										onClick={() => navigate(`/batches/${batchId}/edit`)}>
										<ListChecksIcon size={14} />
										Edit Orders
									</DropdownMenu.DropdownMenuItem>
									<DropdownMenu.DropdownMenuItem onClick={() => setShowRename(true)}>
										<PencilIcon size={14} />
										Rename
									</DropdownMenu.DropdownMenuItem>
									<DropdownMenu.DropdownMenuSeparator />
									<DropdownMenu.DropdownMenuItem onClick={() => setShowDelete(true)}>
										<TrashIcon size={14} />
										Delete
									</DropdownMenu.DropdownMenuItem>
								</DropdownMenu.DropdownMenuContent>
							</DropdownMenu.DropdownMenu>
						</>
					)
				}
			/>
			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error || (!isLoading && !batch)}
				errorState={<ErrorState description="Failed to load batch." />}>
				{batch && (
					<>
						<Tabs.Root defaultValue="orders">
							<Tabs.List>
								<Tabs.Trigger value="orders">Orders ({batch.orders.length})</Tabs.Trigger>
								<Tabs.Trigger value="items">
									Items ({batch.items.reduce((sum, i) => sum + i.quantity, 0)})
								</Tabs.Trigger>
								<Tabs.Trigger value="fabric">
									Fabric ({fabricMaterials.length})
								</Tabs.Trigger>
								<Tabs.Trigger value="linear">
									Linear ({linearMaterials.length})
								</Tabs.Trigger>
								{hardwareMaterials.length > 0 && (
									<Tabs.Trigger value="hardware">
										Hardware ({hardwareMaterials.length})
									</Tabs.Trigger>
								)}
							</Tabs.List>

							<Tabs.Content value="orders">
								<BatchOrdersTable
									batchId={batchId!}
									orders={batch.orders}
									orderItems={batch.orderItems}
									onToggle={(id, completed) => handleToggle('orders', id, completed)}
								/>
							</Tabs.Content>

							<Tabs.Content value="items">
								<BatchItemsTable items={batch.items} orderItems={batch.orderItems} />
							</Tabs.Content>

							<Tabs.Content value="fabric">
								<BatchMaterialsTable
									materials={fabricMaterials}
									onToggle={(id, completed) => handleToggle('materials', id, completed)}
									onUpdateQty={handleUpdateQty}
								/>
							</Tabs.Content>

							<Tabs.Content value="linear">
								<BatchMaterialsTable
									materials={linearMaterials}
									onToggle={(id, completed) => handleToggle('materials', id, completed)}
								/>
							</Tabs.Content>

							{hardwareMaterials.length > 0 && (
								<Tabs.Content value="hardware">
									<BatchMaterialsTable
										materials={hardwareMaterials}
										onToggle={(id, completed) => handleToggle('materials', id, completed)}
									/>
								</Tabs.Content>
							)}
						</Tabs.Root>
						<RenameBatchModal
							open={showRename}
							onOpenChange={setShowRename}
							currentName={batch.name}
							onRename={handleRename}
							isPending={renameMutation.isPending}
						/>

						<DeleteBatchModal
							open={showDelete}
							onOpenChange={setShowDelete}
							batchName={batch.name}
							onDelete={handleDelete}
							isPending={deleteMutation.isPending}
						/>
					</>
				)}
			</LoadingWrapper>
		</div>
	);
};

export default BatchDetailPage;
