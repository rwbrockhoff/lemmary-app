import type { QueryClient } from '@tanstack/react-query';
import type { WorkflowBoardResponse, OrderDetail, WorkflowStage } from '@/types/api';
import { orderKeys } from './orders-keys';

type UpdateStageVariables = { orderId: string; stageId: string };
type UpdateItemStageVariables = { itemId: string; stageId: string };

export async function optimisticallyUpdateOrderStage(
	queryClient: QueryClient,
	variables: UpdateStageVariables,
) {
	await queryClient.cancelQueries({ queryKey: orderKeys.workflowBoard });

	const previous = queryClient.getQueryData<WorkflowBoardResponse>(
		orderKeys.workflowBoard,
	);

	if (previous) {
		const newStage = previous.stages.find((s) => s.id === variables.stageId);

		queryClient.setQueryData<WorkflowBoardResponse>(
			orderKeys.workflowBoard,
			{
				...previous,
				orders: previous.orders.map((o) =>
					o.id === variables.orderId
						? {
								...o,
								workflow_stage_id: variables.stageId,
								workflow_stage_name: newStage?.name ?? null,
								workflow_stage_color: newStage?.color ?? null,
							}
						: o,
				),
			},
		);
	}

	return { previous };
}

export function rollbackOrderStage(
	queryClient: QueryClient,
	previous: WorkflowBoardResponse | undefined,
) {
	if (previous) {
		queryClient.setQueryData(orderKeys.workflowBoard, previous);
	}
}

export async function optimisticallyUpdateItemStage(
	queryClient: QueryClient,
	orderId: string,
	variables: UpdateItemStageVariables,
	stages: WorkflowStage[],
) {
	await queryClient.cancelQueries({ queryKey: orderKeys.detail(orderId) });

	const previous = queryClient.getQueryData<OrderDetail>(
		orderKeys.detail(orderId),
	);

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
