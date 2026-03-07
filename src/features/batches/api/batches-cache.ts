import type { QueryClient } from '@tanstack/react-query';
import type { BatchDetail } from '@/types/api';
import { batchKeys } from './batches-keys';

type ToggleCompleteVariables = {
	type: 'orders' | 'items' | 'materials';
	id: string;
	completed: boolean;
};

export async function optimisticallyToggleComplete(
	queryClient: QueryClient,
	batchId: string,
	variables: ToggleCompleteVariables,
) {
	await queryClient.cancelQueries({ queryKey: batchKeys.detail(batchId) });

	const previous = queryClient.getQueryData<BatchDetail>(
		batchKeys.detail(batchId),
	);

	if (previous) {
		queryClient.setQueryData<BatchDetail>(batchKeys.detail(batchId), {
			...previous,
			[variables.type]: previous[variables.type].map((item) =>
				item.id === variables.id
					? { ...item, completed: variables.completed }
					: item,
			),
		});
	}

	return { previous };
}

type UpdateMaterialQtyVariables = {
	id: string;
	completedQty: number;
};

export async function optimisticallyUpdateMaterialQty(
	queryClient: QueryClient,
	batchId: string,
	variables: UpdateMaterialQtyVariables,
) {
	await queryClient.cancelQueries({ queryKey: batchKeys.detail(batchId) });

	const previous = queryClient.getQueryData<BatchDetail>(
		batchKeys.detail(batchId),
	);

	if (previous) {
		queryClient.setQueryData<BatchDetail>(batchKeys.detail(batchId), {
			...previous,
			materials: previous.materials.map((m) =>
				m.id === variables.id
					? { ...m, completed_qty: variables.completedQty }
					: m,
			),
		});
	}

	return { previous };
}

export function rollbackBatchDetail(
	queryClient: QueryClient,
	batchId: string,
	previous: BatchDetail | undefined,
) {
	if (previous) {
		queryClient.setQueryData(batchKeys.detail(batchId), previous);
	}
}
