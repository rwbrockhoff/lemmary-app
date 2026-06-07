import type { OrderDetail, Product } from '@/types/api';
import type { UpdateCustomOrderRequest } from '../../types/custom-order-types';
import type { CustomOrderFormData } from '../../schemas/custom-order-schemas';
import {
	emptyLineItem,
	orderItemToLineItem,
	lineItemToPayload,
} from '../order-form/line-item-values';

const today = () => new Date().toISOString().slice(0, 10);

// The API sends ISO timestamps, but date inputs need a plain YYYY-MM-DD value
const toDateInput = (value: string | null): string => (value ? value.slice(0, 10) : '');

export const emptyCustomOrderValues = (): CustomOrderFormData => ({
	customerName: '',
	customerEmail: '',
	orderDate: today(),
	dueDate: '',
	orderNotes: '',
	items: [emptyLineItem()],
});

export const orderToFormValues = (
	order: OrderDetail,
	products: Product[],
): CustomOrderFormData => ({
	customerName: order.customer_name ?? '',
	customerEmail: order.customer_email ?? '',
	orderDate: toDateInput(order.order_date),
	dueDate: order.due_date ? toDateInput(order.due_date) : '',
	orderNotes: order.order_notes ?? '',
	items: order.items.map((item) => orderItemToLineItem(item, products)),
});

export const toCustomOrderPayload = (
	data: CustomOrderFormData,
	products: Product[],
): UpdateCustomOrderRequest => ({
	customer_name: data.customerName,
	customer_email: data.customerEmail || null,
	order_date: data.orderDate || undefined,
	due_date: data.dueDate || null,
	order_notes: data.orderNotes || null,
	items: data.items.map((item) => lineItemToPayload(item, products)),
});
