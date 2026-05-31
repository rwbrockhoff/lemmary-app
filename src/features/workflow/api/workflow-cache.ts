import type { QueryClient } from '@tanstack/react-query';
import type {
	WorkflowBoardResponse,
	WorkflowStageWithOrders,
	WorkflowBoardOrder,
} from '@/types/api';
import { orderKeys } from '@/features/orders/api/orders-keys';

type UpdateStageVariables = { orderId: string; stageId: string };

// match BE sort - open by order_date asc, completed by fulfilled_on desc
// with manual placements (unlocked) on top to keep dragged cards visible
function sortStageOrders(stage: WorkflowStageWithOrders): WorkflowBoardOrder[] {
	return [...stage.orders].sort((a, b) => {
		if (stage.is_complete) {
			const aLocked = a.fulfillment_status === 'fulfilled';
			const bLocked = b.fulfillment_status === 'fulfilled';
			if (aLocked !== bLocked) return aLocked ? 1 : -1;
			const aTime = a.fulfilled_on
				? new Date(a.fulfilled_on).getTime()
				: new Date(a.order_date).getTime();
			const bTime = b.fulfilled_on
				? new Date(b.fulfilled_on).getTime()
				: new Date(b.order_date).getTime();
			return bTime - aTime;
		}
		return new Date(a.order_date).getTime() - new Date(b.order_date).getTime();
	});
}

function findOrderInStages(
	stages: WorkflowStageWithOrders[],
	orderId: string,
): { stage: WorkflowStageWithOrders; order: WorkflowBoardOrder } | null {
	for (const stage of stages) {
		const order = stage.orders.find((o) => o.id === orderId);
		if (order) return { stage, order };
	}
	return null;
}

function moveOrderBetweenStages(
	stages: WorkflowStageWithOrders[],
	sourceStageId: string,
	targetStageId: string,
	orderId: string,
	updatedOrder: WorkflowBoardOrder,
): WorkflowStageWithOrders[] {
	if (sourceStageId === targetStageId) return stages;

	return stages.map((stage) => {
		if (stage.id === sourceStageId) {
			return {
				...stage,
				orders: stage.orders.filter((o) => o.id !== orderId),
			};
		}
		if (stage.id === targetStageId) {
			return {
				...stage,
				orders: sortStageOrders({
					...stage,
					orders: [...stage.orders, updatedOrder],
				}),
			};
		}
		return stage;
	});
}

export function optimisticallyUpdateOrderStage(
	queryClient: QueryClient,
	variables: UpdateStageVariables,
) {
	// don't await - the render gap misplaces the card before the cache update lands
	void queryClient.cancelQueries({ queryKey: orderKeys.workflowBoard });

	const previous = queryClient.getQueryData<WorkflowBoardResponse>(
		orderKeys.workflowBoard,
	);

	if (!previous) return { previous };

	const found = findOrderInStages(previous.stages, variables.orderId);
	const targetStage = previous.stages.find((s) => s.id === variables.stageId);

	if (!found || !targetStage) return { previous };

	const updatedOrder: WorkflowBoardOrder = {
		...found.order,
		workflow_stage_id: variables.stageId,
		workflow_stage_name: targetStage.name,
		workflow_stage_color: targetStage.color,
	};

	queryClient.setQueryData<WorkflowBoardResponse>(orderKeys.workflowBoard, {
		...previous,
		stages: moveOrderBetweenStages(
			previous.stages,
			found.stage.id,
			targetStage.id,
			variables.orderId,
			updatedOrder,
		),
	});

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
