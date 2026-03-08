import { useParams, useNavigate } from 'react-router';
import { Heading, Text, Flex, Table, Badge } from '@artifact-ui/core';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageSpinner } from '@/components/page-spinner';
import { ProductThumbnail } from '@/components/product-thumbnail/product-thumbnail';
import { formatCurrency } from '@/utils/format';
import { useProduct } from './api/storefront-queries';
import shared from '@/styles/shared.module.css';

const ProductDetailPage = () => {
	const { productId } = useParams<{ productId: string }>();
	const navigate = useNavigate();
	const { data: product, isLoading, error } = useProduct(productId!);

	if (isLoading) return <PageSpinner />;
	if (error || !product)
		return (
			<Text color="danger" className="p-8">
				Failed to load product.
			</Text>
		);

	return (
		<div className={shared.pageContainer}>
			<Flex align="center" gap="4" className="mb-6">
				<Breadcrumbs segments={[{ label: 'Storefront', to: '/storefront' }]} />
				<Heading size="6">{product.name}</Heading>
				<Badge
					size="1"
					variant="soft"
					color={product.is_visible ? 'success' : 'neutral'}
				>
					{product.is_visible ? 'Visible' : 'Hidden'}
				</Badge>
			</Flex>

			<Table.Root variant="surface" size="2">
				<colgroup>
					<col />
					<col className="w-40" />
					<col className="w-40" />
					<col className="w-40" />
				</colgroup>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>
							<Text size="2" weight="medium" color="secondary">Variant</Text>
						</Table.HeaderCell>
						<Table.HeaderCell>
							<Text size="2" weight="medium" color="secondary">SKU</Text>
						</Table.HeaderCell>
						<Table.HeaderCell>
							<Text size="2" weight="medium" color="secondary">Price</Text>
						</Table.HeaderCell>
						<Table.HeaderCell>
							<Text size="2" weight="medium" color="secondary">Stock</Text>
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{product.variants.map((variant) => (
						<Table.Row
							key={variant.id}
							className="cursor-pointer"
							onClick={() =>
								navigate(`/storefront/${productId}/${variant.id}`)
							}
						>
							<Table.Cell>
								<Flex align="center" gap="3">
									<ProductThumbnail
										src={variant.image_url ?? product.image_url}
										alt={variant.name}
									/>
									{variant.name}
								</Flex>
							</Table.Cell>
							<Table.Cell>
								<Text size="1" color="secondary">
									{variant.platform_sku ?? '—'}
								</Text>
							</Table.Cell>
							<Table.Cell>
								{variant.on_sale && variant.sale_price
									? formatCurrency(variant.sale_price)
									: formatCurrency(variant.price)}
							</Table.Cell>
							<Table.Cell>
								{variant.stock_unlimited
									? 'Unlimited'
									: variant.stock_quantity ?? 0}
							</Table.Cell>
						</Table.Row>
					))}
				</Table.Body>
			</Table.Root>
		</div>
	);
};

export default ProductDetailPage;
