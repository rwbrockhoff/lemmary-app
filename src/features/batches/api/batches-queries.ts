import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { batchKeys } from './batches-keys';
import {
	optimisticallyToggleComplete,
	optimisticallyUpdateMaterialQty,
	rollbackBatchDetail,
} from './batches-cache';
import type { Batch, BatchDetail } from '@/types/api';

export const useBatches = () => {
	return useQuery({
		queryKey: batchKeys.all,
		queryFn: () => api.get<Batch[]>('/batches'),
	});
};

export const useBatch = (batchId: string) => {
	return useQuery({
		queryKey: batchKeys.detail(batchId),
		queryFn: () => api.get<BatchDetail>(`/batches/${batchId}`),
	});
};

export const useToggleComplete = (batchId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params: {
			type: 'orders' | 'items' | 'materials';
			id: string;
			completed: boolean;
		}) =>
			api.put(`/batches/${batchId}/${params.type}/${params.id}`, {
				completed: params.completed,
			}),
		onMutate: (variables) =>
			optimisticallyToggleComplete(queryClient, batchId, variables),
		onError: (_error, _variables, context) => {
			rollbackBatchDetail(queryClient, batchId, context?.previous);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: batchKeys.detail(batchId),
			});
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};

export const useUpdateOrderItemQty = (batchId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params: { id: string; completedQty: number }) =>
			api.put(`/batches/${batchId}/order-items/${params.id}/qty`, {
				completedQty: params.completedQty,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: batchKeys.detail(batchId),
			});
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};

export const useUpdateMaterialQty = (batchId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params: { id: string; completedQty: number }) =>
			api.put(`/batches/${batchId}/materials/${params.id}/qty`, {
				completedQty: params.completedQty,
			}),
		onMutate: (variables) =>
			optimisticallyUpdateMaterialQty(queryClient, batchId, variables),
		onError: (_error, _variables, context) => {
			rollbackBatchDetail(queryClient, batchId, context?.previous);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: batchKeys.detail(batchId),
			});
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};

export const useCreateBatch = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (body: { name: string; orderIds: string[] }) =>
			api.post<Batch>('/batches', body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};

export const useRenameBatch = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params: { batchId: string; name: string }) =>
			api.put(`/batches/${params.batchId}`, { name: params.name }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};

export const useUpdateBatchStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (params: { batchId: string; status: string }) =>
			api.put(`/batches/${params.batchId}`, { status: params.status }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};

export const useDeleteBatch = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (batchId: string) => api.del(`/batches/${batchId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};
