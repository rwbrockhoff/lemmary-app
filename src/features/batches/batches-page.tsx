import { useNavigate } from 'react-router';
import { Heading, Text, Button } from '@artifact-ui/core';
import { PlusIcon } from '@/components/icons';
import { useBatches } from './api/batches-queries';
import { BatchesTable } from './components/batches-table';

const BatchesPage = () => {
	const { data: batches, isLoading, error } = useBatches();
	const navigate = useNavigate();

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<div className="flex items-center justify-between mb-6">
				<Heading size="6">Batches</Heading>
				<Button
					onClick={() => navigate('/batches/new')}
					iconLeft={<PlusIcon size={16} />}
				>
					New Batch
				</Button>
			</div>

			{isLoading && <Text color="secondary">Loading batches...</Text>}

			{error && (
				<Text color="danger">Failed to load batches.</Text>
			)}

			{batches && batches.length === 0 && (
				<Text color="secondary">
					No batches yet. Click "New Batch" to get started.
				</Text>
			)}

			{batches && batches.length > 0 && (
				<BatchesTable batches={batches} />
			)}
		</div>
	);
};

export default BatchesPage;
