import type { OrderDetail, Product } from '@/types/api';
import type { WorkOrderRequest } from '../../types/work-order-types';
import type { WorkOrderFormData } from '../../schemas/work-order-schemas';
import {
	emptyLineItem,
	orderItemToLineItem,
	lineItemToPayload,
} from '../order-form/line-item-values';

const today = () => new Date().toISOString().slice(0, 10);

const toDateInput = (value: string | null): string => (value ? value.slice(0, 10) : '');

export const emptyWorkOrderValues = (): WorkOrderFormData => ({
	orderTitle: '',
	orderDescription: '',
	orderDate: today(),
	dueDate: '',
	items: [emptyLineItem()],
});

export const workOrderToFormValues = (
	order: OrderDetail,
	products: Product[],
): WorkOrderFormData => ({
	orderTitle: order.order_title ?? '',
	orderDescription: order.order_description ?? '',
	orderDate: toDateInput(order.order_date),
	dueDate: order.due_date ? toDateInput(order.due_date) : '',
	items: order.items.map((item) => orderItemToLineItem(item, products)),
});

export const toWorkOrderPayload = (
	data: WorkOrderFormData,
	products: Product[],
): WorkOrderRequest => ({
	order_title: data.orderTitle,
	order_description: data.orderDescription || null,
	order_date: data.orderDate || undefined,
	due_date: data.dueDate || null,
	items: data.items.map((item) => lineItemToPayload(item, products)),
});
