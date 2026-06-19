import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useToast } from '@/providers/toast-context';
import {
	useItemStages,
	useCreateItemStage,
	useUpdateItemStage,
	useReorderItemStages,
} from '@/features/workflow/api/workflow-queries';
import type { WorkflowStageColor } from '@/components/orders/stage-colors';
import { StageEditor } from './stage-editor/stage-editor';
import { DeleteItemStageModal } from './delete-item-stage-modal';
import { useItemStageDeletion } from './use-item-stage-deletion';

export const ItemStagesCard = () => {
	const toast = useToast();
	const { data: stages, isLoading, error } = useItemStages();
	const create = useCreateItemStage();
	const update = useUpdateItemStage();
	const reorder = useReorderItemStages();
	const { requestDelete, confirmReassign, cancel, blocked, isDeleting } =
		useItemStageDeletion(stages);

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

	return (
		<LoadingWrapper
			isLoading={isLoading}
			skeleton={<PageSpinner />}
			isError={!!error}
			errorState={<ErrorState description="Failed to load item stages." />}>
			{stages && (
				<StageEditor
					title="Item Stages"
					description="Rename, add, or remove the stages you use for tracking individual items."
					stages={stages}
					onCreate={handleCreate}
					onRename={handleRename}
					onRecolor={handleRecolor}
					onDelete={requestDelete}
					onReorder={(orderedIds) => reorder.mutate(orderedIds)}
					isCreating={create.isPending}
					isUpdating={update.isPending}
					isDeleting={isDeleting}
				/>
			)}
			{blocked && (
				<DeleteItemStageModal
					open
					onOpenChange={(open) => !open && cancel()}
					block={blocked.details}
					stageName={blocked.stageName}
					reassignStages={(stages ?? []).filter((s) => s.id !== blocked.stageId)}
					onConfirm={confirmReassign}
					isDeleting={isDeleting}
				/>
			)}
		</LoadingWrapper>
	);
};
