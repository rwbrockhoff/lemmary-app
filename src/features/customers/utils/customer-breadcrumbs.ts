import type { BreadcrumbSegment } from '@/components/breadcrumbs';

export function getCustomerBreadcrumbs(
	from: string | null,
	orderId: string | null,
): BreadcrumbSegment[] {
	if (from === 'order' && orderId) {
		return [
			{ label: 'Orders', to: '/orders' },
			{ label: 'Order', to: `/orders/${orderId}` },
		];
	}

	return [{ label: 'Orders', to: '/orders' }];
}
