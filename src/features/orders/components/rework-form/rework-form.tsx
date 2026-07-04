import { PageSpinner } from '@/components/page-spinner';
import { ErrorState } from '@/components/error-state/error-state';
import { useProducts } from '@/features/storefront/api/storefront-queries';
import type { OrderDetail } from '@/types/api';
import type { UpdateReworkRequest } from '../../types/rework-types';
import type { ReworkFormData } from '../../schemas/rework-schemas';
import { ReworkFormFields } from './rework-form-fields';
import { reworkToFormValues, toReworkPayload } from './rework-form-values';

type ReworkFormProps = {
	order: OrderDetail;
	isSubmitting: boolean;
	onSubmit: (payload: UpdateReworkRequest) => void;
};

export const ReworkForm = ({ order, isSubmitting, onSubmit }: ReworkFormProps) => {
	const { data, isLoading, error } = useProducts();

	if (isLoading) return <PageSpinner />;
	if (error)
		return <ErrorState description="Failed to load products. Try again later." />;

	const products = data?.products ?? [];

	const handleSubmit = (formData: ReworkFormData) => {
		onSubmit(toReworkPayload(formData, products));
	};

	return (
		<ReworkFormFields
			products={products}
			defaultValues={reworkToFormValues(order, products)}
			isSubmitting={isSubmitting}
			cancelTo={`/orders/${order.id}`}
			onSubmit={handleSubmit}
		/>
	);
};
