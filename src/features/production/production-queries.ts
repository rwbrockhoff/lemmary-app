import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { ProductionSummaryItem, MaterialsReport } from '@/types/api';

const productionKeys = {
	summary: ['production-summary'] as const,
	materialsReport: ['materials-report'] as const,
};

export const useProductionSummary = () => {
	return useQuery({
		queryKey: productionKeys.summary,
		queryFn: () => api.get<ProductionSummaryItem[]>('/reports/production-summary'),
	});
};

export const useMaterialsReport = () => {
	return useQuery({
		queryKey: productionKeys.materialsReport,
		queryFn: () => api.get<MaterialsReport>('/reports/materials'),
	});
};
