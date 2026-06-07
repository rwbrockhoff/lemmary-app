import { z } from 'zod';

// Line items are identical across user-created order types (custom, work)
export const lineItemSchema = z.object({
	id: z.string().optional(),
	variantId: z.string().min(1, 'Select a product'),
	quantity: z.number().int().min(1, 'Quantity must be at least 1'),
	unitPrice: z.string().optional(),
});

export type LineItemValue = z.infer<typeof lineItemSchema>;

// The minimal form shape the shared line-item components operate on
export type LineItemsForm = { items: LineItemValue[] };
