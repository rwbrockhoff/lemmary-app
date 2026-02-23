import { Badge } from '@artifact-ui/core';

type StatusBadgeProps = {
	status: string;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
	const color = status === 'pending' ? 'info' : 'success';
	return (
		<Badge variant="soft" color={color} size="1">
			{status}
		</Badge>
	);
};
