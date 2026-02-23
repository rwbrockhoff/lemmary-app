import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { ApiResponse, MaterialsReport } from '@/types/api';

const materialsKeys = {
	report: ['materials-report'] as const,
};

export const useMaterialsReport = () => {
	return useQuery({
		queryKey: materialsKeys.report,
		queryFn: async () => {
			const response = await api<ApiResponse<MaterialsReport>>(
				'/reports/materials',
			);
			return response.data;
		},
	});
};
