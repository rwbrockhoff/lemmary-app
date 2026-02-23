type BadgeColor = 'neutral' | 'info' | 'success';

export function getProgressColor(completed: number, total: number): BadgeColor {
	if (completed >= total && total > 0) return 'success';
	if (completed > 0) return 'info';
	return 'neutral';
}
