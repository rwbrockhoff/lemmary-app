import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { orderKeys } from './orders-keys';
import { optimisticallyUpdateOrderStage, rollbackOrderStage } from './orders-cache';
import type {
	ApiResponse,
	OrdersResponse,
	OrderDetail,
	WorkflowStagesResponse,
	WorkflowBoardResponse,
} from '@/types/api';

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
