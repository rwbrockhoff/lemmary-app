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
