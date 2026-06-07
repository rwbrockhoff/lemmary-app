import { z } from 'zod';

export const customOrderItemSchema = z.object({
	id: z.string().optional(),
	variantId: z.string().min(1, 'Select a product'),
	quantity: z.number().int().min(1, 'Quantity must be at least 1'),
	unitPrice: z.string().optional(),
});

export const customOrderSchema = z.object({
	customerName: z.string().trim().min(1, 'Customer name is required'),
	customerEmail: z
		.string()
		.trim()
		.toLowerCase()
		.pipe(z.email())
		.optional()
		.or(z.literal('')),
	orderDate: z.string().optional(),
	dueDate: z.string().optional(),
	orderNotes: z.string().optional(),
	items: z.array(customOrderItemSchema).min(1, 'Add at least one item'),
});

export type CustomOrderFormData = z.infer<typeof customOrderSchema>;
