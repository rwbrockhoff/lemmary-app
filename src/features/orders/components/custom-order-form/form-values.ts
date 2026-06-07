import type { OrderDetail, OrderItem, Product, VariantOption } from '@/types/api';
import type {
	UpdateCustomOrderItem,
	UpdateCustomOrderRequest,
} from '../../types/custom-order-types';
import type { CustomOrderFormData } from '../../schemas/custom-order-schemas';
import { findProductVariant, findVariantBySku } from './variant-utils';

type FormItem = CustomOrderFormData['items'][number];

const todayInput = () => new Date().toISOString().slice(0, 10);

// The API sends ISO timestamps, but date inputs need a plain YYYY-MM-DD value
const toDateInput = (value: string | null): string => (value ? value.slice(0, 10) : '');

// Products with no real variants come through as "Default", which we don't store as a label
const buildVariantLabel = (variantName: string | undefined): VariantOption[] | null => {
	if (!variantName || variantName.toLowerCase() === 'default') return null;
	return [{ name: 'Variant', value: variantName }];
};

// Order items only store the SKU, so match it back to a catalog variant to prefill the select
const orderItemToFormItem = (item: OrderItem, products: Product[]): FormItem => {
	const variant = findVariantBySku(products, item.platform_sku);
	return {
		id: item.id,
		variantId: variant?.id ?? '',
		quantity: item.quantity,
		unitPrice: item.unit_price ?? '',
	};
};

const formItemToPayloadItem = (
	item: FormItem,
	products: Product[],
): UpdateCustomOrderItem => {
	const match = findProductVariant(products, item.variantId);
	return {
		// Existing rows keep their id; new rows send undefined so the API inserts them
		id: item.id || undefined,
		product_name: match?.product.name ?? '',
		platform_sku: match?.variant.platform_sku ?? null,
		variant_label: buildVariantLabel(match?.variant.name),
		image_url: match?.variant.image_url ?? match?.product.image_url ?? null,
		quantity: item.quantity,
		unit_price: item.unitPrice || null,
	};
};

export const emptyCustomOrderValues = (): CustomOrderFormData => ({
	customerName: '',
	customerEmail: '',
	orderDate: todayInput(),
	dueDate: '',
	orderNotes: '',
	items: [{ variantId: '', quantity: 1, unitPrice: '' }],
});

export const orderToFormValues = (
	order: OrderDetail,
	products: Product[],
): CustomOrderFormData => ({
	customerName: order.customer_name ?? '',
	customerEmail: order.customer_email ?? '',
	orderDate: toDateInput(order.order_date),
	dueDate: toDateInput(order.due_date),
	orderNotes: order.order_notes ?? '',
	items: order.items.map((item) => orderItemToFormItem(item, products)),
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
	items: data.items.map((item) => formItemToPayloadItem(item, products)),
});
