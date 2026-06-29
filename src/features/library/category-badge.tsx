import type { CSSProperties } from 'react';
import type { MaterialLibraryItem } from '@/types/api';
import { ScissorsIcon, RulerIcon, WrenchIcon } from '@/components/icons/icons';
import { MEASUREMENT_LABELS, MEASUREMENT_COLOR_SLUG } from './measurement';
import styles from './category-badge.module.css';

type Measurement = MaterialLibraryItem['measurement'];

const CATEGORY_ICONS: Record<Measurement, typeof ScissorsIcon> = {
	area: ScissorsIcon,
	linear: RulerIcon,
	count: WrenchIcon,
};

export const CategoryBadge = ({ measurement }: { measurement: Measurement }) => {
	const cssVar = `var(--wf-stage-color-${MEASUREMENT_COLOR_SLUG[measurement]})`;
	const Icon = CATEGORY_ICONS[measurement];

	const style = {
		'--category-badge-bg': `color-mix(in srgb, ${cssVar} 18%, transparent)`,
		'--category-badge-fg': cssVar,
		'--category-badge-border': `color-mix(in srgb, ${cssVar} 40%, transparent)`,
	} as CSSProperties;

	return (
		<span className={styles.badge} style={style}>
			<Icon size={12} />
			{MEASUREMENT_LABELS[measurement]}
		</span>
	);
};
