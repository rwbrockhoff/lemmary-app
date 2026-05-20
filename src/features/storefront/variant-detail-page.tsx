import { useParams } from 'react-router';
import { Heading, Text, Flex, Badge, Stack } from '@artifact-ui/core';
import { ExternalLinkIcon } from '@/components/icons/icons';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { ProductThumbnail } from '@/components/product-thumbnail/product-thumbnail';
import { formatCurrency } from '@/utils/format';
import { useProduct } from './api/storefront-queries';
import { VariantBomSection } from './components/variant-bom-section';
import shared from '@/styles/shared.module.css';

const VariantDetailPage = () => {
	const { productId, variantId } = useParams<{
		productId: string;
		variantId: string;
	}>();
	const { data: product, isLoading, error } = useProduct(productId!);

	const variant = product?.variants.find((v) => v.id === variantId);

	return (
		<div className={shared.pageContainer}>
			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error || (!isLoading && !product)}
				errorState={<ErrorState description="Failed to load product." />}>
				{product && !variant && <ErrorState description="Variant not found." />}
				{product && variant && (
					<Stack gap="8">
						<div>
							<Flex align="center" gap="4" className="mb-4">
								<Breadcrumbs
									segments={[
										{ label: 'Storefront', to: '/storefront' },
										{ label: product.name, to: `/storefront/${productId}` },
									]}
								/>
							</Flex>
							<Flex align="center" gap="4">
								<ProductThumbnail
									src={variant.image_url ?? product.image_url}
									alt={variant.name}
									size="lg"
								/>
								<Stack gap="3">
									<Heading size="5">{variant.name}</Heading>
									<Flex align="center" gap="3">
										<Text size="2" color="secondary">
											{variant.platform_sku ?? 'No SKU'}
										</Text>
										{!variant.platform_sku && (
											<Badge size="1" variant="soft" color="danger">
												Missing SKU
											</Badge>
										)}
										<Text size="2" color="secondary">
											{variant.on_sale && variant.sale_price
												? formatCurrency(variant.sale_price)
												: formatCurrency(variant.price)}
										</Text>
										<Badge
											size="1"
											variant="soft"
											color={product.is_visible ? 'success' : 'neutral'}>
											{product.is_visible ? 'Visible' : 'Hidden'}
										</Badge>
										<Text size="2" color="secondary">
											{variant.stock_unlimited
												? 'Unlimited'
												: `${variant.stock_quantity ?? 0} in stock`}
										</Text>
										{product.product_url && (
											<a
												href={product.product_url}
												target="_blank"
												rel="noopener noreferrer"
												className="ml-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]">
												<ExternalLinkIcon size={14} />
											</a>
										)}
									</Flex>
								</Stack>
							</Flex>
						</div>

						<VariantBomSection
							variantId={variantId!}
							variantName={variant.name}
							platformSku={variant.platform_sku}
							productName={product.name}
							siblingVariants={product.variants}
						/>
					</Stack>
				)}
			</LoadingWrapper>
		</div>
	);
};

export default VariantDetailPage;
