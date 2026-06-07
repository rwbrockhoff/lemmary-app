import { useNavigate } from 'react-router';
import { InboxIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { EmptyState } from '@/components/empty-state/empty-state';
import { ErrorState } from '@/components/error-state/error-state';
import { useToast } from '@/providers/toast-context';
import { useProducts } from '@/features/storefront/api/storefront-queries';
import { useCreateCustomOrder, useUpdateCustomOrder } from '../../api/orders-queries';
import type { CustomOrderFormData } from '../../schemas/custom-order-schemas';
import type { OrderDetail } from '@/types/api';
import { CustomOrderFormFields } from './custom-order-form-fields';
import {
	emptyCustomOrderValues,
	orderToFormValues,
	toCustomOrderPayload,
} from './form-values';

type CustomOrderFormProps = {
	mode: 'create' | 'edit';
	order?: OrderDetail;
};

export const CustomOrderForm = ({ mode, order }: CustomOrderFormProps) => {
	const navigate = useNavigate();
	const toast = useToast();
	const { data, isLoading, error } = useProducts();
	const createOrder = useCreateCustomOrder();
	const updateOrder = useUpdateCustomOrder(order?.id ?? '');

	if (isLoading) return <PageSpinner />;
	if (error)
		return <ErrorState description="Failed to load products. Try again later." />;

	const products = data?.products ?? [];

	if (products.length === 0) {
		return (
			<EmptyState
				icon={<InboxIcon size={20} />}
				title="No products to add"
				description="Sync your storefront before creating a custom order."
			/>
		);
	}

	const isEdit = mode === 'edit';
	const defaultValues =
		order && isEdit ? orderToFormValues(order, products) : emptyCustomOrderValues();

	const handleSubmit = (formData: CustomOrderFormData) => {
		const payload = toCustomOrderPayload(formData, products);
		const onSuccess = (saved: OrderDetail) => {
			toast.success(isEdit ? 'Custom order updated' : 'Custom order created');
			navigate(`/orders/${saved.id}`);
		};

		if (isEdit) {
			updateOrder.mutate(payload, {
				onSuccess,
				onError: (err) => toast.error(err.message, 'Could not update order'),
			});
		} else {
			createOrder.mutate(payload, {
				onSuccess,
				onError: (err) => toast.error(err.message, 'Could not create order'),
			});
		}
	};

	return (
		<CustomOrderFormFields
			products={products}
			defaultValues={defaultValues}
			submitLabel={isEdit ? 'Save' : 'Create order'}
			isSubmitting={isEdit ? updateOrder.isPending : createOrder.isPending}
			cancelTo={isEdit && order ? `/orders/${order.id}` : '/orders'}
			onSubmit={handleSubmit}
		/>
	);
};
