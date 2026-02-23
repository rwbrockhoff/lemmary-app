import { Table } from '@artifact-ui/core';
import type { ProductionSummaryItem } from '@/types/api';

type ProductionTableProps = {
	items: ProductionSummaryItem[];
};

export const ProductionTable = ({ items }: ProductionTableProps) => {
	return (
		<Table.Root variant="surface" size="2" highlight>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Product</Table.HeaderCell>
					<Table.HeaderCell className="w-1/3">Variant</Table.HeaderCell>
					<Table.HeaderCell>SKU</Table.HeaderCell>
					<Table.HeaderCell textAlign="center">Qty</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{items.map((item, index) => (
					<Table.Row key={`${item.platform_sku}-${item.variant_label}-${index}`}>
						<Table.Cell>{item.product_name}</Table.Cell>
						<Table.Cell>{item.variant_label ?? '—'}</Table.Cell>
						<Table.Cell>{item.platform_sku ?? '—'}</Table.Cell>
						<Table.Cell textAlign="center">{item.total_quantity}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
};
