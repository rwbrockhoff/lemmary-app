import { z } from 'zod';
import { lineItemSchema } from '../components/order-form/line-item-schema';

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
	items: z.array(lineItemSchema).min(1, 'Add at least one item'),
});

export type CustomOrderFormData = z.infer<typeof customOrderSchema>;
