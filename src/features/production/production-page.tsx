import { Heading, Text } from '@artifact-ui/core';
import { ProductionIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { useProductionSummary } from './production-queries';
import { ProductionTable } from './production-table';

const ProductionPage = () => {
	const { data: items, isLoading, error } = useProductionSummary();

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<div className="mb-6">
				<Heading size="6" iconLeft={<ProductionIcon size={20} />}>Production Summary</Heading>
			</div>

			{isLoading && <PageSpinner />}

			{error && (
				<Text color="danger">Failed to load production summary.</Text>
			)}

			{items && items.length === 0 && (
				<Text color="secondary">No pending orders to produce.</Text>
			)}

			{items && items.length > 0 && <ProductionTable items={items} />}
		</div>
	);
};

export default ProductionPage;
