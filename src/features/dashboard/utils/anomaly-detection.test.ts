import { describe, it, expect } from 'vitest';
import { generatePeriodStats, detectAnomaly, type TrendPoint } from './anomaly-detection';

const point = (overrides: Partial<TrendPoint> = {}): TrendPoint => ({
	count: 0,
	revenue: '0',
	avgOrderValue: '0',
	...overrides,
});

describe('generatePeriodStats', () => {
	it('returns zeros when there are no points', () => {
		expect(generatePeriodStats([])).toEqual({
			avgOrdersPerDay: 0,
			avgAov: 0,
		});
	});

	it('averages orders per active day, ignoring zero-count days', () => {
		const stats = generatePeriodStats([
			point({ count: 10, revenue: '500' }),
			point({ count: 0, revenue: '0' }),
			point({ count: 6, revenue: '300' }),
		]);

		// 16 orders / 2 active days = 8
		expect(stats.avgOrdersPerDay).toBe(8);
		// $800 / 16 orders = $50
		expect(stats.avgAov).toBe(50);
	});

	it('treats a period with no orders as zero AOV', () => {
		const stats = generatePeriodStats([point({ count: 0 })]);
		expect(stats.avgAov).toBe(0);
	});
});

describe('detectAnomaly', () => {
	// 10 orders/day average, $50 avg order value
	const stats = { avgOrdersPerDay: 10, avgAov: 50 };

	it('returns null when the point has no orders', () => {
		expect(detectAnomaly(point({ count: 0 }), stats)).toBeNull();
	});

	it('returns null when period stats are zero (no baseline to compare against)', () => {
		const empty = { avgOrdersPerDay: 0, avgAov: 0 };
		expect(detectAnomaly(point({ count: 5, avgOrderValue: '50' }), empty)).toBeNull();
	});

	it('flags a spike when orders are below 70% but AOV is above 130% of the period average', () => {
		const p = point({ count: 5, avgOrderValue: '80' });
		expect(detectAnomaly(p, stats)).toBe('spike');
	});

	it('flags a dip when orders are above 130% but AOV is below 70% of the period average', () => {
		const p = point({ count: 15, avgOrderValue: '30' });
		expect(detectAnomaly(p, stats)).toBe('dip');
	});

	it('returns null when only one ratio crosses the threshold', () => {
		// Low orders but normal AOV
		const lowOrdersOnly = point({ count: 5, avgOrderValue: '50' });
		expect(detectAnomaly(lowOrdersOnly, stats)).toBeNull();

		// High orders but normal AOV
		const highOrdersOnly = point({ count: 15, avgOrderValue: '50' });
		expect(detectAnomaly(highOrdersOnly, stats)).toBeNull();
	});
});
