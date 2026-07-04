import { z } from 'zod';
import { lineItemSchema } from '../components/order-form/line-item-schema';

export const reworkSchema = z.object({
	reworkReason: z.enum([
		'missing_item',
		'wrong_item',
		'defect',
		'damaged_in_transit',
		'customer_change',
		'other',
	]),
	dueDate: z.string().optional(),
	orderNotes: z.string().optional(),
	items: z.array(lineItemSchema).min(1, 'Add at least one item'),
});

export type ReworkFormData = z.infer<typeof reworkSchema>;
