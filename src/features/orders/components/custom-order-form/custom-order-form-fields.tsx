import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { Button, Stack, Flex } from '@artifact-ui/core';
import {
	customOrderSchema,
	type CustomOrderFormData,
} from '../../schemas/custom-order-schemas';
import type { Product } from '@/types/api';
import { OrderDetailsFields } from './order-details-fields';
import { LineItemsField } from '../order-form/line-items-field';

type CustomOrderFormFieldsProps = {
	products: Product[];
	defaultValues: CustomOrderFormData;
	submitLabel: string;
	isSubmitting: boolean;
	cancelTo: string;
	onSubmit: (data: CustomOrderFormData) => void;
};

export const CustomOrderFormFields = ({
	products,
	defaultValues,
	submitLabel,
	isSubmitting,
	cancelTo,
	onSubmit,
}: CustomOrderFormFieldsProps) => {
	const navigate = useNavigate();
	const methods = useForm<CustomOrderFormData>({
		resolver: zodResolver(customOrderSchema),
		defaultValues,
	});

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Stack gap="6">
					<OrderDetailsFields />
					<LineItemsField products={products} />
					<Flex gap="2" justify="end" className="mt-4">
						<Button type="button" variant="secondary" onClick={() => navigate(cancelTo)}>
							Cancel
						</Button>
						<Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
							{submitLabel}
						</Button>
					</Flex>
				</Stack>
			</form>
		</FormProvider>
	);
};
