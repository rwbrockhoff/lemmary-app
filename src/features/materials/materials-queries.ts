import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { MaterialLibraryItem } from '@/types/api';

export const materialsKeys = {
	report: ['materials-report'] as const,
	library: ['materials-library'] as const,
};

export const useMaterials = () => {
	return useQuery({
		queryKey: materialsKeys.library,
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
			queryClient.invalidateQueries({ queryKey: materialsKeys.library });
			queryClient.invalidateQueries({ queryKey: materialsKeys.report });
		},
	});
};

export const useDeleteMaterial = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (materialId: string) => api.del(`/materials/${materialId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: materialsKeys.library });
			queryClient.invalidateQueries({ queryKey: materialsKeys.report });
		},
	});
};
