import { useFormContext } from 'react-hook-form';
import { Card, TextField, TextArea, Stack, Flex } from '@artifact-ui/core';
import type { WorkOrderFormData } from '../../schemas/work-order-schemas';
import { toFieldError } from '@/utils/forms';
import { LabeledField } from '../order-form/labeled-field';
import { DateField } from '../order-form/date-field';
import styles from '../order-form/order-form.module.css';

export const WorkDetailsFields = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext<WorkOrderFormData>();

	return (
		<Card.Root>
			<Card.Body className={styles.detailsGrid}>
				<Stack gap="4">
					<LabeledField label="Title">
						<TextField.Standalone
							type="text"
							autoFocus
							placeholder="e.g. Spring market restock"
							{...register('orderTitle')}
							error={toFieldError(errors.orderTitle)}
						/>
					</LabeledField>
					<Flex gap="3">
						<DateField name="orderDate" label="Order date" />
						<DateField name="dueDate" label="Due date" />
					</Flex>
				</Stack>

				<LabeledField label="Description">
					<TextArea.Standalone
						placeholder="What's this run for?"
						rows={6}
						className="flex-1"
						{...register('orderDescription')}
					/>
				</LabeledField>
			</Card.Body>
		</Card.Root>
	);
};
