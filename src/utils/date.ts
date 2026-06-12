// Convert between a 'YYYY-MM-DD' form value and a Date object

// The DatePicker works with Dates and shows them in local time, so we stay in
// local date space to keep the calendar day from shifting

export const parseDateValue = (value: string | undefined): Date | undefined => {
	if (!value) return undefined;
	const [year, month, day] = value.split('-').map(Number);
	if (!year || !month || !day) return undefined;
	return new Date(year, month - 1, day);
};

export const formatDateValue = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};
