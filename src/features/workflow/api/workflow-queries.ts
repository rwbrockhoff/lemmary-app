import {
	useQuery,
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query';
import { api } from '@/api/client';
import { orderKeys } from '@/features/orders/api/orders-keys';
import { batchKeys } from '@/features/batches/api/batches-keys';
import { optimisticallyUpdateOrderStage, rollbackOrderStage } from './workflow-cache';
import type {
	WorkflowStage,
	WorkflowBoardResponse,
	StageOrdersResponse,
} from '@/types/api';

export const useOrderStages = () => {
	return useQuery({
		queryKey: orderKeys.orderStages,
		queryFn: () => api.get<WorkflowStage[]>('/workflow/order-stages'),
	});
};

export const useItemStages = () => {
	return useQuery({
		queryKey: orderKeys.itemStages,
		queryFn: () => api.get<WorkflowStage[]>('/workflow/item-stages'),
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
			api.put<WorkflowStage>(`/workflow/order-stages/${stageId}`, { name, color }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.orderStages });
		},
	});
};

export const useCreateWorkflowStage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params: { name: string; color?: string }) =>
			api.post<WorkflowStage>('/workflow/order-stages', params),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.orderStages });
		},
	});
};

export const useDeleteWorkflowStage = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (stageId: string) =>
			api.del<{ id: string }>(`/workflow/order-stages/${stageId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.orderStages });
		},
	});
};

export const useReorderWorkflowStages = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orderedIds: string[]) =>
			api.put('/workflow/order-stages/position', { orderedIds }),
		onMutate: async (orderedIds) => {
			await queryClient.cancelQueries({ queryKey: orderKeys.orderStages });

			const previous = queryClient.getQueryData<WorkflowStage[]>(orderKeys.orderStages);

			if (previous) {
				const stageMap = new Map(previous.map((s) => [s.id, s]));
				const reordered = orderedIds
					.map((id, index) => {
						const stage = stageMap.get(id);
						return stage ? { ...stage, position: index } : null;
					})
					.filter((s): s is WorkflowStage => s !== null);

				queryClient.setQueryData<WorkflowStage[]>(orderKeys.orderStages, reordered);
			}

			return { previous };
		},
		onError: (_error, _variables, context) => {
			if (context?.previous) {
				queryClient.setQueryData(orderKeys.orderStages, context.previous);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: orderKeys.orderStages });
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
			// skip workflowBoard refetch - optimistic update already updates position & stage_id
			queryClient.invalidateQueries({
				queryKey: orderKeys.detail(variables.orderId),
			});
			queryClient.invalidateQueries({ queryKey: orderKeys.all });
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};

const STAGE_PAGE_SIZE = 10;
// the workflow board response already includes the first page of completed
// orders, so infinite pagination starts after that
const INITIAL_OFFSET = 10;

export const stageOrderKeys = {
	all: ['workflow-stage-orders'] as const,
	byStage: (stageId: string) => ['workflow-stage-orders', stageId] as const,
};

export const useStageOrders = (stageId: string, enabled: boolean) => {
	return useInfiniteQuery({
		queryKey: stageOrderKeys.byStage(stageId),
		queryFn: ({ pageParam }) =>
			api.get<StageOrdersResponse>(`/orders/workflow-board/stages/${stageId}/orders`, {
				limit: String(STAGE_PAGE_SIZE),
				offset: String(pageParam),
			}),
		initialPageParam: INITIAL_OFFSET,
		getNextPageParam: (lastPage, _allPages, lastPageParam) =>
			lastPage.hasMore ? lastPageParam + STAGE_PAGE_SIZE : undefined,
		enabled,
	});
};
