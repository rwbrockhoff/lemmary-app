import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { ApiResponse, ProductionSummaryItem } from '@/types/api';

const productionKeys = {
	summary: ['production-summary'] as const,
};

export const useProductionSummary = () => {
	return useQuery({
		queryKey: productionKeys.summary,
		queryFn: async () => {
			const response = await api<ApiResponse<ProductionSummaryItem[]>>(
				'/reports/production-summary',
			);
			return response.data;
		},
	});
};
