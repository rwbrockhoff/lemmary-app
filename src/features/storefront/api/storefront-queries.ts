import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { storefrontKeys } from './storefront-keys';
import type { ProductDetail, ProductsResponse, ProductionType } from '@/types/api';

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

export const useUpdateProductProductionType = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			productId,
			productionType,
		}: {
			productId: string;
			productionType: ProductionType;
		}) =>
			api.patch<{ updated: number }>(`/products/${productId}/variants`, {
				productionType,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: storefrontKeys.all });
		},
	});
};

export const useUpdateVariantProductionType = (productId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			variantId,
			productionType,
		}: {
			variantId: string;
			productionType: ProductionType;
		}) =>
			api.patch<{ id: string; production_type: ProductionType }>(
				`/products/${productId}/variants/${variantId}`,
				{ productionType },
			),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: storefrontKeys.detail(productId),
			});
			queryClient.invalidateQueries({ queryKey: storefrontKeys.all });
		},
	});
};
