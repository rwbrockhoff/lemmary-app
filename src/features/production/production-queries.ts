import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { ProductionSummaryItem } from '@/types/api';

const productionKeys = {
	summary: ['production-summary'] as const,
};

export const useProductionSummary = () => {
	return useQuery({
		queryKey: productionKeys.summary,
		queryFn: () => api.get<ProductionSummaryItem[]>('/reports/production-summary'),
	});
};
