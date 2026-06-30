export type DateRangeValue = { start: string; end: string };

export type RangePreset = {
	id: string;
	label: string;
	range: (today: string) => DateRangeValue;
};

const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
const lastDayOfMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

const isoInTz = (date: Date, timeZone: string) =>
	new Intl.DateTimeFormat('en-CA', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(date);

export const RANGE_PRESETS: RangePreset[] = [
	{
		id: 'thisMonth',
		label: 'This Month',
		range: (today) => {
			const [y, m] = today.split('-').map(Number);
			return { start: ymd(y, m, 1), end: today };
		},
	},
	{
		id: 'lastMonth',
		label: 'Last Month',
		range: (today) => {
			const [y, m] = today.split('-').map(Number);
			const month = m === 1 ? 12 : m - 1;
			const year = m === 1 ? y - 1 : y;
			return {
				start: ymd(year, month, 1),
				end: ymd(year, month, lastDayOfMonth(year, month)),
			};
		},
	},
	{
		id: 'thisYear',
		label: 'This Year',
		range: (today) => {
			const [y] = today.split('-').map(Number);
			return { start: ymd(y, 1, 1), end: today };
		},
	},
	{
		id: 'lastYear',
		label: 'Last Year',
		range: (today) => {
			const [y] = today.split('-').map(Number);
			return { start: ymd(y - 1, 1, 1), end: ymd(y - 1, 12, 31) };
		},
	},
];

export const presetRange = (preset: RangePreset, timeZone: string): DateRangeValue =>
	preset.range(isoInTz(new Date(), timeZone));

export const defaultRange = (timeZone: string): DateRangeValue =>
	presetRange(RANGE_PRESETS[0], timeZone);
