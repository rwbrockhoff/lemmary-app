import { StageBadge } from '@/components/orders/stage-badge';

type StatusBadgeProps = {
	name: string | null;
	color: string | null;
};

export const StatusBadge = ({ name, color }: StatusBadgeProps) => {
	return <StageBadge name={name} color={color} />;
};
