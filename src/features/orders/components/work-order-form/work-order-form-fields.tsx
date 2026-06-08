import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { Button, Stack, Flex } from '@artifact-ui/core';
import {
	workOrderSchema,
	type WorkOrderFormData,
} from '../../schemas/work-order-schemas';
import type { Product } from '@/types/api';
import { LineItemsField } from '../order-form/line-items-field';
import { WorkDetailsFields } from './work-details-fields';

type WorkOrderFormFieldsProps = {
	products: Product[];
	defaultValues: WorkOrderFormData;
	submitLabel: string;
	isSubmitting: boolean;
	cancelTo: string;
	onSubmit: (data: WorkOrderFormData) => void;
};

export const WorkOrderFormFields = ({
	products,
	defaultValues,
	submitLabel,
	isSubmitting,
	cancelTo,
	onSubmit,
}: WorkOrderFormFieldsProps) => {
	const navigate = useNavigate();
	const methods = useForm<WorkOrderFormData>({
		resolver: zodResolver(workOrderSchema),
		defaultValues,
	});

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Stack gap="6">
					<WorkDetailsFields />
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
