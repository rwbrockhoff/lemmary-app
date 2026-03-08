export const storefrontKeys = {
	all: ['products'] as const,
	detail: (productId: string) => ['products', productId] as const,
};
