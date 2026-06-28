import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Table, Badge, Flex, Text } from '@artifact-ui/core';
import { SortableHeader } from '@/components/sortable-header';
import { ProductThumbnail } from '@/components/product-thumbnail/product-thumbnail';
import { useSortableTable } from '@/hooks/use-sortable-table';
import { formatCurrency } from '@/utils/format';
import { useToast } from '@/providers/toast-context';
import type { Product, ProductVariant, ProductionType } from '@/types/api';
import { ProductionTypeSelect } from './production-type-select';
import { ConfirmBulkProductionTypeModal } from './confirm-bulk-production-type-modal';
import { getProductProductionType } from '../production-type';
import { useUpdateProductProductionType } from '../api/storefront-queries';

type PendingChange = { productId: string; productionType: ProductionType };

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
	const navigate = useNavigate();
	const toast = useToast();
	const updateProductionType = useUpdateProductProductionType();
	const [pending, setPending] = useState<PendingChange | null>(null);

	const apply = (productId: string, productionType: ProductionType) =>
		updateProductionType.mutate(
			{ productId, productionType },
			{
				onError: (err) => toast.error(err.message, 'Could not update production type'),
			},
		);

	// Confirm first when variants differ, since a bulk apply overwrites them
	const handleChange = (product: Product, productionType: ProductionType) => {
		if (getProductProductionType(product.variants) === undefined) {
			setPending({ productId: product.id, productionType });
		} else {
			apply(product.id, productionType);
		}
	};

	const confirmPending = () => {
		if (!pending) return;
		apply(pending.productId, pending.productionType);
		setPending(null);
	};

	const { sortedData, sortKey, sortDirection, toggleSort } = useSortableTable(products, {
		defaultKey: 'is_visible',
		defaultDirection: 'desc',
		storageKey: 'storefront-products',
	});

	return (
		<>
			<Table.Root variant="surface" size="2">
				<colgroup>
					<col className="w-2/5" />
					<col className="w-28" />
					<col className="w-28" />
					<col className="w-24" />
					<col className="w-28" />
					<col className="w-40" />
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
							<Text size="2" weight="medium" color="secondary">
								Price
							</Text>
						</Table.HeaderCell>
						<Table.HeaderCell>
							<Text size="2" weight="medium" color="secondary">
								Stock
							</Text>
						</Table.HeaderCell>
						<SortableHeader
							label="Visibility"
							sortKey="is_visible"
							activeSortKey={sortKey}
							sortDirection={sortDirection}
							onSort={toggleSort}
						/>
						<Table.HeaderCell>
							<Text size="2" weight="medium" color="secondary">
								Production
							</Text>
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{sortedData.map((product) => (
						<Table.Row
							key={product.id}
							className="cursor-pointer"
							onClick={() => navigate(`/storefront/${product.id}`)}>
							<Table.Cell>
								<Flex align="center" gap="3">
									<ProductThumbnail src={product.image_url} alt={product.name} />
									{product.name}
								</Flex>
							</Table.Cell>
							<Table.Cell>{product.variant_count}</Table.Cell>
							<Table.Cell>{getPriceDisplay(product.variants)}</Table.Cell>
							<Table.Cell>{getStockDisplay(product.variants)}</Table.Cell>
							<Table.Cell>
								<Badge
									size="1"
									variant="soft"
									color={product.is_visible ? 'success' : 'neutral'}>
									{product.is_visible ? 'Visible' : 'Hidden'}
								</Badge>
							</Table.Cell>
							<Table.Cell onClick={(e) => e.stopPropagation()}>
								<ProductionTypeSelect
									value={getProductProductionType(product.variants)}
									onChange={(productionType) => handleChange(product, productionType)}
								/>
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
			<ConfirmBulkProductionTypeModal
				open={pending !== null}
				onOpenChange={(open) => !open && setPending(null)}
				productionType={pending?.productionType ?? null}
				onConfirm={confirmPending}
			/>
		</>
	);
};
