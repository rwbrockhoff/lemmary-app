import type { ReworkReason } from '@/types/api';

export const REWORK_REASONS: { value: ReworkReason; label: string }[] = [
	{ value: 'missing_item', label: 'Missing item' },
	{ value: 'wrong_item', label: 'Wrong item sent' },
	{ value: 'defect', label: 'Quality defect' },
	{ value: 'damaged_in_transit', label: 'Damaged in transit' },
	{ value: 'customer_change', label: 'Customer change' },
	{ value: 'other', label: 'Other' },
];

export function isReworkReason(value: string): value is ReworkReason {
	return REWORK_REASONS.some((reason) => reason.value === value);
}

export function reworkReasonLabel(value: ReworkReason): string {
	return REWORK_REASONS.find((reason) => reason.value === value)?.label ?? value;
}
