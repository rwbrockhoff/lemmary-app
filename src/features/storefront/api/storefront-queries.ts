import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { storefrontKeys } from './storefront-keys';
import type { ProductDetail, ProductsResponse } from '@/types/api';

export const useProducts = () => {
	return useQuery({
		queryKey: storefrontKeys.all,
		queryFn: () => api.get<ProductsResponse>('/products'),
	});
};

export const useProduct = (productId: string) => {
	return useQuery({
		queryKey: storefrontKeys.detail(productId),
		queryFn: () => api.get<ProductDetail>(`/products/${productId}`),
	});
};

export const useSyncProducts = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => api.post<{ synced: number }>('/products/sync'),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: storefrontKeys.all });
		},
	});
};
