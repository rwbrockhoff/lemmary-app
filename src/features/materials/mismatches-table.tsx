import { useNavigate } from 'react-router';
import { Table } from '@artifact-ui/core';
import { VariantBadges } from '@/components/variant-badges';
import type { MaterialsMismatch } from '@/types/api';

type MismatchesTableProps = {
	items: MaterialsMismatch[];
};

const buildProductPath = (item: MaterialsMismatch): string | null => {
	if (!item.product_id) return null;
	if (item.variant_id) {
		return `/storefront/${item.product_id}/${item.variant_id}`;
	}
	return `/storefront/${item.product_id}`;
};

export const MismatchesTable = ({ items }: MismatchesTableProps) => {
	const navigate = useNavigate();

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
				{items.map((item, index) => {
					const path = buildProductPath(item);
					return (
						<Table.Row
							key={`${item.platform_sku}-${index}`}
							className={path ? 'cursor-pointer' : undefined}
							onClick={path ? () => navigate(path) : undefined}
						>
							<Table.Cell>{item.product_name}</Table.Cell>
							<Table.Cell><VariantBadges variants={item.variant_label} /></Table.Cell>
							<Table.Cell>{item.platform_sku ?? '—'}</Table.Cell>
						</Table.Row>
					);
				})}
			</Table.Body>
		</Table.Root>
	);
};
