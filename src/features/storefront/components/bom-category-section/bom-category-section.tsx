import React, { useState } from 'react';
import { Table, Text, Button, Flex, Heading, Stack } from '@artifact-ui/core';
import { PlusIcon } from '@/components/icons/icons';
import { useCreateBomItem } from '../../api/bom-queries';
import { BomRow } from './bom-row';
import type { BomItem } from '@/types/api';
import styles from './bom-category-section.module.css';

type BomCategorySectionProps = {
	title: string;
	icon?: React.ReactNode;
	items: BomItem[];
	measurement: 'area' | 'linear' | 'count';
	tracksColor: boolean;
	tracksSize: boolean;
	tracksLength: boolean;
	variantId: string;
	variantName: string;
	platformSku: string;
	productName: string;
};

export const BomCategorySection = ({
	title,
	icon,
	items,
	measurement,
	tracksColor,
	tracksSize,
	tracksLength,
	variantId,
	variantName,
	platformSku,
	productName,
}: BomCategorySectionProps) => {
	const [newItemId, setNewItemId] = useState<string | null>(null);
	const createMutation = useCreateBomItem(variantId);

	const dynamicCols = [tracksColor, tracksSize, tracksLength].filter(Boolean).length + 1;
	const colWidth = `${40 / dynamicCols}%`;

	const handleDuplicate = (item: BomItem) => {
		createMutation.mutate({
			measurement,
			platform_sku: platformSku,
			product_name: productName,
			variant: variantName,
			piece: item.piece,
			length: item.length,
			quantity: item.quantity,
			material_id: item.material_id,
		});
	};

	const handleAddItem = () => {
		createMutation.mutate(
			{
				measurement,
				platform_sku: platformSku,
				product_name: productName,
				variant: variantName,
				piece: '',
				length: null,
				quantity: 1,
				material_id: null,
			},
			{
				onSuccess: (newItem) => {
					setNewItemId(newItem.id);
				},
			},
		);
	};

	return (
		<Stack gap="3">
			<Flex align="center" gap="2">
				{icon}
				<Heading size="3">{title}</Heading>
				{items.length > 0 && (
					<Text size="1" color="secondary">
						{items.length} {items.length === 1 ? 'item' : 'items'}
					</Text>
				)}
			</Flex>

			{items.length > 0 && (
				<Table.Root variant="surface" size="1" className={styles.table}>
					<colgroup>
						<col style={{ width: '25%' }} />
						<col style={{ width: '25%' }} />
						{tracksColor && <col style={{ width: colWidth }} />}
						{tracksSize && <col style={{ width: colWidth }} />}
						{tracksLength && <col style={{ width: colWidth }} />}
						<col style={{ width: colWidth }} />
						<col style={{ width: '5%' }} />
						<col style={{ width: '5%' }} />
					</colgroup>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>
								<Text
									size="2"
									weight="medium"
									color="secondary"
									className={styles.headerLabel}>
									Type
								</Text>
							</Table.HeaderCell>
							<Table.HeaderCell>
								<Text
									size="2"
									weight="medium"
									color="secondary"
									className={styles.headerLabel}>
									Piece
								</Text>
							</Table.HeaderCell>
							{tracksColor && (
								<Table.HeaderCell>
									<Text
										size="2"
										weight="medium"
										color="secondary"
										className={styles.headerLabel}>
										Color
									</Text>
								</Table.HeaderCell>
							)}
							{tracksSize && (
								<Table.HeaderCell>
									<Text
										size="2"
										weight="medium"
										color="secondary"
										className={styles.headerLabel}>
										Size
									</Text>
								</Table.HeaderCell>
							)}
							{tracksLength && (
								<Table.HeaderCell>
									<Text
										size="2"
										weight="medium"
										color="secondary"
										className={styles.headerLabel}>
										Length
									</Text>
								</Table.HeaderCell>
							)}
							<Table.HeaderCell>
								<Text
									size="2"
									weight="medium"
									color="secondary"
									className={styles.headerLabel}>
									Qty
								</Text>
							</Table.HeaderCell>
							<Table.HeaderCell className="w-10" />
							<Table.HeaderCell className={styles.actionsColumn} />
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{items.map((item) => (
							<BomRow
								key={item.id}
								item={item}
								tracksColor={tracksColor}
								tracksSize={tracksSize}
								tracksLength={tracksLength}
								measurement={measurement}
								variantId={variantId}
								isNew={item.id === newItemId}
								onDuplicate={handleDuplicate}
							/>
						))}
					</Table.Body>
				</Table.Root>
			)}

			{items.length === 0 && (
				<Text size="2" color="secondary">
					No {title.toLowerCase()} items yet.
				</Text>
			)}

			<div>
				<Button
					size="1"
					variant="ghost"
					color="neutral"
					iconLeft={<PlusIcon size={14} />}
					onClick={handleAddItem}
					disabled={createMutation.isPending}>
					Add {title}
				</Button>
			</div>
		</Stack>
	);
};
