import { InboxIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { EmptyState } from '@/components/empty-state/empty-state';
import { ErrorState } from '@/components/error-state/error-state';
import { useProducts } from '@/features/storefront/api/storefront-queries';
import type { CustomOrderFormData } from '../../schemas/custom-order-schemas';
import type { UpdateCustomOrderRequest } from '../../types/custom-order-types';
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
	isSubmitting: boolean;
	onSubmit: (payload: UpdateCustomOrderRequest) => void;
};

export const CustomOrderForm = ({
	mode,
	order,
	isSubmitting,
	onSubmit,
}: CustomOrderFormProps) => {
	const { data, isLoading, error } = useProducts();

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
		onSubmit(toCustomOrderPayload(formData, products));
	};

	return (
		<CustomOrderFormFields
			products={products}
			defaultValues={defaultValues}
			submitLabel={isEdit ? 'Save' : 'Create order'}
			isSubmitting={isSubmitting}
			cancelTo={isEdit && order ? `/orders/${order.id}` : '/orders'}
			onSubmit={handleSubmit}
		/>
	);
};
