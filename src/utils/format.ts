export function formatDate(dateString: string) {
	return new Date(dateString).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		timeZone: 'UTC',
	});
}

export function formatRelativeTime(dateString: string) {
	const now = Date.now();
	const then = new Date(dateString).getTime();
	const seconds = Math.floor((now - then) / 1000);

	if (seconds < 60) return 'just now';

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;

	const days = Math.floor(hours / 24);
	return `${days}d ago`;
}

export function formatCurrency(amount: string | number | null) {
	if (amount === null || amount === undefined || amount === '') return '—';
	return Number(amount).toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export function formatCurrencyShort(amount: string | number | null) {
	if (amount === null || amount === undefined || amount === '') return '—';
	return Number(amount).toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});
}
