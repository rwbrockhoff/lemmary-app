import { Table, Badge } from '@artifact-ui/core';
import type { BatchItem, BatchOrderItem } from '@/types/api';

type BatchItemsTableProps = {
	items: BatchItem[];
	orderItems: BatchOrderItem[];
};

export const BatchItemsTable = ({
	items,
	orderItems,
}: BatchItemsTableProps) => {
	return (
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Product</Table.HeaderCell>
					<Table.HeaderCell className="w-1/3">Variant</Table.HeaderCell>
					<Table.HeaderCell>Qty</Table.HeaderCell>
					<Table.HeaderCell style={{ textAlign: 'center' }}>Progress</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{items.map((item) => {
					const matching = orderItems.filter(
						(oi) =>
							oi.platform_sku === item.platform_sku &&
							oi.variant_label === item.variant_label,
					);
					const completed = matching.reduce(
						(sum, oi) => sum + oi.completed_qty,
						0,
					);
					const total = matching.reduce(
						(sum, oi) => sum + oi.quantity,
						0,
					);

					return (
						<Table.Row key={item.id}>
							<Table.Cell>{item.product_name}</Table.Cell>
							<Table.Cell>
								{item.variant_label ?? '—'}
							</Table.Cell>
							<Table.Cell>{item.quantity}</Table.Cell>
							<Table.Cell textAlign="center">
								<Badge
									size="1"
									variant="soft"
									color={
										completed === total && total > 0
											? 'success'
											: 'neutral'
									}
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
