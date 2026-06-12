import type { WorkflowStageColor } from './stage-colors';
import { getStageColorStyle } from './stage-colors';
import styles from './stage-badge.module.css';

type StageBadgeProps = {
	name: string | null;
	color: WorkflowStageColor | string | null;
};

export const StageBadge = ({ name, color }: StageBadgeProps) => (
	<span className={styles.badge} style={getStageColorStyle(color)}>
		{name ?? 'No status'}
	</span>
);
