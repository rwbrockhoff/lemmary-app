import { z } from 'zod';
import { lineItemSchema } from '../components/order-form/line-item-schema';

export const workOrderSchema = z.object({
	orderTitle: z.string().trim().min(1, 'Title is required'),
	orderDescription: z.string().optional(),
	orderDate: z.string().optional(),
	dueDate: z.string().optional(),
	items: z.array(lineItemSchema).min(1, 'Add at least one item'),
});

export type WorkOrderFormData = z.infer<typeof workOrderSchema>;
