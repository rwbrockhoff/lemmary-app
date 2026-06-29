import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { bomKeys } from '@/features/storefront/api/bom-keys';
import type { MaterialLibraryItem } from '@/types/api';

export const libraryKeys = {
	report: ['materials-report'] as const,
	library: ['materials-library'] as const,
};

type CreateMaterialInput = {
	material_type_id?: string;
	material_type_name?: string;
	measurement?: MaterialLibraryItem['measurement'];
	color: string | null;
	size: string | null;
	purchase_url: string | null;
};

export const useCreateMaterial = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreateMaterialInput) => api.post('/materials', input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: libraryKeys.library });
			queryClient.invalidateQueries({ queryKey: libraryKeys.report });
			queryClient.invalidateQueries({ queryKey: bomKeys.materialTypes });
		},
	});
};

export const useMaterials = () => {
	return useQuery({
		queryKey: libraryKeys.library,
		queryFn: () => api.get<MaterialLibraryItem[]>('/materials'),
	});
};

export const useUpdateMaterial = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			materialId,
			...data
		}: {
			materialId: string;
			color: string | null;
			size: string | null;
			purchase_url: string | null;
		}) => api.patch(`/materials/${materialId}`, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: libraryKeys.library });
			queryClient.invalidateQueries({ queryKey: libraryKeys.report });
		},
	});
};

export const useDeleteMaterial = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (materialId: string) => api.del(`/materials/${materialId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: libraryKeys.library });
			queryClient.invalidateQueries({ queryKey: libraryKeys.report });
		},
	});
};
