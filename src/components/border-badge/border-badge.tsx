import type { ReactNode } from 'react';
import { getTintStyle } from '../border-tint';
import styles from './border-badge.module.css';

type BorderBadgeProps = {
	color: string;
	children: ReactNode;
	icon?: ReactNode;
};

export const BorderBadge = ({ color, children, icon }: BorderBadgeProps) => (
	<span className={styles.badge} style={getTintStyle(color)}>
		{icon}
		<span className={styles.label}>{children}</span>
	</span>
);
