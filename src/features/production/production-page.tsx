import { Heading, Text, Stack } from '@artifact-ui/core';
import { ProductionIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { useProductionSummary } from './production-queries';
import { ProductionTable } from './production-table';
import shared from '@/styles/shared.module.css';

const ProductionPage = () => {
	const { data: items, isLoading, error } = useProductionSummary();

	return (
		<div className={shared.pageContainer}>
			<Stack gap="6">
				<Heading size="6" iconLeft={<ProductionIcon size={20} />}>Production Summary</Heading>

				{isLoading && <PageSpinner />}

				{error && (
					<Text color="danger">Failed to load production summary.</Text>
				)}

				{items && items.length === 0 && (
					<Text color="secondary">No pending orders to produce.</Text>
				)}

				{items && items.length > 0 && <ProductionTable items={items} />}
			</Stack>
		</div>
	);
};

export default ProductionPage;
