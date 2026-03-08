import { Heading, Text, Button, Stack, Flex } from '@artifact-ui/core';
import { RefreshIcon, StorefrontIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { useProducts, useSyncProducts } from './api/storefront-queries';
import { ProductsTable } from './components/products-table';
import { formatRelativeTime } from '@/utils/format';
import shared from '@/styles/shared.module.css';

const StorefrontPage = () => {
	const { data, isLoading, error } = useProducts();
	const syncMutation = useSyncProducts();

	const products = data?.products;
	const lastSyncedAt = data?.lastSyncedAt;

	if (isLoading) return <PageSpinner />;

	return (
		<div className={shared.pageContainer}>
			<Flex justify="between" align="center" className="mb-6">
				<Stack gap="1">
					<Heading size="6" iconLeft={<StorefrontIcon size={20} />}>Storefront</Heading>
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
					iconLeft={<RefreshIcon size={16} />}
				>
					{syncMutation.isPending ? 'Syncing...' : 'Sync Products'}
				</Button>
			</Flex>

			{error && (
				<Text color="danger">Failed to load products. Try again later.</Text>
			)}

			{products && products.length === 0 && (
				<Text color="secondary">
					No products yet. Click "Sync Products" to pull from Squarespace.
				</Text>
			)}

			{products && products.length > 0 && (
				<ProductsTable products={products} />
			)}
		</div>
	);
};

export default StorefrontPage;
