import type { BreadcrumbSegment } from '@/components/breadcrumbs';

export function getOrderBreadcrumbs(
	from: string | null,
	batchId: string | null,
): BreadcrumbSegment[] {
	if (from === 'batch' && batchId) {
		return [
			{ label: 'Batches', to: '/batches' },
			{ label: 'Batch', to: `/batches/${batchId}` },
		];
	}

	if (from === 'workflow') {
		return [{ label: 'Workflow', to: '/workflow' }];
	}

	return [{ label: 'Orders', to: '/orders' }];
}
