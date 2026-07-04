import type { CustomerTier } from '@/types/api';
import { BorderBadge } from '@/components/border-badge/border-badge';

type CustomerTierBadgeProps = {
	tier: CustomerTier;
};

const TIER_LABELS: Record<CustomerTier, string> = {
	new: 'New',
	loyal: 'Loyal',
	super_fan: 'Super Fan',
};

const TIER_COLOR_SLUGS: Record<CustomerTier, string> = {
	new: 'slate',
	loyal: 'cobalt',
	super_fan: 'tussock',
};

export const CustomerTierBadge = ({ tier }: CustomerTierBadgeProps) => (
	<BorderBadge color={TIER_COLOR_SLUGS[tier]}>{TIER_LABELS[tier]}</BorderBadge>
);
