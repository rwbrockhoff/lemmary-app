import { describe, it, expect } from 'vitest';
import { formatAvgTime } from './format-avg-time';

describe('formatAvgTime', () => {
	it('renders multi-day values in days with one decimal', () => {
		expect(formatAvgTime(4.2)).toBe('4.2 days');
		expect(formatAvgTime(1)).toBe('1.0 days');
	});

	it('renders sub-day values in whole hours', () => {
		expect(formatAvgTime(0.5)).toBe('12 hours');
		expect(formatAvgTime(0.63)).toBe('15 hours');
	});

	it('renders sub-hour values in minutes, rounded to whole numbers', () => {
		// 0.01 days = 14.4 minutes, rounds to 14
		expect(formatAvgTime(0.01)).toBe('14 min');
	});

	it('handles zero', () => {
		expect(formatAvgTime(0)).toBe('0 min');
	});
});
