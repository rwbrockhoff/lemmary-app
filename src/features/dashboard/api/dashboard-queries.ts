import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';

export type DashboardData = {
	thisMonthRevenue: {
		current: string;
		previousMonth: string;
		changePercent: number;
	};
	ordersInProgress: number;
	ordersCompletedThisMonth: number;
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
	ordersByDay: Array<{
		date: string;
		count: number;
		revenue: string;
	}>;
};

export const dashboardKey = ['dashboard'] as const;

export const useDashboard = () => {
	return useQuery({
		queryKey: dashboardKey,
		queryFn: () => api.get<DashboardData>('/dashboard'),
		staleTime: 60 * 1000,
	});
};
