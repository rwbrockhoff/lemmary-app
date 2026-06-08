import { StageBadge } from './stage-badge';
import { ORDER_TYPE_DISPLAY } from '@/utils/orders';
import type { OrderType } from '@/types/api';

type OrderNumberLabelProps = {
	orderNumber: string;
	orderType: OrderType;
};

export const OrderNumberLabel = ({ orderNumber, orderType }: OrderNumberLabelProps) => {
	if (orderType === 'platform') {
		return <>{orderNumber}</>;
	}

	return <StageBadge name={orderNumber} color={ORDER_TYPE_DISPLAY[orderType].color} />;
};
