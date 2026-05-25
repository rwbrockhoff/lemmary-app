import {
	useQuery,
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query';
import { api } from '@/api/client';
import { orderKeys } from './orders-keys';
import { batchKeys } from '@/features/batches/api/batches-keys';
import {
	optimisticallyUpdateOrderStage,
	optimisticallyUpdateItemStage,
	rollbackOrderStage,
	rollbackOrderDetail,
} from './orders-cache';
import type {
	OrderDetail,
	GetOrdersResponse,
	WorkflowStage,
	WorkflowStagesResponse,
	WorkflowBoardResponse,
} from '@/types/api';

export const useOrdersWithItems = () => {
	return useQuery({
		queryKey: orderKeys.withItems,
		queryFn: () => api.get<GetOrdersResponse>('/orders', { status: 'pending' }),
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

export const useWorkflowStages = () => {
	return useQuery({
		queryKey: orderKeys.workflowStages,
		queryFn: () => api.get<WorkflowStagesResponse>('/workflow-stages'),
	});
};

type UpdateWorkflowStagePayload = {
	stageId: string;
	name?: string;
	color?: string;
};

export const useUpdateWorkflowStage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ stageId, name, color }: UpdateWorkflowStagePayload) =>
			api.put<WorkflowStage>(`/workflow-stages/${stageId}`, { name, color }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.workflowStages });
		},
	});
};

export const useCreateWorkflowStage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params: { name: string; color?: string }) =>
			api.post<WorkflowStage>('/workflow-stages', params),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.workflowStages });
		},
	});
};

export const useDeleteWorkflowStage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (stageId: string) =>
			api.del<{ id: string }>(`/workflow-stages/${stageId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.workflowStages });
		},
	});
};

export const useReorderWorkflowStages = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orderedIds: string[]) =>
			api.put('/workflow-stages/reorder', { orderedIds }),
		onMutate: async (orderedIds) => {
			await queryClient.cancelQueries({ queryKey: orderKeys.workflowStages });

			const previous = queryClient.getQueryData<WorkflowStagesResponse>(
				orderKeys.workflowStages,
			);

			if (previous) {
				const stageMap = new Map(previous.orderStages.map((s) => [s.id, s]));
				const reordered = orderedIds
					.map((id, index) => {
						const stage = stageMap.get(id);
						return stage ? { ...stage, position: index } : null;
					})
					.filter((s): s is WorkflowStage => s !== null);

				queryClient.setQueryData<WorkflowStagesResponse>(orderKeys.workflowStages, {
					...previous,
					orderStages: reordered,
				});
			}

			return { previous };
		},
		onError: (_error, _variables, context) => {
			if (context?.previous) {
				queryClient.setQueryData(orderKeys.workflowStages, context.previous);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.workflowStages });
		},
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
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
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
