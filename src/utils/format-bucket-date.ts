type Bucket = 'day' | 'week' | 'month';

// Treats a YYYY-MM-DD string as a local calendar day
const parseLocalDate = (iso: string) => {
	const [year, month, day] = iso.split('-').map(Number);
	return new Date(year, month - 1, day);
};

export const formatBucketDate = (iso: string, bucket: Bucket, includeYear = false) => {
	const start = parseLocalDate(iso);
	const yearSuffix = includeYear ? `, ${start.getFullYear()}` : '';

	if (bucket === 'month') {
		const month = start.toLocaleDateString('en-US', { month: 'short' });
		return includeYear ? `${month} ${start.getFullYear()}` : month;
	}

	if (bucket === 'week') {
		const end = new Date(start);
		end.setDate(start.getDate() + 6);
		const sameMonth = start.getMonth() === end.getMonth();
		const startLabel = start.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		});
		const endLabel = sameMonth
			? end.toLocaleDateString('en-US', { day: 'numeric' })
			: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
		return `${startLabel} - ${endLabel}${yearSuffix}`;
	}

	const dayLabel = start.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	});
	return `${dayLabel}${yearSuffix}`;
};
