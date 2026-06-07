import { useParams, useNavigate } from 'react-router';
import { PageHeader } from '@/components/page-header';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useToast } from '@/providers/toast-context';
import { CustomOrderForm } from './components/custom-order-form/custom-order-form';
import { useOrder, useUpdateCustomOrder } from './api/orders-queries';
import type { OrderDetail } from '@/types/api';
import type { UpdateCustomOrderRequest } from './types/custom-order-types';
import shared from '@/styles/shared.module.css';

const CustomOrderEditPage = () => {
	const { orderId } = useParams<{ orderId: string }>();
	const navigate = useNavigate();
	const toast = useToast();
	const { data: order, isLoading, error } = useOrder(orderId!);
	const updateOrder = useUpdateCustomOrder(orderId!);
	const isCustom = order?.order_type === 'custom';

	const segments = [{ label: 'Orders', to: '/orders' }];
	if (order) {
		segments.push({ label: order.order_number, to: `/orders/${order.id}` });
	}

	const handleSubmit = (payload: UpdateCustomOrderRequest) => {
		updateOrder.mutate(payload, {
			onSuccess: (saved: OrderDetail) => {
				toast.success('Custom order updated');
				navigate(`/orders/${saved.id}`);
			},
			onError: (err) => toast.error(err.message, 'Could not update order'),
		});
	};

	return (
		<div className={shared.pageContainer}>
			<PageHeader segments={segments} title="Edit order" />
			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error || (!isLoading && !isCustom)}
				errorState={<ErrorState description="This order can't be edited." />}>
				{order && isCustom && (
					<CustomOrderForm
						mode="edit"
						order={order}
						isSubmitting={updateOrder.isPending}
						onSubmit={handleSubmit}
					/>
				)}
			</LoadingWrapper>
		</div>
	);
};

export default CustomOrderEditPage;
