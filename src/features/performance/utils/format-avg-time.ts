// Formats time delta in days -> hours -> minutes for better UX
// Example: 0.5 days => 12 hours, 0.5 hours => 30 min

export const formatAvgTime = (days: number) => {
	const hours = days * 24;
	if (hours < 1) return `${(hours * 60).toFixed(0)} min`;
	if (days < 1) return `${hours.toFixed(1)} hours`;
	return `${days.toFixed(1)} days`;
};
