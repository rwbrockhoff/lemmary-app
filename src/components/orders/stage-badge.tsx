import type { WorkflowStageColor } from './stage-colors';
import { BorderBadge } from '@/components/border-badge/border-badge';

type StageBadgeProps = {
	name: string | null;
	color: WorkflowStageColor | string | null;
};

export const StageBadge = ({ name, color }: StageBadgeProps) => (
	<BorderBadge color={color ?? 'slate'}>{name ?? 'No status'}</BorderBadge>
);
