import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Heading, Button, Tabs, Flex } from '@artifact-ui/core';
import { PlusIcon, BatchesIcon } from '@/components/icons';
import { TabCount } from '@/components/tab-count';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { EmptyState } from '@/components/empty-state/empty-state';
import { useBatches } from './api/batches-queries';
import { BatchesTable } from './components/batches-table';
import shared from '@/styles/shared.module.css';

const ACTIVE_STATUSES = ['Active', 'Up Next', 'Paused'];

const BatchesPage = () => {
	const { data: batches, isLoading, error } = useBatches();
	const navigate = useNavigate();

	const activeBatches = useMemo(
		() => batches?.filter((b) => ACTIVE_STATUSES.includes(b.status)) ?? [],
		[batches],
	);

	const activeCount = useMemo(
		() => activeBatches.filter((b) => b.status === 'Active').length,
		[activeBatches],
	);

	const completedBatches = useMemo(
		() => batches?.filter((b) => b.status === 'Completed') ?? [],
		[batches],
	);

	return (
		<div className={shared.pageContainer}>
			<Flex justify="between" align="center" className="mb-6">
				<Heading size="6" iconLeft={<BatchesIcon size={20} />}>
					Batches
				</Heading>
				<Button
					onClick={() => navigate('/batches/new')}
					iconLeft={<PlusIcon size={16} />}>
					New Batch
				</Button>
			</Flex>

			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error}
				errorState={<ErrorState description="Failed to load batches. Try again later." />}
				isEmpty={batches?.length === 0}
				emptyState={
					<EmptyState
						icon={<BatchesIcon size={20} />}
						title="No batches yet"
						description="Click 'New Batch' to get started."
					/>
				}>
				{batches && batches.length > 0 && (
					<Tabs.Root defaultValue="active">
						<Tabs.List>
							<Tabs.Trigger value="active">
								<span className="flex items-center gap-2">
									Active
									<TabCount count={activeCount} />
								</span>
							</Tabs.Trigger>
							<Tabs.Trigger value="completed">
								<span className="flex items-center gap-2">
									Completed
									<TabCount count={completedBatches.length} />
								</span>
							</Tabs.Trigger>
						</Tabs.List>

						<Tabs.Content value="active">
							{activeBatches.length > 0 ? (
								<BatchesTable batches={activeBatches} />
							) : (
								<EmptyState
									icon={<BatchesIcon size={20} />}
									title="No active batches"
									description="Create a batch to group orders for production."
								/>
							)}
						</Tabs.Content>

						<Tabs.Content value="completed">
							{completedBatches.length > 0 ? (
								<BatchesTable batches={completedBatches} />
							) : (
								<EmptyState
									icon={<BatchesIcon size={20} />}
									title="No completed batches"
									description="Batches show up here once they're finished."
								/>
							)}
						</Tabs.Content>
					</Tabs.Root>
				)}
			</LoadingWrapper>
		</div>
	);
};

export default BatchesPage;
