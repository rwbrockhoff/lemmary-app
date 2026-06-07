import type { OrderType } from '@/types/api';

export const ORDER_TYPE_DISPLAY: Record<
	Exclude<OrderType, 'platform'>,
	{ label: string; color: string }
> = {
	custom: { label: 'Custom', color: 'marigold' },
	work: { label: 'Work order', color: 'coral' },
};
