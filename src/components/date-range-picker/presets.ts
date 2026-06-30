export type DateRangeValue = { start: string; end: string };

export type RangePreset = {
	id: string;
	label: string;
	range: (today: string) => DateRangeValue;
};

const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
const lastDayOfMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

const minusDays = (iso: string, n: number) => {
	const [y, m, d] = iso.split('-').map(Number);
	const date = new Date(Date.UTC(y, m - 1, d));
	date.setUTCDate(date.getUTCDate() - n);
	return date.toISOString().slice(0, 10);
};

const isoInTz = (date: Date, timeZone: string) =>
	new Intl.DateTimeFormat('en-CA', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(date);

export const DEFAULT_PRESET_ID = 'last30';

export const RANGE_PRESETS: RangePreset[] = [
	{
		id: 'lastWeek',
		label: 'Last Week',
		range: (today) => {
			const [y, m, d] = today.split('-').map(Number);
			const dayOfWeek = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
			const daysFromMonday = (dayOfWeek + 6) % 7;
			const thisWeekStart = minusDays(today, daysFromMonday);
			return {
				start: minusDays(thisWeekStart, 7),
				end: minusDays(thisWeekStart, 1),
			};
		},
	},
	{
		id: 'last30',
		label: 'Last 30 Days',
		range: (today) => ({ start: minusDays(today, 29), end: today }),
	},
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

export const defaultRange = (timeZone: string): DateRangeValue => {
	const preset =
		RANGE_PRESETS.find((p) => p.id === DEFAULT_PRESET_ID) ?? RANGE_PRESETS[0];
	return presetRange(preset, timeZone);
};
