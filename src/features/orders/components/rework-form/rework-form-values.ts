import type { OrderDetail, Product } from '@/types/api';
import type { UpdateReworkRequest } from '../../types/rework-types';
import type { ReworkFormData } from '../../schemas/rework-schemas';
import { orderItemToLineItem, lineItemToPayload } from '../order-form/line-item-values';

const toDateInput = (value: string | null): string => (value ? value.slice(0, 10) : '');

export const reworkToFormValues = (
	order: OrderDetail,
	products: Product[],
): ReworkFormData => ({
	reworkReason: order.rework_reason ?? 'defect',
	dueDate: toDateInput(order.due_date),
	orderNotes: order.order_notes ?? '',
	items: order.items.map((item) => orderItemToLineItem(item, products)),
});

export const toReworkPayload = (
	data: ReworkFormData,
	products: Product[],
): UpdateReworkRequest => ({
	rework_reason: data.reworkReason,
	due_date: data.dueDate || null,
	order_notes: data.orderNotes || null,
	items: data.items.map((item) => lineItemToPayload(item, products)),
});
