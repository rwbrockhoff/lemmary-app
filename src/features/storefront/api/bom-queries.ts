import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { bomKeys } from './bom-keys';
import type {
	BomMaterialType,
	BomItem,
	BomSuggestion,
	Material,
	MaterialCatalogEntry,
} from '@/types/api';

export const useMaterialTypes = () => {
	return useQuery({
		queryKey: bomKeys.materialTypes,
		queryFn: () => api.get<BomMaterialType[]>('/bom/material-types'),
	});
};

export const useVariantBom = (variantId: string) => {
	return useQuery({
		queryKey: bomKeys.forVariant(variantId),
		queryFn: () => api.get<BomItem[]>(`/bom?variantId=${variantId}`),
	});
};

export const useSearchMaterialTypes = (
	query: string,
	measurement: string,
) => {
	return useQuery({
		queryKey: bomKeys.materialTypeSearch(query, measurement),
		queryFn: () =>
			api.get<BomMaterialType[]>(
				`/bom/material-types/search?q=${encodeURIComponent(query)}&measurement=${measurement}`,
			),
		enabled: query.length >= 1,
	});
};

export const useSearchMaterialCatalog = (
	query: string,
	measurement: string,
) => {
	return useQuery({
		queryKey: bomKeys.materialCatalog(query, measurement),
		queryFn: () =>
			api.get<MaterialCatalogEntry[]>(
				`/bom/materials/catalog?q=${encodeURIComponent(query)}&measurement=${measurement}`,
			),
		enabled: query.length >= 1,
	});
};

export const useSearchMaterials = (
	materialTypeId: string,
	query: string,
) => {
	return useQuery({
		queryKey: bomKeys.materialSearch(materialTypeId, query),
		queryFn: () =>
			api.get<(Material & { material_type_name: string })[]>(
				`/bom/materials/search?materialTypeId=${materialTypeId}&q=${encodeURIComponent(query)}`,
			),
		enabled: materialTypeId.length > 0 && query.length >= 1,
	});
};

export const useBomSuggestions = (query: string) => {
	return useQuery({
		queryKey: bomKeys.suggestions(query),
		queryFn: () => api.get<BomSuggestion[]>(`/bom/suggestions?q=${query}`),
		enabled: query.length >= 2,
	});
};

export const useCreateBomItem = (variantId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (
			item: Pick<
				BomItem,
				| 'measurement'
				| 'platform_sku'
				| 'product_name'
				| 'variant'
				| 'piece'
				| 'length'
				| 'quantity'
				| 'material_id'
			>,
		) => api.post<BomItem>('/bom', item),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: bomKeys.forVariant(variantId),
			});
		},
	});
};

export const useUpdateBomItem = (variantId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			bomItemId,
			...data
		}: {
			bomItemId: string;
			piece: string;
			length: string | null;
			quantity: number;
			measurement: string;
			material_type_id: string | null;
			material_type_name: string | null;
			color: string | null;
			size: string | null;
			purchase_url: string | null;
		}) => api.put<BomItem>(`/bom/${bomItemId}`, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: bomKeys.forVariant(variantId),
			});
		},
	});
};

export const useDeleteBomItem = (variantId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (bomItemId: string) => api.del(`/bom/${bomItemId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: bomKeys.forVariant(variantId),
			});
		},
	});
};

export const useCopyBomFromVariant = (targetVariantId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (sourceVariantId: string) =>
			api.post<BomItem[]>('/bom/copy', {
				targetVariantId,
				sourceVariantId,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: bomKeys.forVariant(targetVariantId),
			});
		},
	});
};

export const useGetOrCreateMaterial = () => {
	return useMutation({
		mutationFn: (input: {
			material_type_id: string;
			color: string | null;
			size: string | null;
			purchase_url: string | null;
		}) => api.post<Material>('/bom/materials', input),
	});
};
