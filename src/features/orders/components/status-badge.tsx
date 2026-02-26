import { Badge } from '@artifact-ui/core';
import { getBadgeColor } from './stage-select';

type StatusBadgeProps = {
	name: string | null;
	color: string | null;
};

export const StatusBadge = ({ name, color }: StatusBadgeProps) => {
	const badgeColor = getBadgeColor(color ?? 'gray');

	return (
		<Badge variant="soft" color={badgeColor} size="1">
			{name ?? 'No status'}
		</Badge>
	);
};
