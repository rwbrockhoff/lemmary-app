import { Badge, type BadgeProps } from '@artifact-ui/core';

type TabCountProps = {
	count: number;
	color?: BadgeProps['color'];
};

// Count badge for tab labels, hidden when the count is zero
export const TabCount = ({ count, color = 'neutral' }: TabCountProps) =>
	count > 0 ? (
		<Badge variant="soft" color={color} size="1">
			{count}
		</Badge>
	) : null;
