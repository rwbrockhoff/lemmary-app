import { useMemo } from 'react';
import { Table, Badge, cn } from '@artifact-ui/core';
import { getProgressColor } from '../utils/batch-utils';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import styles from '@/styles/shared.module.css';
import { VariantBadges } from '@/components/variant-badges';
import type { BatchItem, BatchOrderItem } from '@/types/api';

type BatchItemsTableProps = {
	items: BatchItem[];
	orderItems: BatchOrderItem[];
};

type ItemSortKey = Extract<keyof BatchItem, string> | 'progress';

export const BatchItemsTable = ({
	items,
	orderItems,
}: BatchItemsTableProps) => {
	const progressByItem = useMemo(() => {
		const map = new Map<string, number>();
		for (const item of items) {
			const matching = orderItems.filter(
				(oi) =>
					oi.platform_sku === item.platform_sku &&
					JSON.stringify(oi.variant_label) === JSON.stringify(item.variant_label),
			);
			const completed = matching.filter((oi) => oi.is_complete).length;
			const total = matching.length;
			map.set(item.id, total > 0 ? completed / total : 0);
		}
		return map;
	}, [items, orderItems]);

	const { sortedData, sortKey, sortDirection, toggleSort } =
		useSortableTable<BatchItem, ItemSortKey>(items, {
			defaultKey: 'product_name',
			defaultDirection: 'asc',
			storageKey: 'batch-items',
			customSortFns: {
				progress: (a, b) =>
					(progressByItem.get(a.id) ?? 0) -
					(progressByItem.get(b.id) ?? 0),
			},
		});

	return (
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<SortableHeader<ItemSortKey>
						label="Product"
						sortKey="product_name"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<SortableHeader<ItemSortKey>
						label="Variant"
						sortKey="variant_label"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-1/3"
					/>
					<SortableHeader<ItemSortKey>
						label="Qty"
						sortKey="quantity"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<SortableHeader<ItemSortKey>
						label="Progress"
						sortKey="progress"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						align="center"
					/>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sortedData.map((item) => {
					const matching = orderItems.filter(
						(oi) =>
							oi.platform_sku === item.platform_sku &&
							JSON.stringify(oi.variant_label) === JSON.stringify(item.variant_label),
					);
					const completed = matching.filter((oi) => oi.is_complete).length;
					const total = matching.length;

					return (
						<Table.Row
							key={item.id}
							className={cn(completed === total && total > 0 && styles.completedRow)}
						>
							<Table.Cell>{item.product_name}</Table.Cell>
							<Table.Cell>
								<VariantBadges variants={item.variant_label} />
							</Table.Cell>
							<Table.Cell>{item.quantity}</Table.Cell>
							<Table.Cell textAlign="center">
								<Badge
									size="1"
									variant="soft"
									color={getProgressColor(completed, total)}
								>
									{completed}/{total}
								</Badge>
							</Table.Cell>
						</Table.Row>
					);
				})}
			</Table.Body>
		</Table.Root>
	);
};
