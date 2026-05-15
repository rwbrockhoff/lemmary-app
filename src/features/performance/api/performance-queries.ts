import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from '@/api/client';

export const VALID_RANGES = ['30', '90', '365'] as const;
export type PerformanceRange = (typeof VALID_RANGES)[number];

export type StageBottleneckStage = {
	stageId: string;
	stageName: string;
	stageColor: string | null;
	avgDays: number;
	transitionCount: number;
};

export type TopProduct = {
	productName: string;
	totalUnits: number;
	totalRevenue: number;
	orderCount: number;
};

export type CustomerMix = {
	newCount: number;
	returningCount: number;
	totalCount: number;
	priorNewCount: number;
	priorReturningCount: number;
	priorTotalCount: number;
};

export type PerformanceData = {
	stageBottleneck: {
		stages: StageBottleneckStage[];
	};
	topProducts: {
		products: TopProduct[];
	};
	customerMix: CustomerMix;
};

export const performanceKey = (range: PerformanceRange) =>
	['performance', range] as const;

export const usePerformance = (range: PerformanceRange) => {
	return useQuery({
		queryKey: performanceKey(range),
		queryFn: () => api.get<PerformanceData>('/analytics/performance', { range }),
		staleTime: 60 * 1000,
		placeholderData: keepPreviousData,
	});
};
