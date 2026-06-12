import { useNavigate } from 'react-router';
import { PageHeader } from '@/components/page-header';
import { useToast } from '@/providers/toast-context';
import { useCreateWorkOrder } from './api/orders-queries';
import { WorkOrderForm } from './components/work-order-form/work-order-form';
import type { OrderDetail } from '@/types/api';
import type { WorkOrderRequest } from './types/work-order-types';
import shared from '@/styles/shared.module.css';

const WorkOrderCreatePage = () => {
	const navigate = useNavigate();
	const toast = useToast();
	const createOrder = useCreateWorkOrder();

	const handleSubmit = (payload: WorkOrderRequest) => {
		createOrder.mutate(payload, {
			onSuccess: (saved: OrderDetail) => {
				toast.success('Work order created');
				navigate(`/orders/${saved.id}`);
			},
			onError: (err) => toast.error(err.message, 'Could not create work order'),
		});
	};

	return (
		<div className={shared.pageContainer}>
			<PageHeader
				segments={[{ label: 'Orders', to: '/orders' }]}
				title="New work order"
			/>
			<WorkOrderForm
				mode="create"
				isSubmitting={createOrder.isPending}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default WorkOrderCreatePage;
