import type { ReworkReason } from '@/types/api';
import type { UpdateCustomOrderItem } from './custom-order-types';

export type CreateReworkRequest = {
	parent_order_id: string;
	rework_reason: ReworkReason;
};

export type UpdateReworkRequest = {
	rework_reason?: ReworkReason;
	due_date?: string | null;
	order_notes?: string | null;
	items?: UpdateCustomOrderItem[];
};
