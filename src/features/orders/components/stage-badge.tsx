import type { CSSProperties } from 'react';
import type { WorkflowStageColor } from '../constants/stage-colors';
import styles from './stage-badge.module.css';

type StageBadgeProps = {
	name: string | null;
	color: WorkflowStageColor | string | null;
};

const MUTED_STAGE_COLORS = new Set(['sage']);

export const StageBadge = ({ name, color }: StageBadgeProps) => {
	const slug = color ?? 'slate';
	const cssVar = `var(--wf-stage-color-${slug})`;
	const fgVar = MUTED_STAGE_COLORS.has(slug)
		? `color-mix(in srgb, ${cssVar}, var(--color-text-default) 35%)`
		: cssVar;

	const style = {
		'--stage-badge-bg': `color-mix(in srgb, ${cssVar} 18%, transparent)`,
		'--stage-badge-fg': fgVar,
		'--stage-badge-border': `color-mix(in srgb, ${cssVar} 40%, transparent)`,
	} as CSSProperties;

	return (
		<span className={styles.badge} style={style}>
			{name ?? 'No status'}
		</span>
	);
};
