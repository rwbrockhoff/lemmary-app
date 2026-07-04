import { useParams, useNavigate } from 'react-router';
import { PageHeader } from '@/components/page-header';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useToast } from '@/providers/toast-context';
import { ReworkForm } from './components/rework-form/rework-form';
import { useOrder, useUpdateRework } from './api/orders-queries';
import type { OrderDetail } from '@/types/api';
import type { UpdateReworkRequest } from './types/rework-types';
import shared from '@/styles/shared.module.css';

const ReworkOrderEditPage = () => {
	const { orderId } = useParams<{ orderId: string }>();
	const navigate = useNavigate();
	const toast = useToast();

	const { data: order, isLoading, error } = useOrder(orderId!);
	const updateRework = useUpdateRework(orderId!);

	const isRework = order?.order_type === 'rework';

	const segments = [{ label: 'Orders', to: '/orders' }];
	if (order) {
		segments.push({ label: order.order_number, to: `/orders/${order.id}` });
	}

	const handleSubmit = (payload: UpdateReworkRequest) => {
		updateRework.mutate(payload, {
			onSuccess: (saved: OrderDetail) => {
				toast.success('Redo order updated');
				navigate(`/orders/${saved.id}`);
			},
			onError: (err) => toast.error(err.message, 'Could not update redo order'),
		});
	};

	return (
		<div className={shared.pageContainer}>
			<PageHeader segments={segments} title="Edit redo order" />
			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error || (!isLoading && !isRework)}
				errorState={<ErrorState description="This order can't be edited." />}>
				{order && isRework && (
					<ReworkForm
						order={order}
						isSubmitting={updateRework.isPending}
						onSubmit={handleSubmit}
					/>
				)}
			</LoadingWrapper>
		</div>
	);
};

export default ReworkOrderEditPage;
