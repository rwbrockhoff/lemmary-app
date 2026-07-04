import type { OrderType } from '@/types/api';

export const FULFILLMENT_STATUS = {
	PENDING: 'pending',
	FULFILLED: 'fulfilled',
} as const;

/** An order is locked once it's no longer pending fulfillment. */
export const isOrderLocked = (order: { fulfillment_status: string }): boolean =>
	order.fulfillment_status !== FULFILLMENT_STATUS.PENDING;

/** platform and custom orders are real customer sales that can be redone. */
export const isSalesOrder = (order: { order_type: OrderType }): boolean =>
	order.order_type === 'platform' || order.order_type === 'custom';

export type DueUrgency = 'overdue' | 'soon' | null;

const SOON_WINDOW_DAYS = 3;

/** Flags a due date as overdue, due soon (within 3 days), or neither. */
export const getDueUrgency = (dueDate: string | null): DueUrgency => {
	if (!dueDate) return null;
	const today = new Date();
	const todayStr = today.toLocaleDateString('en-CA');
	if (dueDate < todayStr) return 'overdue';

	const soon = new Date(today);
	soon.setDate(soon.getDate() + SOON_WINDOW_DAYS);
	if (dueDate <= soon.toLocaleDateString('en-CA')) return 'soon';

	return null;
};

type NamedOrder = {
	order_type: OrderType;
	order_title: string | null;
	customer_name: string | null;
};

/** Work orders have a title instead of a customer. */
export const getOrderDisplayName = (order: NamedOrder): string =>
	order.order_type === 'work'
		? (order.order_title ?? 'Work order')
		: (order.customer_name ?? '—');

export const ORDER_TYPE_DISPLAY: Record<
	Exclude<OrderType, 'platform'>,
	{ label: string; color: string }
> = {
	custom: { label: 'Custom', color: 'marigold' },
	work: { label: 'Work order', color: 'cobalt' },
	rework: { label: 'Redo', color: 'coral' },
};
