import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { Button, Stack, Flex } from '@artifact-ui/core';
import { InboxIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { EmptyState } from '@/components/empty-state/empty-state';
import { ErrorState } from '@/components/error-state/error-state';
import { useToast } from '@/providers/toast-context';
import { useProducts } from '@/features/storefront/api/storefront-queries';
import { useCreateCustomOrder } from '../../api/orders-queries';
import {
	customOrderSchema,
	type CustomOrderFormData,
} from '../../schemas/custom-order-schemas';
import type { CreateCustomOrderRequest } from '../../types/custom-order-types';
import type { Product } from '@/types/api';
import { findProductVariant } from './variant-utils';
import { OrderDetailsFields } from './order-details-fields';
import { LineItemsField } from './line-items-field';

const toPayload = (
	data: CustomOrderFormData,
	products: Product[],
): CreateCustomOrderRequest => ({
	customer_name: data.customerName,
	customer_email: data.customerEmail || null,
	order_date: data.orderDate || undefined,
	due_date: data.dueDate || null,
	order_notes: data.orderNotes || null,
	items: data.items.map((item) => {
		const match = findProductVariant(products, item.variantId);
		const variantName = match?.variant.name;
		return {
			product_name: match?.product.name ?? '',
			platform_sku: match?.variant.platform_sku ?? null,
			variant_label:
				variantName && variantName.toLowerCase() !== 'default'
					? [{ name: 'Variant', value: variantName }]
					: null,
			quantity: item.quantity,
			unit_price: item.unitPrice || null,
		};
	}),
});

export const CustomOrderForm = () => {
	const navigate = useNavigate();
	const toast = useToast();
	const { data, isLoading, error } = useProducts();
	const createOrder = useCreateCustomOrder();
	const today = new Date().toISOString().slice(0, 10);

	const methods = useForm<CustomOrderFormData>({
		resolver: zodResolver(customOrderSchema),
		defaultValues: {
			customerName: '',
			customerEmail: '',
			orderDate: today,
			dueDate: '',
			orderNotes: '',
			items: [{ variantId: '', quantity: 1, unitPrice: '' }],
		},
	});

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

	const onSubmit = (formData: CustomOrderFormData) => {
		createOrder.mutate(toPayload(formData, products), {
			onSuccess: (order) => {
				toast.success('Custom order created');
				navigate(`/orders/${order.id}`);
			},
			onError: (err) => toast.error(err.message, 'Could not create order'),
		});
	};

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Stack gap="6">
					<OrderDetailsFields />
					<LineItemsField products={products} />
					<Flex gap="2" justify="end" className="mt-4">
						<Button
							type="button"
							variant="secondary"
							onClick={() => navigate('/orders')}>
							Cancel
						</Button>
						<Button
							type="submit"
							loading={createOrder.isPending}
							disabled={createOrder.isPending}>
							Create order
						</Button>
					</Flex>
				</Stack>
			</form>
		</FormProvider>
	);
};
