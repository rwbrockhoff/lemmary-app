type BadgeColor = 'neutral' | 'info' | 'success';

export function getProgressColor(completed: number, total: number): BadgeColor {
	if (completed >= total && total > 0) return 'success';
	if (completed > 0) return 'info';
	return 'neutral';
}

export const BATCH_STATUSES = ['Active', 'Up Next', 'Paused', 'Completed'] as const;

export function getBatchStatusColor(status: string): BadgeColor {
	switch (status) {
		case 'Completed': return 'success';
		case 'Active': return 'info';
		default: return 'neutral';
	}
}
