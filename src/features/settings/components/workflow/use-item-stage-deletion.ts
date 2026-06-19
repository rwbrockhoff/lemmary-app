import { useState } from 'react';
import { useToast } from '@/providers/toast-context';
import { ApiError } from '@/api/client';
import { useDeleteItemStage } from '@/features/workflow/api/workflow-queries';
import type { WorkflowStage } from '@/types/api';
import type { ItemStageDeleteBlock } from './delete-item-stage-modal';

type BlockedDelete = {
	stageId: string;
	stageName: string;
	details: ItemStageDeleteBlock;
};

const errorMessage = (error: unknown): string =>
	error instanceof Error ? error.message : 'Something went wrong';

const asDeleteBlock = (error: unknown): ItemStageDeleteBlock | null => {
	if (!(error instanceof ApiError) || error.status !== 409) return null;

	const details = error.details;
	if (!details || typeof details !== 'object') return null;

	const record = details as Record<string, unknown>;
	const affectedOrders = record.affectedOrders;
	if (!Array.isArray(affectedOrders)) return null;

	let affectedCount = affectedOrders.length;
	if (typeof record.affectedCount === 'number') {
		affectedCount = record.affectedCount;
	}

	let suggestedReassignStageId: string | null = null;
	if (typeof record.suggestedReassignStageId === 'string') {
		suggestedReassignStageId = record.suggestedReassignStageId;
	}

	return {
		affectedOrders: affectedOrders as ItemStageDeleteBlock['affectedOrders'],
		affectedCount,
		suggestedReassignStageId,
	};
};

export const useItemStageDeletion = (stages: WorkflowStage[] | undefined) => {
	const toast = useToast();
	const remove = useDeleteItemStage();
	const [blocked, setBlocked] = useState<BlockedDelete | null>(null);

	const requestDelete = async (stageId: string) => {
		try {
			await remove.mutateAsync({ stageId });
			toast.success('Stage deleted');
		} catch (error) {
			const details = asDeleteBlock(error);
			if (details) {
				const stage = stages?.find((s) => s.id === stageId);
				setBlocked({ stageId, stageName: stage?.name ?? 'this stage', details });
				return;
			}
			toast.error(errorMessage(error), 'Could not delete');
		}
	};

	const confirmReassign = async (reassignStageId: string) => {
		if (!blocked) return;
		try {
			await remove.mutateAsync({ stageId: blocked.stageId, reassignStageId });
			toast.success('Stage deleted');
			setBlocked(null);
		} catch (error) {
			toast.error(errorMessage(error), 'Could not delete');
		}
	};

	const cancel = () => setBlocked(null);

	return {
		requestDelete,
		confirmReassign,
		cancel,
		blocked,
		isDeleting: remove.isPending,
	};
};
