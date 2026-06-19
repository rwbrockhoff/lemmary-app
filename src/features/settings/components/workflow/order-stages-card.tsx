import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useToast } from '@/providers/toast-context';
import {
	useOrderStages,
	useCreateWorkflowStage,
	useUpdateWorkflowStage,
	useDeleteWorkflowStage,
	useReorderWorkflowStages,
} from '@/features/workflow/api/workflow-queries';
import type { WorkflowStageColor } from '@/components/orders/stage-colors';
import { StageEditor } from './stage-editor/stage-editor';

export const OrderStagesCard = () => {
	const toast = useToast();
	const { data: stages, isLoading, error } = useOrderStages();
	const create = useCreateWorkflowStage();
	const update = useUpdateWorkflowStage();
	const remove = useDeleteWorkflowStage();
	const reorder = useReorderWorkflowStages();

	const handleCreate = async (name: string, color: WorkflowStageColor) => {
		await create.mutateAsync(
			{ name, color },
			{
				onSuccess: () => toast.success('Stage added'),
				onError: (e) => toast.error(e.message, 'Could not add stage'),
			},
		);
	};

	const handleRename = (stageId: string, name: string) => {
		update.mutate(
			{ stageId, name },
			{
				onSuccess: () => toast.success('Stage renamed'),
				onError: (e) => toast.error(e.message, 'Could not rename'),
			},
		);
	};

	const handleRecolor = (stageId: string, color: WorkflowStageColor) => {
		update.mutate(
			{ stageId, color },
			{ onError: (e) => toast.error(e.message, 'Could not update color') },
		);
	};

	const handleDelete = (stageId: string) => {
		remove.mutate(stageId, {
			onSuccess: () => toast.success('Stage deleted'),
			onError: (e) => toast.error(e.message, 'Could not delete'),
		});
	};

	return (
		<LoadingWrapper
			isLoading={isLoading}
			skeleton={<PageSpinner />}
			isError={!!error}
			errorState={<ErrorState description="Failed to load order stages." />}>
			{stages && (
				<StageEditor
					title="Order Stages"
					description="Rename, add, or remove the stages you use for managing your order workflow."
					stages={stages}
					onCreate={handleCreate}
					onRename={handleRename}
					onRecolor={handleRecolor}
					onDelete={handleDelete}
					onReorder={(orderedIds) => reorder.mutate(orderedIds)}
					isCreating={create.isPending}
					isUpdating={update.isPending}
					isDeleting={remove.isPending}
				/>
			)}
		</LoadingWrapper>
	);
};
