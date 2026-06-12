import { InboxIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { EmptyState } from '@/components/empty-state/empty-state';
import { ErrorState } from '@/components/error-state/error-state';
import { useProducts } from '@/features/storefront/api/storefront-queries';
import type { WorkOrderFormData } from '../../schemas/work-order-schemas';
import type { WorkOrderRequest } from '../../types/work-order-types';
import type { OrderDetail } from '@/types/api';
import { WorkOrderFormFields } from './work-order-form-fields';
import {
	emptyWorkOrderValues,
	workOrderToFormValues,
	toWorkOrderPayload,
} from './work-form-values';

type WorkOrderFormProps = {
	mode: 'create' | 'edit';
	order?: OrderDetail;
	isSubmitting: boolean;
	onSubmit: (payload: WorkOrderRequest) => void;
};

export const WorkOrderForm = ({
	mode,
	order,
	isSubmitting,
	onSubmit,
}: WorkOrderFormProps) => {
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
				description="Sync your storefront before creating a work order."
			/>
		);
	}

	const isEdit = mode === 'edit';
	const defaultValues =
		order && isEdit ? workOrderToFormValues(order, products) : emptyWorkOrderValues();

	const handleSubmit = (formData: WorkOrderFormData) => {
		onSubmit(toWorkOrderPayload(formData, products));
	};

	return (
		<WorkOrderFormFields
			products={products}
			defaultValues={defaultValues}
			submitLabel={isEdit ? 'Save' : 'Create work order'}
			isSubmitting={isSubmitting}
			cancelTo={isEdit && order ? `/orders/${order.id}` : '/orders'}
			onSubmit={handleSubmit}
		/>
	);
};
