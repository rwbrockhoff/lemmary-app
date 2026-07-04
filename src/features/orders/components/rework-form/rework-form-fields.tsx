import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { Button, Stack, Flex, Card, Select, TextArea } from '@artifact-ui/core';
import { reworkSchema, type ReworkFormData } from '../../schemas/rework-schemas';
import type { Product } from '@/types/api';
import { REWORK_REASONS, reworkReasonLabel } from '@/utils/rework';
import { LabeledField } from '../order-form/labeled-field';
import { DateField } from '../order-form/date-field';
import { LineItemsField } from '../order-form/line-items-field';
import styles from '../order-form/order-form.module.css';

type ReworkFormFieldsProps = {
	products: Product[];
	defaultValues: ReworkFormData;
	isSubmitting: boolean;
	cancelTo: string;
	onSubmit: (data: ReworkFormData) => void;
};

export const ReworkFormFields = ({
	products,
	defaultValues,
	isSubmitting,
	cancelTo,
	onSubmit,
}: ReworkFormFieldsProps) => {
	const navigate = useNavigate();
	const methods = useForm<ReworkFormData>({
		resolver: zodResolver(reworkSchema),
		defaultValues,
	});

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<Stack gap="6">
					<Card.Root>
						<Card.Body className={styles.detailsGrid}>
							<Stack gap="4">
								<LabeledField label="Reason">
									<Controller
										control={methods.control}
										name="reworkReason"
										render={({ field }) => (
											<Select.Root
												value={field.value}
												onValueChange={field.onChange}
												size="2">
												<Select.Trigger aria-label="Redo reason">
													{reworkReasonLabel(field.value)}
												</Select.Trigger>
												<Select.Content>
													<Select.Group>
														{REWORK_REASONS.map((option) => (
															<Select.Item
																key={option.value}
																value={option.value}
																textValue={option.label}>
																{option.label}
															</Select.Item>
														))}
													</Select.Group>
												</Select.Content>
											</Select.Root>
										)}
									/>
								</LabeledField>
								<DateField name="dueDate" label="Due date" />
							</Stack>

							<LabeledField label="Notes">
								<TextArea.Standalone
									placeholder="What needs redoing?"
									rows={6}
									className="flex-1"
									{...methods.register('orderNotes')}
								/>
							</LabeledField>
						</Card.Body>
					</Card.Root>

					<LineItemsField products={products} />

					<Flex gap="2" justify="end" className="mt-4">
						<Button type="button" variant="secondary" onClick={() => navigate(cancelTo)}>
							Cancel
						</Button>
						<Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
							Save
						</Button>
					</Flex>
				</Stack>
			</form>
		</FormProvider>
	);
};
