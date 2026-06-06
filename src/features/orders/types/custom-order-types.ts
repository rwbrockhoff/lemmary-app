import type { VariantOption } from '@/types/api';

export type CreateCustomOrderItem = {
	product_name: string;
	platform_sku: string | null;
	variant_label: VariantOption[] | null;
	quantity: number;
	unit_price: string | null;
};

export type CreateCustomOrderRequest = {
	customer_name: string;
	customer_email?: string | null;
	order_date?: string;
	due_date?: string | null;
	order_notes?: string | null;
	items: CreateCustomOrderItem[];
};
