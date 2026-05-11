import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from '@/api/client';

export type DashboardRange = '30' | '90' | '365';
export type DashboardBucket = 'day' | 'week' | 'month';

export type DashboardData = {
	range: number;
	bucket: DashboardBucket;
	revenue: {
		current: string;
		previous: string;
		changePercent: number;
	};
	ordersInProgress: number;
	ordersCompletedInPeriod: number;
	avgLeadTime: {
		days: number | null;
		target: number | null;
	};
	dueSoon: Array<{
		id: string;
		orderNumber: string;
		customerName: string;
		orderDate: string;
		dueDate: string | null;
		daysUntilDue: number | null;
		grandTotal: string | null;
	}>;
	ordersTrend: Array<{
		date: string;
		count: number;
		revenue: string;
	}>;
};

export const dashboardKey = (range: DashboardRange) => ['dashboard', range] as const;

export const useDashboard = (range: DashboardRange) => {
	return useQuery({
		queryKey: dashboardKey(range),
		queryFn: () => api.get<DashboardData>('/dashboard', { range }),
		staleTime: 60 * 1000,
		placeholderData: keepPreviousData,
	});
};
