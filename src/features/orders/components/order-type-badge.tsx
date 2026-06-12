import { StageBadge } from '@/components/orders/stage-badge';
import { ORDER_TYPE_DISPLAY } from '@/utils/orders';
import type { OrderType } from '@/types/api';

type OrderTypeBadgeProps = {
	orderType: OrderType;
};

export const OrderTypeBadge = ({ orderType }: OrderTypeBadgeProps) => {
	if (orderType === 'platform') {
		return null;
	}

	const { label, color } = ORDER_TYPE_DISPLAY[orderType];
	return <StageBadge name={label} color={color} />;
};
