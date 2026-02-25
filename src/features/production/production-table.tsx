import { Table } from '@artifact-ui/core';
import { SortableHeader } from '@/components/sortable-header';
import { VariantBadges } from '@/components/variant-badges';
import { useSortableTable } from '@/hooks/use-sortable-table';
import type { ProductionSummaryItem } from '@/types/api';

type ProductionTableProps = {
	items: ProductionSummaryItem[];
};

export const ProductionTable = ({ items }: ProductionTableProps) => {
	const { sortedData, sortKey, sortDirection, toggleSort } =
		useSortableTable(items, {
			defaultKey: 'product_name',
			defaultDirection: 'asc',
		});

	return (
		<Table.Root variant="surface" size="2">
			<Table.Header>
				<Table.Row>
					<SortableHeader
						label="Product"
						sortKey="product_name"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<SortableHeader
						label="Variant"
						sortKey="variant_label"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-1/3"
					/>
					<SortableHeader
						label="SKU"
						sortKey="platform_sku"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<SortableHeader
						label="Qty"
						sortKey="total_quantity"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						align="center"
					/>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sortedData.map((item, index) => (
					<Table.Row key={`${item.platform_sku}-${item.variant_label?.map((v) => v.value).join('-')}-${index}`}>
						<Table.Cell>{item.product_name}</Table.Cell>
						<Table.Cell><VariantBadges variants={item.variant_label} /></Table.Cell>
						<Table.Cell>{item.platform_sku ?? '—'}</Table.Cell>
						<Table.Cell textAlign="center">{item.total_quantity}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
};
