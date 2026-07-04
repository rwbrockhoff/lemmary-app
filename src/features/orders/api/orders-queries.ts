import {
	useQuery,
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query';
import { api } from '@/api/client';
import { orderKeys } from './orders-keys';
import { batchKeys } from '@/features/batches/api/batches-keys';
import { storeKeys } from '@/features/settings/api/store-keys';
import { optimisticallyUpdateItemStage, rollbackOrderDetail } from './orders-cache';
import type { OrderDetail, GetOrdersResponse, WorkflowStage } from '@/types/api';
import type {
	CreateCustomOrderRequest,
	UpdateCustomOrderRequest,
} from '../types/custom-order-types';
import type { WorkOrderRequest } from '../types/work-order-types';

export const useOrdersWithItems = (batchId?: string) => {
	return useQuery({
		queryKey: batchId ? [...orderKeys.withItems, batchId] : orderKeys.withItems,
		queryFn: () => {
			const params: Record<string, string> = { status: 'pending' };
			if (batchId) params.includeBatchId = batchId;
			return api.get<GetOrdersResponse>('/orders', params);
		},
	});
};

const COMPLETED_PAGE_SIZE = 15;

export const useCompletedOrders = () => {
	return useInfiniteQuery({
		queryKey: orderKeys.completed,
		queryFn: ({ pageParam = 0 }) =>
			api.get<GetOrdersResponse>('/orders', {
				status: 'completed',
				limit: String(COMPLETED_PAGE_SIZE),
				offset: String(pageParam),
			}),
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) =>
			lastPage.hasMore ? allPages.length * COMPLETED_PAGE_SIZE : undefined,
	});
};

export const useOrder = (orderId: string) => {
	return useQuery({
		queryKey: orderKeys.detail(orderId),
		queryFn: () => api.get<OrderDetail>(`/orders/${orderId}`),
	});
};

export const useUpdateOrderItemStage = (orderId: string, stages: WorkflowStage[]) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params: { itemId: string; stageId: string }) =>
			api.put(`/orders/${orderId}/items/${params.itemId}/stage`, {
				stageId: params.stageId,
			}),
		onMutate: (variables) =>
			optimisticallyUpdateItemStage(queryClient, orderId, variables, stages),
		onError: (_error, _variables, context) => {
			rollbackOrderDetail(queryClient, orderId, context?.previous);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: orderKeys.detail(orderId),
			});
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
			queryClient.invalidateQueries({ queryKey: orderKeys.workflowBoard });
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};

export const useCompleteAllOrderItems = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orderId: string) => api.put(`/orders/${orderId}/items/completion`),
		onSuccess: (_data, orderId) => {
			queryClient.invalidateQueries({
				queryKey: orderKeys.detail(orderId),
			});
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
			queryClient.invalidateQueries({ queryKey: orderKeys.workflowBoard });
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};

export const useUpdateOrderNotes = (orderId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (notes: string) => api.put(`/orders/${orderId}/notes`, { notes }),
		onSuccess: () => {
			// Invalidate queries that showcase a note icon for orders w/ custom notes
			queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
			queryClient.invalidateQueries({ queryKey: orderKeys.workflowBoard });
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};

type UpdateOrderDatesInput = {
	order_date?: string;
	due_date?: string | null;
};

export const useUpdateOrderDates = (orderId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (dates: UpdateOrderDatesInput) =>
			api.put(`/orders/${orderId}/dates`, dates),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
			queryClient.invalidateQueries({ queryKey: orderKeys.workflowBoard });
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};

export const useSyncOrders = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => api.post<{ synced: number }>('/orders/sync'),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
			// Dashboard reads /analytics/operations under its own key, so refresh it after a sync
			queryClient.invalidateQueries({ queryKey: ['dashboard'] });
			// Refresh the store so its last synced time updates
			queryClient.invalidateQueries({ queryKey: storeKeys.all });
		},
	});
};

export const usePrintPackingSlip = () => {
	return useMutation({
		mutationFn: async (orderId: string) => {
			const blob = await api.download(`/orders/${orderId}/packing-slip`);
			return URL.createObjectURL(blob);
		},
	});
};

export const useCreateCustomOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateCustomOrderRequest) =>
			api.post<OrderDetail>('/orders/custom', payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
		},
	});
};

export const useUpdateCustomOrder = (orderId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: UpdateCustomOrderRequest) =>
			api.patch<OrderDetail>(`/orders/custom/${orderId}`, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
			queryClient.invalidateQueries({ queryKey: orderKeys.workflowBoard });
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};

export const useCreateWorkOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: WorkOrderRequest) =>
			api.post<OrderDetail>('/orders/work', payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
		},
	});
};

export const useUpdateWorkOrder = (orderId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: WorkOrderRequest) =>
			api.patch<OrderDetail>(`/orders/work/${orderId}`, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
			queryClient.invalidateQueries({ queryKey: orderKeys.workflowBoard });
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};

export const useDeleteOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orderId: string) => api.del<{ id: string }>(`/orders/${orderId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
			queryClient.invalidateQueries({ queryKey: orderKeys.workflowBoard });
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};
