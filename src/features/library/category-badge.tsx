import type { CSSProperties } from 'react';
import type { MaterialLibraryItem } from '@/types/api';
import {
	MEASUREMENT_LABELS,
	MEASUREMENT_COLOR_SLUG,
	MEASUREMENT_ICON,
} from './measurement';
import styles from './category-badge.module.css';

type Measurement = MaterialLibraryItem['measurement'];

export const CategoryBadge = ({ measurement }: { measurement: Measurement }) => {
	const cssVar = `var(--wf-stage-color-${MEASUREMENT_COLOR_SLUG[measurement]})`;
	const Icon = MEASUREMENT_ICON[measurement];

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
