import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import type {
	ApiResponse,
	OrdersResponse,
	OrderDetail,
	WorkflowStagesResponse,
	WorkflowBoardResponse,
} from '@/types/api';

export const orderKeys = {
	all: ['orders'] as const,
	detail: (orderId: string) => ['orders', orderId] as const,
	workflowStages: ['workflow-stages'] as const,
	workflowBoard: ['workflow-board'] as const,
};

export const useOrders = () => {
	return useQuery({
		queryKey: orderKeys.all,
		queryFn: async () => {
			const response = await api<ApiResponse<OrdersResponse>>('/orders');
			return response.data;
		},
	});
};

export const useOrder = (orderId: string) => {
	return useQuery({
		queryKey: orderKeys.detail(orderId),
		queryFn: async () => {
			const response = await api<ApiResponse<OrderDetail>>(
				`/orders/${orderId}`,
			);
			return response.data;
		},
	});
};

export const useWorkflowStages = () => {
	return useQuery({
		queryKey: orderKeys.workflowStages,
		queryFn: async () => {
			const response = await api<ApiResponse<WorkflowStagesResponse>>(
				'/orders/workflow-stages',
			);
			return response.data;
		},
	});
};

export const useWorkflowBoard = () => {
	return useQuery({
		queryKey: orderKeys.workflowBoard,
		queryFn: async () => {
			const response = await api<ApiResponse<WorkflowBoardResponse>>(
				'/orders/workflow-board',
			);
			return response.data;
		},
	});
};

export const useUpdateOrderStage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: { orderId: string; stageId: string }) => {
			return api(`/orders/${params.orderId}/stage`, {
				method: 'PUT',
				body: JSON.stringify({ stageId: params.stageId }),
			});
		},
		onMutate: async (variables) => {
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
		},
		onError: (_error, _variables, context) => {
			if (context?.previous) {
				queryClient.setQueryData(orderKeys.workflowBoard, context.previous);
			}
		},
		onSettled: (_data, _error, variables) => {
			queryClient.invalidateQueries({
				queryKey: orderKeys.detail(variables.orderId),
			});
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
			queryClient.invalidateQueries({ queryKey: orderKeys.workflowBoard });
		},
	});
};

export const useUpdateOrderItemStage = (orderId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: { itemId: string; stageId: string }) => {
			return api(
				`/orders/${orderId}/items/${params.itemId}/stage`,
				{
					method: 'PUT',
					body: JSON.stringify({ stageId: params.stageId }),
				},
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: orderKeys.detail(orderId),
			});
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
		},
	});
};

export const useUpdateOrderNotes = (orderId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (notes: string) => {
			return api(`/orders/${orderId}/notes`, {
				method: 'PUT',
				body: JSON.stringify({ notes }),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: orderKeys.detail(orderId),
			});
		},
	});
};

export const useSyncOrders = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const response = await api<ApiResponse<{ synced: number }>>('/orders/sync', {
				method: 'POST',
			});
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
		},
	});
};
