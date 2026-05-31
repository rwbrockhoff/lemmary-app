import type { CSSProperties } from 'react';
import type { CustomerTier } from '@/types/api';
import styles from './customer-tier-badge.module.css';

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

export const CustomerTierBadge = ({ tier }: CustomerTierBadgeProps) => {
	const cssVar = `var(--wf-stage-color-${TIER_COLOR_SLUGS[tier]})`;

	const style = {
		'--tier-badge-bg': `color-mix(in srgb, ${cssVar} 18%, transparent)`,
		'--tier-badge-fg': cssVar,
		'--tier-badge-border': `color-mix(in srgb, ${cssVar} 40%, transparent)`,
	} as CSSProperties;

	return (
		<span className={styles.badge} style={style}>
			{TIER_LABELS[tier]}
		</span>
	);
};
