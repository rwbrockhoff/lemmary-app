import { Heading, Text, Button, Stack, Flex } from '@artifact-ui/core';
import { RefreshIcon, StorefrontIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { EmptyState } from '@/components/empty-state/empty-state';
import { useProducts, useSyncProducts } from './api/storefront-queries';
import { ProductsTable } from './components/products-table';
import { formatRelativeTime } from '@/utils/format';
import shared from '@/styles/shared.module.css';

const StorefrontPage = () => {
	const { data, isLoading, error } = useProducts();
	const syncMutation = useSyncProducts();

	const products = data?.products;
	const lastSyncedAt = data?.lastSyncedAt;

	return (
		<div className={shared.pageContainer}>
			<Flex justify="between" align="center" className="mb-6">
				<Stack gap="1">
					<Heading size="6" iconLeft={<StorefrontIcon size={20} />}>
						Storefront
					</Heading>
					{lastSyncedAt && (
						<Text size="1" color="secondary">
							Last synced {formatRelativeTime(lastSyncedAt)}
						</Text>
					)}
				</Stack>
				<Button
					onClick={() => syncMutation.mutate()}
					disabled={syncMutation.isPending}
					variant="default"
					iconLeft={<RefreshIcon size={16} />}>
					{syncMutation.isPending ? 'Syncing...' : 'Sync Products'}
				</Button>
			</Flex>

			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error}
				errorState={
					<ErrorState description="Failed to load products. Try again later." />
				}
				isEmpty={products?.length === 0}
				emptyState={
					<EmptyState
						icon={<StorefrontIcon size={20} />}
						title="No products yet"
						description="Click 'Sync Products' to pull from your store."
					/>
				}>
				{products && products.length > 0 && <ProductsTable products={products} />}
			</LoadingWrapper>
		</div>
	);
};

export default StorefrontPage;
