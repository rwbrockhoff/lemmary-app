import type { OrderItem, Product, VariantOption } from '@/types/api';
import { findProductVariant, findVariantBySku } from './variant-utils';
import type { LineItemValue } from './line-item-schema';

// The line-item shape sent to the API (same for every user-created order type)
export type LineItemPayload = {
	id?: string;
	product_name: string;
	platform_sku: string | null;
	variant_label: VariantOption[] | null;
	image_url: string | null;
	quantity: number;
	unit_price: string | null;
};

// Products with no real variants come through as "Default", which we don't store as a label
const buildVariantLabel = (variantName: string | undefined): VariantOption[] | null => {
	if (!variantName || variantName.toLowerCase() === 'default') return null;
	return [{ name: 'Variant', value: variantName }];
};

export const emptyLineItem = (): LineItemValue => ({
	variantId: '',
	quantity: 1,
	unitPrice: '',
});

// Order items only store the SKU, so match it back to a catalog variant to prefill the select
export const orderItemToLineItem = (
	item: OrderItem,
	products: Product[],
): LineItemValue => {
	const variant = findVariantBySku(products, item.platform_sku);
	return {
		id: item.id,
		variantId: variant?.id ?? '',
		quantity: item.quantity,
		unitPrice: item.unit_price ?? '',
	};
};

export const lineItemToPayload = (
	item: LineItemValue,
	products: Product[],
): LineItemPayload => {
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
