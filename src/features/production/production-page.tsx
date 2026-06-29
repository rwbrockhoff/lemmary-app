import { Heading, Text, Stack, Tabs } from '@artifact-ui/core';
import { ProductionIcon, InboxIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { EmptyState } from '@/components/empty-state/empty-state';
import { useProductionSummary } from './production-queries';
import { ProductionTable } from './production-table';
import { MaterialsReport } from './materials-report';
import shared from '@/styles/shared.module.css';

const ProductionPage = () => {
	const { data: items, isLoading, error } = useProductionSummary();

	return (
		<div className={shared.pageContainer}>
			<Stack gap="6">
				<Stack gap="1">
					<Heading size="6" iconLeft={<ProductionIcon size={20} />}>
						Production
					</Heading>
					<Text size="2" color="tertiary">
						Products to make and materials needed for pending orders
					</Text>
				</Stack>

				<Tabs.Root defaultValue="products">
					<Tabs.List>
						<Tabs.Trigger value="products">Products</Tabs.Trigger>
						<Tabs.Trigger value="materials">Materials</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="products" className="pt-4">
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
					</Tabs.Content>

					<Tabs.Content value="materials" className="pt-4">
						<MaterialsReport />
					</Tabs.Content>
				</Tabs.Root>
			</Stack>
		</div>
	);
};

export default ProductionPage;
