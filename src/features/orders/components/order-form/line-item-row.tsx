import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Table, TextField, IconButton, Text, Flex } from '@artifact-ui/core';
import { TrashIcon } from '@/components/icons';
import { ProductThumbnail } from '@/components/product-thumbnail/product-thumbnail';
import { formatCurrency } from '@/utils/format';
import type { Product } from '@/types/api';
import type { LineItemsForm } from './line-item-schema';
import { VariantSelect } from './variant-select';
import { findProductVariant } from './variant-utils';
import styles from './order-form.module.css';

type LineItemRowProps = {
	index: number;
	products: Product[];
	subtotal: number;
	onRemove: () => void;
	canRemove: boolean;
};

export const LineItemRow = ({
	index,
	products,
	subtotal,
	onRemove,
	canRemove,
}: LineItemRowProps) => {
	const { control, register, setValue } = useFormContext<LineItemsForm>();

	const variantId = useWatch({ control, name: `items.${index}.variantId` });
	const match = findProductVariant(products, variantId);
	const sku = match?.variant.platform_sku;

	return (
		<Table.Row>
			<Table.Cell>
				<input type="hidden" {...register(`items.${index}.id`)} />
				<Flex gap="2" align="center">
					<ProductThumbnail
						src={match?.variant.image_url ?? match?.product.image_url ?? null}
						alt={match?.product.name ?? 'Item'}
					/>
					<div className="flex-1 min-w-0">
						<Controller
							control={control}
							name={`items.${index}.variantId`}
							render={({ field }) => (
								<VariantSelect
									className={styles.variantTrigger}
									products={products}
									value={field.value || undefined}
									onChange={(selectedId) => {
										field.onChange(selectedId);
										const selected = findProductVariant(products, selectedId);
										if (selected?.variant.price != null) {
											setValue(`items.${index}.unitPrice`, selected.variant.price);
										}
									}}
								/>
							)}
						/>
					</div>
				</Flex>
			</Table.Cell>
			<Table.Cell>
				<Text size="2" color="secondary">
					{sku ?? '—'}
				</Text>
			</Table.Cell>
			<Table.Cell className={styles.numericCell}>
				<TextField.Standalone
					label="Quantity"
					variant="minimal"
					size="1"
					compact
					override
					type="number"
					placeholder="1"
					className="text-right"
					{...register(`items.${index}.quantity`, { valueAsNumber: true })}
				/>
			</Table.Cell>
			<Table.Cell className={styles.numericCell}>
				<TextField.Standalone
					label="Price"
					variant="minimal"
					size="1"
					compact
					override
					type="text"
					placeholder="0.00"
					prefix="$"
					className="text-right"
					{...register(`items.${index}.unitPrice`)}
				/>
			</Table.Cell>
			<Table.Cell className={styles.numericCell}>
				<Text size="2">{formatCurrency(subtotal)}</Text>
			</Table.Cell>
			<Table.Cell className={styles.actionCell}>
				<IconButton
					size="1"
					variant="ghost"
					color="danger"
					onClick={onRemove}
					disabled={!canRemove}
					label="Remove item"
					icon={<TrashIcon size={18} />}
				/>
			</Table.Cell>
		</Table.Row>
	);
};
