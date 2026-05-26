import type { OrderWithItems } from '@/types/api';

type BadgeColor = 'neutral' | 'info' | 'success';

export function getPendingOrders(orders: OrderWithItems[] | undefined): OrderWithItems[] {
	return (orders ?? [])
		.filter((o) => o.fulfillment_status === 'pending')
		.sort((a, b) => new Date(a.order_date).getTime() - new Date(b.order_date).getTime());
}

export function getProgressColor(completed: number, total: number): BadgeColor {
	if (completed >= total && total > 0) return 'success';
	if (completed > 0) return 'info';
	return 'neutral';
}

export const BATCH_STATUSES = ['Active', 'Up Next', 'Paused', 'Completed'] as const;

export function getBatchStatusColor(status: string): BadgeColor {
	switch (status) {
		case 'Completed':
			return 'success';
		case 'Active':
			return 'info';
		default:
			return 'neutral';
	}
}
