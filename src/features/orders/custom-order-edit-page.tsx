import { useParams } from 'react-router';
import { PageHeader } from '@/components/page-header';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { CustomOrderForm } from './components/custom-order-form/custom-order-form';
import { useOrder } from './api/orders-queries';
import shared from '@/styles/shared.module.css';

const CustomOrderEditPage = () => {
	const { orderId } = useParams<{ orderId: string }>();
	const { data: order, isLoading, error } = useOrder(orderId!);
	const isCustom = order?.order_type === 'custom';

	const segments = [{ label: 'Orders', to: '/orders' }];
	if (order) {
		segments.push({ label: order.order_number, to: `/orders/${order.id}` });
	}

	return (
		<div className={shared.pageContainer}>
			<PageHeader segments={segments} title="Edit order" />
			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error || (!isLoading && !isCustom)}
				errorState={<ErrorState description="This order can't be edited." />}>
				{order && isCustom && <CustomOrderForm mode="edit" order={order} />}
			</LoadingWrapper>
		</div>
	);
};

export default CustomOrderEditPage;
