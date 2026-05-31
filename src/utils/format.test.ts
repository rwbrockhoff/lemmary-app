import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatCurrency, formatCurrencyShort, formatRelativeTime } from './format';

describe('formatCurrency', () => {
	it('formats numeric values as USD with two decimals', () => {
		expect(formatCurrency(42)).toBe('$42.00');
		expect(formatCurrency('100.5')).toBe('$100.50');
	});

	it('returns an em dash when the amount is null, undefined, or empty', () => {
		expect(formatCurrency(null)).toBe('—');
		expect(formatCurrency('')).toBe('—');
	});
});

describe('formatCurrencyShort', () => {
	it('rounds to whole dollars with no decimals', () => {
		expect(formatCurrencyShort(42.6)).toBe('$43');
		expect(formatCurrencyShort('100.49')).toBe('$100');
	});

	it('returns an em dash for missing values', () => {
		expect(formatCurrencyShort(null)).toBe('—');
		expect(formatCurrencyShort('')).toBe('—');
	});
});

describe('formatRelativeTime', () => {
	beforeEach(() => {
		// Lock the clock so deltas are deterministic
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2026-05-31T12:00:00Z'));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('returns "just now" for deltas under a minute', () => {
		const thirtySecondsAgo = new Date('2026-05-31T11:59:30Z').toISOString();
		expect(formatRelativeTime(thirtySecondsAgo)).toBe('just now');
	});

	it('returns minutes when the delta is under an hour', () => {
		const fifteenMinutesAgo = new Date('2026-05-31T11:45:00Z').toISOString();
		expect(formatRelativeTime(fifteenMinutesAgo)).toBe('15m ago');
	});

	it('returns hours when the delta is under a day', () => {
		const fourHoursAgo = new Date('2026-05-31T08:00:00Z').toISOString();
		expect(formatRelativeTime(fourHoursAgo)).toBe('4h ago');
	});

	it('returns days for older deltas', () => {
		const threeDaysAgo = new Date('2026-05-28T12:00:00Z').toISOString();
		expect(formatRelativeTime(threeDaysAgo)).toBe('3d ago');
	});
});
