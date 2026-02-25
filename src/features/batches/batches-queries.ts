import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { ApiResponse, Batch, BatchDetail } from '@/types/api';

export const batchKeys = {
	all: ['batches'] as const,
	detail: (batchId: string) => ['batches', batchId] as const,
};

export const useBatches = () => {
	return useQuery({
		queryKey: batchKeys.all,
		queryFn: async () => {
			const response = await api<ApiResponse<Batch[]>>('/batches');
			return response.data;
		},
	});
};

export const useBatch = (batchId: string) => {
	return useQuery({
		queryKey: batchKeys.detail(batchId),
		queryFn: async () => {
			const response = await api<ApiResponse<BatchDetail>>(
				`/batches/${batchId}`,
			);
			return response.data;
		},
	});
};

export const useToggleComplete = (batchId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: {
			type: 'orders' | 'items' | 'materials';
			id: string;
			completed: boolean;
		}) => {
			return api(`/batches/${batchId}/${params.type}/${params.id}`, {
				method: 'PUT',
				body: JSON.stringify({ completed: params.completed }),
			});
		},
		onSuccess: () => {
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
		mutationFn: async (params: { id: string; completedQty: number }) => {
			return api(
				`/batches/${batchId}/order-items/${params.id}/qty`,
				{
					method: 'PUT',
					body: JSON.stringify({ completedQty: params.completedQty }),
				},
			);
		},
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
		mutationFn: async (params: { id: string; completedQty: number }) => {
			return api(
				`/batches/${batchId}/materials/${params.id}/qty`,
				{
					method: 'PUT',
					body: JSON.stringify({ completedQty: params.completedQty }),
				},
			);
		},
		onSuccess: () => {
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
		mutationFn: async (body: { name: string; orderIds: string[] }) => {
			const response = await api<ApiResponse<Batch>>('/batches', {
				method: 'POST',
				body: JSON.stringify(body),
			});
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};

export const useRenameBatch = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: { batchId: string; name: string }) => {
			return api(`/batches/${params.batchId}`, {
				method: 'PUT',
				body: JSON.stringify({ name: params.name }),
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};

export const useDeleteBatch = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (batchId: string) => {
			return api(`/batches/${batchId}`, { method: 'DELETE' });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: batchKeys.all });
		},
	});
};
