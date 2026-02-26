import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { MaterialsReport } from '@/types/api';

const materialsKeys = {
	report: ['materials-report'] as const,
};

export const useMaterialsReport = () => {
	return useQuery({
		queryKey: materialsKeys.report,
		queryFn: () => api.get<MaterialsReport>('/reports/materials'),
	});
};
