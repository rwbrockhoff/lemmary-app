import type { Product } from '@/types/api';

export const findProductVariant = (
	products: Product[],
	variantId: string | undefined,
) => {
	if (!variantId) return null;
	for (const product of products) {
		const variant = product.variants.find((v) => v.id === variantId);
		if (variant) return { product, variant };
	}
	return null;
};

export const variantLabel = (productName: string, variantName: string) =>
	variantName && variantName.toLowerCase() !== 'default'
		? `${productName} (${variantName})`
		: productName;
