import { z } from 'zod';

const shopifyDomainRegex = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/;

export const shopifyConnectSchema = z.object({
	shop: z
		.string()
		.trim()
		.toLowerCase()
		.transform((value) => value.replace(/^https?:\/\//, '').replace(/\/.*$/, ''))
		.refine((value) => shopifyDomainRegex.test(value), {
			message: 'Please provide a valid Shopify store URL (your-store.myshopify.com)',
		}),
});

export type ShopifyConnectFormData = z.infer<typeof shopifyConnectSchema>;
