import type { ProductionType, ProductVariant } from '@/types/api';

export const PRODUCTION_TYPES: { value: ProductionType; label: string }[] = [
	{ value: 'made_to_order', label: 'Made to order' },
	{ value: 'ready_made', label: 'Ready made' },
	{ value: 'dropship', label: 'Dropship' },
	{ value: 'digital', label: 'Digital' },
];

export function isProductionType(value: string): value is ProductionType {
	return PRODUCTION_TYPES.some((type) => type.value === value);
}

// Undefined when a product's variants don't all share one type (shows as "Mixed")
export function getProductProductionType(
	variants: ProductVariant[],
): ProductionType | undefined {
	if (variants.length === 0) return undefined;
	const first = variants[0].production_type;
	return variants.every((v) => v.production_type === first) ? first : undefined;
}
