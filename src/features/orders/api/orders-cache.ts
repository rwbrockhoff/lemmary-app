import type { QueryClient } from '@tanstack/react-query';
import type { OrderDetail, WorkflowStage } from '@/types/api';
import { orderKeys } from './orders-keys';

type UpdateItemStageVariables = { itemId: string; stageId: string };

export async function optimisticallyUpdateItemStage(
	queryClient: QueryClient,
	orderId: string,
	variables: UpdateItemStageVariables,
	stages: WorkflowStage[],
) {
	await queryClient.cancelQueries({ queryKey: orderKeys.detail(orderId) });

	const previous = queryClient.getQueryData<OrderDetail>(orderKeys.detail(orderId));

	if (previous) {
		const newStage = stages.find((s) => s.id === variables.stageId);

		queryClient.setQueryData<OrderDetail>(orderKeys.detail(orderId), {
			...previous,
			items: previous.items.map((item) =>
				item.id === variables.itemId
					? {
							...item,
							workflow_stage_id: variables.stageId,
							workflow_stage_name: newStage?.name ?? null,
						}
					: item,
			),
		});
	}

	return { previous };
}

export function rollbackOrderDetail(
	queryClient: QueryClient,
	orderId: string,
	previous: OrderDetail | undefined,
) {
	if (previous) {
		queryClient.setQueryData(orderKeys.detail(orderId), previous);
	}
}
