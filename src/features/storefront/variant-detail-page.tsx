import { useParams } from 'react-router';
import { Heading, Text, Flex, Badge, Stack } from '@artifact-ui/core';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageSpinner } from '@/components/page-spinner';
import { ProductThumbnail } from '@/components/product-thumbnail/product-thumbnail';
import { useProduct } from './api/storefront-queries';
import { VariantBomSection } from './components/variant-bom-section';
import shared from '@/styles/shared.module.css';

const VariantDetailPage = () => {
	const { productId, variantId } = useParams<{
		productId: string;
		variantId: string;
	}>();
	const { data: product, isLoading, error } = useProduct(productId!);

	if (isLoading) return <PageSpinner />;
	if (error || !product)
		return (
			<Text color="danger" className="p-8">
				Failed to load product.
			</Text>
		);

	const variant = product.variants.find((v) => v.id === variantId);
	if (!variant)
		return (
			<Text color="danger" className="p-8">
				Variant not found.
			</Text>
		);

	return (
		<div className={shared.pageContainer}>
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
						/>
						<Stack gap="1">
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
							</Flex>
						</Stack>
					</Flex>
				</div>

				<VariantBomSection
					variantId={variantId!}
					variantName={variant.name}
					platformSku={variant.platform_sku}
					productName={product.name}
				/>
			</Stack>
		</div>
	);
};

export default VariantDetailPage;
