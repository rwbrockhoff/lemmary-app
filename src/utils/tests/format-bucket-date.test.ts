import { describe, it, expect } from 'vitest';
import { formatBucketDate } from '../format-bucket-date';

describe('formatBucketDate', () => {
	describe('month bucket', () => {
		it('renders bare month name for axis labels', () => {
			expect(formatBucketDate('2026-02-01', 'month')).toBe('Feb');
		});

		it('renders month with full year when includeYear is true', () => {
			expect(formatBucketDate('2026-02-01', 'month', true)).toBe('Feb 2026');
		});

		// a Jan 1 date was slipping back to Dec depending on the timezone
		it('treats the YYYY-MM-DD string as a local date, not UTC', () => {
			expect(formatBucketDate('2026-01-01', 'month')).toBe('Jan');
		});
	});

	describe('week bucket', () => {
		it('shows a date range when start and end fall in the same month', () => {
			expect(formatBucketDate('2026-01-04', 'week')).toBe('Jan 4 - 10');
		});

		it('expands the end label when the week crosses a month boundary', () => {
			expect(formatBucketDate('2026-01-28', 'week')).toBe('Jan 28 - Feb 3');
		});

		it('appends the year for tooltip context', () => {
			expect(formatBucketDate('2026-01-04', 'week', true)).toBe('Jan 4 - 10, 2026');
		});
	});

	describe('day bucket', () => {
		it('renders month and day for axis labels', () => {
			expect(formatBucketDate('2026-03-15', 'day')).toBe('Mar 15');
		});

		it('appends the year for tooltip context', () => {
			expect(formatBucketDate('2026-03-15', 'day', true)).toBe('Mar 15, 2026');
		});
	});
});
