import { useFormContext } from 'react-hook-form';
import { Card, TextField, TextArea, Stack, Flex } from '@artifact-ui/core';
import type { CustomOrderFormData } from '../../schemas/custom-order-schemas';
import { LabeledField } from '../order-form/labeled-field';
import styles from './custom-order-form.module.css';

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
						<LabeledField label="Order date" className="flex-1">
							<TextField.Standalone type="date" {...register('orderDate')} />
						</LabeledField>
						<LabeledField label="Due date" className="flex-1">
							<TextField.Standalone type="date" {...register('dueDate')} />
						</LabeledField>
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
