import type { LineItemPayload } from '../components/order-form/line-item-values';

// order_title stays required so request is usable for create and update
export type WorkOrderRequest = {
	order_title: string;
	order_description?: string | null;
	order_date?: string;
	due_date?: string | null;
	items: LineItemPayload[];
};
