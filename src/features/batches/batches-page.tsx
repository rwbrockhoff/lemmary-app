import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Heading, Text, Button, Tabs } from '@artifact-ui/core';
import { PlusIcon, BatchesIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { useBatches } from './api/batches-queries';
import { BatchesTable } from './components/batches-table';

const ACTIVE_STATUSES = ['Active', 'Up Next', 'Paused'];

const BatchesPage = () => {
	const { data: batches, isLoading, error } = useBatches();
	const navigate = useNavigate();

	const activeBatches = useMemo(
		() => batches?.filter((b) => ACTIVE_STATUSES.includes(b.status)) ?? [],
		[batches],
	);

	const completedBatches = useMemo(
		() => batches?.filter((b) => b.status === 'Completed') ?? [],
		[batches],
	);

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<Heading size="6" iconLeft={<BatchesIcon size={20} />}>Batches</Heading>
				<Button
					onClick={() => navigate('/batches/new')}
					iconLeft={<PlusIcon size={16} />}
				>
					New Batch
				</Button>
			</div>

			{isLoading && <PageSpinner />}

			{error && (
				<Text color="danger">Failed to load batches. Try again later.</Text>
			)}

			{batches && batches.length === 0 && (
				<Text color="secondary">
					No batches yet. Click "New Batch" to get started.
				</Text>
			)}

			{batches && batches.length > 0 && (
				<Tabs.Root defaultValue="active">
					<Tabs.List>
						<Tabs.Trigger value="active">
							Active ({activeBatches.length})
						</Tabs.Trigger>
						<Tabs.Trigger value="completed">
							Completed ({completedBatches.length})
						</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="active">
						{activeBatches.length > 0 ? (
							<BatchesTable batches={activeBatches} />
						) : (
							<Text color="secondary">No active batches.</Text>
						)}
					</Tabs.Content>

					<Tabs.Content value="completed">
						{completedBatches.length > 0 ? (
							<BatchesTable batches={completedBatches} />
						) : (
							<Text color="secondary">No completed batches.</Text>
						)}
					</Tabs.Content>
				</Tabs.Root>
			)}
		</div>
	);
};

export default BatchesPage;
