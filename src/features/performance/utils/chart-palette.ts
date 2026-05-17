export const CHART_PALETTE = {
	slate: '#64748b',
	pine: '#1b633b',
	cobalt: '#1971a6',
	marigold: '#ed9c00',
	coral: '#ed503d',
	lavender: '#c98ca7',
	clay: '#c36b2b',
	sage: '#acb48c',
} as const;

export type ChartPaletteKey = keyof typeof CHART_PALETTE;

export const withAlpha = (hex: string, alpha: number): string => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
