import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Table, Button, Stack, Flex, Text } from '@artifact-ui/core';
import { PlusIcon } from '@/components/icons';
import { formatCurrency } from '@/utils/format';
import type { Product } from '@/types/api';
import type { LineItemsForm } from './line-item-schema';
import { emptyLineItem } from './line-item-values';
import { LineItemRow } from './line-item-row';
import styles from './order-form.module.css';

type LineItemsFieldProps = {
	products: Product[];
};

const lineTotal = (quantity: number, unitPrice: string | undefined) =>
	(Number(quantity) || 0) * (Number(unitPrice) || 0);

export const LineItemsField = ({ products }: LineItemsFieldProps) => {
	const {
		control,
		formState: { errors },
	} = useFormContext<LineItemsForm>();

	const { fields, append, remove } = useFieldArray({ control, name: 'items' });
	const watched = useWatch({ control, name: 'items' }) ?? [];

	const grandTotal = watched.reduce(
		(sum, item) => sum + lineTotal(item.quantity, item.unitPrice),
		0,
	);
	const totalUnits = watched.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

	return (
		<Stack gap="3">
			<Text size="2" color="secondary">
				Items
			</Text>

			<Table.Root variant="surface" size="1">
				<colgroup>
					<col style={{ width: '36%' }} />
					<col style={{ width: '14%' }} />
					<col style={{ width: '14%' }} />
					<col style={{ width: '14%' }} />
					<col style={{ width: '14%' }} />
					<col style={{ width: '8%' }} />
				</colgroup>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>
							<Text size="2" color="secondary">
								Product
							</Text>
						</Table.HeaderCell>
						<Table.HeaderCell>
							<Text size="2" color="secondary">
								SKU
							</Text>
						</Table.HeaderCell>
						<Table.HeaderCell className={styles.numericCell}>
							<Text size="2" color="secondary">
								Qty
							</Text>
						</Table.HeaderCell>
						<Table.HeaderCell className={styles.numericCell}>
							<Text size="2" color="secondary">
								Price
							</Text>
						</Table.HeaderCell>
						<Table.HeaderCell className={styles.numericCell}>
							<Text size="2" color="secondary">
								Subtotal
							</Text>
						</Table.HeaderCell>
						<Table.HeaderCell />
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{fields.map((field, index) => (
						<LineItemRow
							key={field.id}
							index={index}
							products={products}
							subtotal={lineTotal(watched[index]?.quantity, watched[index]?.unitPrice)}
							onRemove={() => remove(index)}
							canRemove={fields.length > 1}
						/>
					))}
				</Table.Body>
			</Table.Root>

			{errors.items && (
				<Text size="1" color="danger">
					{typeof errors.items.message === 'string'
						? errors.items.message
						: 'Select a product for every item.'}
				</Text>
			)}

			<Flex justify="between" align="center">
				<Button
					type="button"
					variant="outline"
					color="neutral"
					size="2"
					iconLeft={<PlusIcon size={16} />}
					onClick={() => append(emptyLineItem())}>
					Add item
				</Button>
				<Flex gap="6" align="center" className="pr-4">
					<Text size="3" color="secondary">
						{totalUnits} {totalUnits === 1 ? 'unit' : 'units'}
					</Text>
					<Text size="4" color="accent">
						{formatCurrency(grandTotal)}
					</Text>
				</Flex>
			</Flex>
		</Stack>
	);
};
