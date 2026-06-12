import { useParams, useNavigate } from 'react-router';
import { PageHeader } from '@/components/page-header';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useToast } from '@/providers/toast-context';
import { WorkOrderForm } from './components/work-order-form/work-order-form';
import { useOrder, useUpdateWorkOrder } from './api/orders-queries';
import type { OrderDetail } from '@/types/api';
import type { WorkOrderRequest } from './types/work-order-types';
import shared from '@/styles/shared.module.css';

const WorkOrderEditPage = () => {
	const { orderId } = useParams<{ orderId: string }>();
	const navigate = useNavigate();
	const toast = useToast();

	const { data: order, isLoading, error } = useOrder(orderId!);
	const updateOrder = useUpdateWorkOrder(orderId!);

	const isWork = order?.order_type === 'work';

	const segments = [{ label: 'Orders', to: '/orders' }];
	if (order) {
		segments.push({ label: order.order_number, to: `/orders/${order.id}` });
	}

	const handleSubmit = (payload: WorkOrderRequest) => {
		updateOrder.mutate(payload, {
			onSuccess: (saved: OrderDetail) => {
				toast.success('Work order updated');
				navigate(`/orders/${saved.id}`);
			},
			onError: (err) => toast.error(err.message, 'Could not update work order'),
		});
	};

	return (
		<div className={shared.pageContainer}>
			<PageHeader segments={segments} title="Edit work order" />
			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error || (!isLoading && !isWork)}
				errorState={<ErrorState description="This order can't be edited." />}>
				{order && isWork && (
					<WorkOrderForm
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

export default WorkOrderEditPage;
