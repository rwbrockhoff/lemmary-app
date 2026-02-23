export function formatDate(dateString: string) {
	return new Date(dateString).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

export function formatCurrency(amount: string | null) {
	if (!amount) return '—';
	return `$${Number(amount).toFixed(2)}`;
}
