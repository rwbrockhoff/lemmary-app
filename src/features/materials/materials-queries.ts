import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { MaterialLibraryItem, MaterialsReport } from '@/types/api';

export const materialsKeys = {
	report: ['materials-report'] as const,
	library: ['materials-library'] as const,
};

export const useMaterialsReport = () => {
	return useQuery({
		queryKey: materialsKeys.report,
		queryFn: () => api.get<MaterialsReport>('/reports/materials'),
	});
};

export const useMaterials = () => {
	return useQuery({
		queryKey: materialsKeys.library,
		queryFn: () => api.get<MaterialLibraryItem[]>('/materials'),
	});
};
