import { Badge } from '@artifact-ui/core';

type StatusBadgeProps = {
	name: string | null;
	color: string | null;
};

const colorMap: Record<string, 'neutral' | 'info' | 'success' | 'danger' | 'primary'> = {
	gray: 'neutral',
	blue: 'info',
	orange: 'primary',
	green: 'success',
	red: 'danger',
};

export const StatusBadge = ({ name, color }: StatusBadgeProps) => {
	const badgeColor = colorMap[color ?? 'gray'] ?? 'neutral';

	return (
		<Badge variant="soft" color={badgeColor} size="1">
			{name ?? 'No status'}
		</Badge>
	);
};
