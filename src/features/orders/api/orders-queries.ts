import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { orderKeys } from './orders-keys';
import { optimisticallyUpdateOrderStage, rollbackOrderStage } from './orders-cache';
import type {
	OrdersResponse,
	OrderDetail,
	OrderWithItems,
	WorkflowStagesResponse,
	WorkflowBoardResponse,
} from '@/types/api';

export const useOrders = () => {
	return useQuery({
		queryKey: orderKeys.all,
		queryFn: () => api.get<OrdersResponse>('/orders'),
	});
};

export const useOrdersWithItems = () => {
	return useQuery({
		queryKey: orderKeys.withItems,
		queryFn: () => api.get<OrderWithItems[]>('/orders/with-items'),
	});
};

export const useOrder = (orderId: string) => {
	return useQuery({
		queryKey: orderKeys.detail(orderId),
		queryFn: () => api.get<OrderDetail>(`/orders/${orderId}`),
	});
};

export const useWorkflowStages = () => {
	return useQuery({
		queryKey: orderKeys.workflowStages,
		queryFn: () => api.get<WorkflowStagesResponse>('/orders/workflow-stages'),
	});
};

export const useWorkflowBoard = () => {
	return useQuery({
		queryKey: orderKeys.workflowBoard,
		queryFn: () => api.get<WorkflowBoardResponse>('/orders/workflow-board'),
	});
};

export const useUpdateOrderStage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params: { orderId: string; stageId: string }) =>
			api.put(`/orders/${params.orderId}/stage`, { stageId: params.stageId }),
		onMutate: (variables) => optimisticallyUpdateOrderStage(queryClient, variables),
		onError: (_error, _variables, context) => {
			rollbackOrderStage(queryClient, context?.previous);
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
		mutationFn: (params: { itemId: string; stageId: string }) =>
			api.put(`/orders/${orderId}/items/${params.itemId}/stage`, {
				stageId: params.stageId,
			}),
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
		mutationFn: (notes: string) =>
			api.put(`/orders/${orderId}/notes`, { notes }),
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
		mutationFn: () => api.post<{ synced: number }>('/orders/sync'),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
		},
	});
};
