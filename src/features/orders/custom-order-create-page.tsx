import { useNavigate } from 'react-router';
import { PageHeader } from '@/components/page-header';
import { useToast } from '@/providers/toast-context';
import { useCreateCustomOrder } from './api/orders-queries';
import { CustomOrderForm } from './components/custom-order-form/custom-order-form';
import type { OrderDetail } from '@/types/api';
import type { UpdateCustomOrderRequest } from './types/custom-order-types';
import shared from '@/styles/shared.module.css';

const CustomOrderCreatePage = () => {
	const navigate = useNavigate();
	const toast = useToast();
	const createOrder = useCreateCustomOrder();

	const handleSubmit = (payload: UpdateCustomOrderRequest) => {
		createOrder.mutate(payload, {
			onSuccess: (saved: OrderDetail) => {
				toast.success('Custom order created');
				navigate(`/orders/${saved.id}`);
			},
			onError: (err) => toast.error(err.message, 'Could not create order'),
		});
	};

	return (
		<div className={shared.pageContainer}>
			<PageHeader
				segments={[{ label: 'Orders', to: '/orders' }]}
				title="New custom order"
			/>
			<CustomOrderForm
				mode="create"
				isSubmitting={createOrder.isPending}
				onSubmit={handleSubmit}
			/>
		</div>
	);
};

export default CustomOrderCreatePage;
