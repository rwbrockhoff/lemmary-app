import { Table } from '@artifact-ui/core';
import { VariantBadges } from '@/components/variant-badges';
import type { MaterialsMismatch } from '@/types/api';

type MismatchesTableProps = {
	items: MaterialsMismatch[];
};

export const MismatchesTable = ({ items }: MismatchesTableProps) => {
	return (
		<Table.Root variant="surface" size="2">
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Product</Table.HeaderCell>
					<Table.HeaderCell>Variant</Table.HeaderCell>
					<Table.HeaderCell>SKU</Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{items.map((item, index) => (
					<Table.Row key={`${item.platform_sku}-${index}`}>
						<Table.Cell>{item.product_name}</Table.Cell>
						<Table.Cell><VariantBadges variants={item.variant_label} /></Table.Cell>
						<Table.Cell>{item.platform_sku ?? '—'}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
};
