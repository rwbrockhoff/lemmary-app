import type { QueryClient } from '@tanstack/react-query';
import type { WorkflowBoardResponse } from '@/types/api';
import { orderKeys } from './orders-keys';

type UpdateStageVariables = { orderId: string; stageId: string };

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
