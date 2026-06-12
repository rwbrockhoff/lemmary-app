import { useFormContext } from 'react-hook-form';
import { Card, TextField, TextArea, Stack, Flex } from '@artifact-ui/core';
import type { CustomOrderFormData } from '../../schemas/custom-order-schemas';
import { LabeledField } from '../order-form/labeled-field';
import { DateField } from '../order-form/date-field';
import styles from '../order-form/order-form.module.css';

export const OrderDetailsFields = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext<CustomOrderFormData>();

	return (
		<Card.Root>
			<Card.Body className={styles.detailsGrid}>
				<Stack gap="4">
					<LabeledField label="Customer name">
						<TextField.Standalone
							type="text"
							autoFocus
							{...register('customerName')}
							error={
								errors.customerName
									? { error: true, message: errors.customerName.message ?? '' }
									: undefined
							}
						/>
					</LabeledField>
					<LabeledField label="Customer email">
						<TextField.Standalone
							type="email"
							placeholder="Optional"
							{...register('customerEmail')}
							error={
								errors.customerEmail
									? { error: true, message: errors.customerEmail.message ?? '' }
									: undefined
							}
						/>
					</LabeledField>
					<Flex gap="3">
						<DateField name="orderDate" label="Order date" />
						<DateField name="dueDate" label="Due date" />
					</Flex>
				</Stack>

				<LabeledField label="Order notes">
					<TextArea.Standalone
						placeholder="Add notes..."
						rows={6}
						className="flex-1"
						{...register('orderNotes')}
					/>
				</LabeledField>
			</Card.Body>
		</Card.Root>
	);
};
