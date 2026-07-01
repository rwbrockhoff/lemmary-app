import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { PageHeader } from '@/components/page-header';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
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
import { BatchTabs } from './components/batch-tabs';
import { BatchOptionsMenu } from './components/batch-options-menu';
import { useToast } from '@/providers/toast-context';
import { usePrintBatchSlips } from '@/features/orders/api/orders-queries';
import shared from '@/styles/shared.module.css';

const BatchDetailPage = () => {
	const { batchId } = useParams<{ batchId: string }>();
	const navigate = useNavigate();
	const toast = useToast();

	const { data: batch, isLoading, error } = useBatch(batchId!);
	const printSlips = usePrintBatchSlips();
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

	const handlePrintSlips = () => {
		if (!batch) return;
		// Open the tab on the click itself so Safari doesn't block the popup
		const tab = window.open('', '_blank');
		const orderIds = batch.orders.map((order) => order.order_id);
		if (orderIds.length === 0) {
			tab?.close();
			toast.error('This batch has no orders to print');
			return;
		}
		printSlips.mutate(orderIds, {
			onSuccess: (url) => {
				if (tab) tab.location.href = url;
				else window.open(url, '_blank');
			},
			onError: (err) => {
				tab?.close();
				toast.error(err.message, 'Could not open packing slips');
			},
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
							<BatchOptionsMenu
								onPrint={handlePrintSlips}
								onEditOrders={() => navigate(`/batches/${batchId}/edit`)}
								onRename={() => setShowRename(true)}
								onDelete={() => setShowDelete(true)}
							/>
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
						<BatchTabs
							batchId={batchId!}
							batch={batch}
							onToggle={handleToggle}
							onUpdateQty={handleUpdateQty}
						/>
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
