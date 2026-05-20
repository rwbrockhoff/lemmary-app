import { Heading, Text, Stack, Flex, Button, DropdownMenu } from '@artifact-ui/core';
import {
	ScissorsIcon,
	RulerIcon,
	WrenchIcon,
	CopyPlusIcon,
} from '@/components/icons/icons';
import styles from './variant-bom-section.module.css';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useVariantBom, useCopyBomFromVariant } from '../api/bom-queries';
import { BomCategorySection } from './bom-category-section/bom-category-section';
import type { ProductVariant } from '@/types/api';

type VariantBomSectionProps = {
	variantId: string;
	variantName: string;
	platformSku: string | null;
	productName: string;
	siblingVariants: ProductVariant[];
};

export const VariantBomSection = ({
	variantId,
	variantName,
	platformSku,
	productName,
	siblingVariants,
}: VariantBomSectionProps) => {
	const { data: bomItems, isLoading, error } = useVariantBom(variantId);
	const copyMutation = useCopyBomFromVariant(variantId);

	const fabricItems = (bomItems ?? []).filter((i) => i.measurement === 'area');
	const linearItems = (bomItems ?? []).filter((i) => i.measurement === 'linear');
	const hardwareItems = (bomItems ?? []).filter((i) => i.measurement === 'count');

	const copyableVariants = siblingVariants.filter(
		(v) => v.id !== variantId && v.platform_sku && v.bom_item_count > 0,
	);

	return (
		<LoadingWrapper
			isLoading={isLoading}
			skeleton={<PageSpinner />}
			isError={!!error}
			errorState={<ErrorState description="Failed to load BOM data." />}>
			<Stack gap="8">
				<Flex align="center" justify="between">
					<Heading size="4">Bill of Materials</Heading>
					{copyableVariants.length > 0 && platformSku && (
						<DropdownMenu.DropdownMenu>
							<DropdownMenu.DropdownMenuTrigger asChild>
								<Button
									size="1"
									variant="outline"
									color="neutral"
									iconLeft={<CopyPlusIcon size={14} />}
									disabled={copyMutation.isPending}>
									{copyMutation.isPending ? 'Duplicating' : 'Fill from variant'}
								</Button>
							</DropdownMenu.DropdownMenuTrigger>
							<DropdownMenu.DropdownMenuContent size="1" align="end">
								{copyableVariants.map((v) => (
									<DropdownMenu.DropdownMenuItem
										key={v.id}
										className={styles.copyMenuItem}
										onClick={() => copyMutation.mutate(v.id)}>
										{v.name}
										<Text size="1" color="secondary">
											{v.bom_item_count} {v.bom_item_count === 1 ? 'item' : 'items'}
										</Text>
									</DropdownMenu.DropdownMenuItem>
								))}
							</DropdownMenu.DropdownMenuContent>
						</DropdownMenu.DropdownMenu>
					)}
				</Flex>

				{!platformSku && (
					<Text size="2" color="danger">
						This variant has no SKU — BOM items require a SKU to link materials.
					</Text>
				)}

				{platformSku && (
					<>
						<BomCategorySection
							title="Fabric"
							icon={<ScissorsIcon size={16} />}
							items={fabricItems}
							measurement="area"
							tracksColor
							tracksSize={false}
							tracksLength={false}
							variantId={variantId}
							variantName={variantName}
							platformSku={platformSku}
							productName={productName}
						/>
						<BomCategorySection
							title="Notions"
							icon={<RulerIcon size={16} />}
							items={linearItems}
							measurement="linear"
							tracksColor={false}
							tracksSize
							tracksLength
							variantId={variantId}
							variantName={variantName}
							platformSku={platformSku}
							productName={productName}
						/>
						<BomCategorySection
							title="Hardware"
							icon={<WrenchIcon size={16} />}
							items={hardwareItems}
							measurement="count"
							tracksColor={false}
							tracksSize
							tracksLength={false}
							variantId={variantId}
							variantName={variantName}
							platformSku={platformSku}
							productName={productName}
						/>
					</>
				)}
			</Stack>
		</LoadingWrapper>
	);
};
