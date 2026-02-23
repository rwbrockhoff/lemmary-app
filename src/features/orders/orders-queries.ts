import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { ApiResponse, OrdersResponse } from '@/types/api';

const orderKeys = {
	all: ['orders'] as const,
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
