import { z } from 'zod';
import { ensureHttps, isValidUrl } from '@/utils/url';

export const storeProfileSchema = z.object({
	storeName: z.string().trim().min(1, 'Store name is required'),
	tagline: z.string().trim().max(120),
	website: z
		.string()
		.trim()
		.refine(
			(value) => value === '' || isValidUrl(ensureHttps(value)),
			'Enter a valid website',
		),
	contactEmail: z
		.string()
		.trim()
		.toLowerCase()
		.refine(
			(value) => value === '' || z.email().safeParse(value).success,
			'Enter a valid email',
		),
});

export type StoreProfileFormData = z.infer<typeof storeProfileSchema>;
