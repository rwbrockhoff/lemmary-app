import { Heading, Stack } from '@artifact-ui/core';
import { ProductionIcon, InboxIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { EmptyState } from '@/components/empty-state/empty-state';
import { useProductionSummary } from './production-queries';
import { ProductionTable } from './production-table';
import shared from '@/styles/shared.module.css';

const ProductionPage = () => {
	const { data: items, isLoading, error } = useProductionSummary();

	return (
		<div className={shared.pageContainer}>
			<Stack gap="6">
				<Heading size="6" iconLeft={<ProductionIcon size={20} />}>
					Production Summary
				</Heading>

				<LoadingWrapper
					isLoading={isLoading}
					skeleton={<PageSpinner />}
					isError={!!error}
					errorState={<ErrorState description="Failed to load production summary." />}
					isEmpty={items?.length === 0}
					emptyState={
						<EmptyState
							icon={<InboxIcon size={20} />}
							title="No pending orders to produce"
						/>
					}>
					{items && items.length > 0 && <ProductionTable items={items} />}
				</LoadingWrapper>
			</Stack>
		</div>
	);
};

export default ProductionPage;
