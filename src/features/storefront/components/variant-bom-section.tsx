import { Heading, Text, Stack } from '@artifact-ui/core';
import { ScissorsIcon, RulerIcon, WrenchIcon } from '@/components/icons/icons';
import { PageSpinner } from '@/components/page-spinner';
import { useVariantBom } from '../api/bom-queries';
import { BomCategorySection } from './bom-category-section/bom-category-section';

type VariantBomSectionProps = {
	variantId: string;
	variantName: string;
	platformSku: string | null;
	productName: string;
};

export const VariantBomSection = ({
	variantId,
	variantName,
	platformSku,
	productName,
}: VariantBomSectionProps) => {
	const { data: bomItems, isLoading, error } = useVariantBom(variantId);

	if (isLoading) return <PageSpinner />;
	if (error) return <Text color="danger">Failed to load BOM data.</Text>;

	const fabricItems = (bomItems ?? []).filter((i) => i.measurement === 'area');
	const linearItems = (bomItems ?? []).filter((i) => i.measurement === 'linear');
	const hardwareItems = (bomItems ?? []).filter((i) => i.measurement === 'count');

	return (
		<Stack gap="8">
			<Heading size="4">Bill of Materials</Heading>

			{!platformSku && (
				<Text size="2" color="danger">
					This variant has no SKU — BOM items require a SKU to link
					materials.
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
						variantId={variantId}
						variantName={variantName}
						platformSku={platformSku}
						productName={productName}
					/>
				</>
			)}
		</Stack>
	);
};
