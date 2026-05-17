export type TrendPoint = {
	count: number;
	revenue: string;
	avgOrderValue: string;
};

export type PeriodStats = {
	avgOrdersPerDay: number;
	avgAov: number;
};

const LOW_RATIO = 0.7;
const HIGH_RATIO = 1.3;

export type AnomalyType = 'spike' | 'dip' | null;

export const generatePeriodStats = (points: TrendPoint[]): PeriodStats => {
	const totalOrders = points.reduce((sum, p) => sum + p.count, 0);
	const totalRevenue = points.reduce((sum, p) => sum + Number(p.revenue), 0);
	const activeDays = points.filter((p) => p.count > 0).length;

	return {
		avgOrdersPerDay: activeDays > 0 ? totalOrders / activeDays : 0,
		avgAov: totalOrders > 0 ? totalRevenue / totalOrders : 0,
	};
};

export const detectAnomaly = (point: TrendPoint, stats: PeriodStats): AnomalyType => {
	if (point.count === 0) return null;
	if (stats.avgOrdersPerDay === 0 || stats.avgAov === 0) return null;

	const orderRatio = point.count / stats.avgOrdersPerDay;
	const aovRatio = Number(point.avgOrderValue) / stats.avgAov;

	if (orderRatio < LOW_RATIO && aovRatio > HIGH_RATIO) return 'spike';
	if (orderRatio > HIGH_RATIO && aovRatio < LOW_RATIO) return 'dip';
	return null;
};
