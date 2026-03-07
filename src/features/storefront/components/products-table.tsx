import { Table, Badge, Flex, Text } from '@artifact-ui/core';
import { SortableHeader } from '@/components/sortable-header';
import { ProductThumbnail } from '@/components/product-thumbnail/product-thumbnail';
import { useSortableTable } from '@/hooks/use-sortable-table';
import { formatCurrency } from '@/utils/format';
import type { Product, ProductVariant } from '@/types/api';

type ProductsTableProps = {
	products: Product[];
};

function getPriceDisplay(variants: ProductVariant[]) {
	const prices = variants
		.map((v) => (v.on_sale && v.sale_price ? v.sale_price : v.price))
		.filter((p): p is string => p !== null)
		.map(Number)
		.filter((n) => !isNaN(n));

	if (prices.length === 0) return '—';

	const min = Math.min(...prices);
	const max = Math.max(...prices);

	if (min === max) return formatCurrency(String(min));
	return `${formatCurrency(String(min))} – ${formatCurrency(String(max))}`;
}

function getStockDisplay(variants: ProductVariant[]) {
	if (variants.some((v) => v.stock_unlimited)) return 'Unlimited';

	const total = variants.reduce((sum, v) => sum + (v.stock_quantity ?? 0), 0);
	return String(total);
}


export const ProductsTable = ({ products }: ProductsTableProps) => {
	const { sortedData, sortKey, sortDirection, toggleSort } =
		useSortableTable(products, {
			defaultKey: 'is_visible',
			defaultDirection: 'desc',
			storageKey: 'storefront-products',
		});

	return (
		<Table.Root variant="surface" size="2">
			<colgroup>
				<col className="w-1/2" />
				<col className="w-28" />
				<col className="w-28" />
				<col className="w-28" />
				<col className="w-28" />
			</colgroup>
			<Table.Header>
				<Table.Row>
					<SortableHeader
						label="Product"
						sortKey="name"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<SortableHeader
						label="Variants"
						sortKey="variant_count"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
					<Table.HeaderCell>
						<Text size="2" weight="medium" color="secondary">Price</Text>
					</Table.HeaderCell>
					<Table.HeaderCell>
						<Text size="2" weight="medium" color="secondary">Stock</Text>
					</Table.HeaderCell>
					<SortableHeader
						label="Visibility"
						sortKey="is_visible"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
					/>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sortedData.map((product) => (
					<Table.Row key={product.id}>
						<Table.Cell>
							<Flex align="center" gap="3">
								<ProductThumbnail src={product.image_url} alt={product.name} />
								{product.product_url ? (
									<a
										href={product.product_url}
										target="_blank"
										rel="noopener noreferrer"
										onClick={(e) => e.stopPropagation()}
									>
										{product.name}
									</a>
								) : (
									product.name
								)}
							</Flex>
						</Table.Cell>
						<Table.Cell>
							{product.variant_count}
						</Table.Cell>
						<Table.Cell>{getPriceDisplay(product.variants)}</Table.Cell>
						<Table.Cell>{getStockDisplay(product.variants)}</Table.Cell>
						<Table.Cell>
							<Badge
								size="1"
								variant="soft"
								color={product.is_visible ? 'success' : 'neutral'}
							>
								{product.is_visible ? 'Visible' : 'Hidden'}
							</Badge>
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	);
};
