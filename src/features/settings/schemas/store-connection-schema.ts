import { z } from 'zod';
import { ensureHttps, isValidUrl } from '@/utils/url';

export const storeConnectionSchema = z.object({
	storeUrl: z
		.string()
		.trim()
		.refine(
			(value) => value === '' || isValidUrl(ensureHttps(value)),
			'Enter a valid store URL',
		),
	accessToken: z.string().trim(),
});

export type StoreConnectionFormData = z.infer<typeof storeConnectionSchema>;
