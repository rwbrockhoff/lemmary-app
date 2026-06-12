import { describe, it, expect } from 'vitest';
import type { OrderWithItems } from '@/types/api';
import { getPendingOrders, getProgressColor, getBatchStatusColor } from './batch-utils';

const buildOrder = (overrides: Partial<OrderWithItems> = {}): OrderWithItems => ({
	id: 'o1',
	store_id: 's1',
	order_type: 'platform',
	platform_order_id: 'p1',
	order_number: 'O-1',
	order_title: null,
	order_description: null,
	customer_name: 'Pam Beesly',
	customer_email: null,
	order_date: '2026-05-15T00:00:00Z',
	fulfillment_status: 'pending',
	due_date: null,
	workflow_stage_id: null,
	workflow_stage_name: null,
	workflow_stage_color: null,
	subtotal: null,
	shipping_total: null,
	grand_total: null,
	shipping_method: null,
	order_notes: null,
	order_url: null,
	fulfilled_at: null,
	tracking_number: null,
	tracking_url: null,
	carrier_name: null,
	currency: 'USD',
	batch_name: null,
	batch_id: null,
	customer_tier: null,
	item_count: 0,
	items_completed: 0,
	created_at: '',
	updated_at: '',
	items: [],
	...overrides,
});

describe('getPendingOrders', () => {
	it('returns an empty array when given undefined', () => {
		expect(getPendingOrders(undefined)).toEqual([]);
	});

	it('keeps only pending orders and sorts them oldest-first by order_date', () => {
		const result = getPendingOrders([
			buildOrder({
				id: 'newer',
				fulfillment_status: 'pending',
				order_date: '2026-05-20T00:00:00Z',
			}),
			buildOrder({
				id: 'fulfilled',
				fulfillment_status: 'fulfilled',
				order_date: '2026-05-15T00:00:00Z',
			}),
			buildOrder({
				id: 'older',
				fulfillment_status: 'pending',
				order_date: '2026-05-10T00:00:00Z',
			}),
		]);

		expect(result.map((o) => o.id)).toEqual(['older', 'newer']);
	});
});

describe('getProgressColor', () => {
	it('returns success when all items are complete', () => {
		expect(getProgressColor(5, 5)).toBe('success');
	});

	it('returns info when some items are complete', () => {
		expect(getProgressColor(2, 5)).toBe('info');
	});

	it('returns neutral when nothing is complete yet', () => {
		expect(getProgressColor(0, 5)).toBe('neutral');
	});

	it('returns neutral when the total is zero (avoids 0/0 reading as success)', () => {
		expect(getProgressColor(0, 0)).toBe('neutral');
	});
});

describe('getBatchStatusColor', () => {
	it('returns success for Completed', () => {
		expect(getBatchStatusColor('Completed')).toBe('success');
	});

	it('returns info for Active', () => {
		expect(getBatchStatusColor('Active')).toBe('info');
	});

	it('returns neutral for any other status', () => {
		expect(getBatchStatusColor('Up Next')).toBe('neutral');
		expect(getBatchStatusColor('Paused')).toBe('neutral');
	});
});
