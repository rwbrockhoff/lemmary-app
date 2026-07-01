import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Text, Flex, TextField, Tabs } from '@artifact-ui/core';
import { TabCount } from '@/components/tab-count';
import { useOrdersWithItems } from '@/features/orders/api/orders-queries';
import { useCreateBatch } from './api/batches-queries';
import { PageSpinner } from '@/components/page-spinner';
import { PageHeader } from '@/components/page-header';
import { FormActions } from '@/components/form-actions';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { SelectOrdersTable } from './components/select-orders-table';
import { useOrderSelection } from './hooks/use-order-selection';
import { getPendingOrders } from './utils/batch-utils';
import shared from '@/styles/shared.module.css';

type Tab = 'available' | 'in-batches';

const CreateBatchPage = () => {
	const navigate = useNavigate();
	const { data, isLoading, error } = useOrdersWithItems();
	const orders = data?.orders;
	const createBatch = useCreateBatch();

	const [name, setName] = useState('');
	const [tab, setTab] = useState<Tab>('available');
	const { selectedOrderIds, expandedOrderIds, toggleOrder, toggleExpand } =
		useOrderSelection();

	const pendingOrders = useMemo(() => getPendingOrders(orders), [orders]);

	const availableOrders = pendingOrders.filter((o) => !o.batch_name);
	const batchedOrders = pendingOrders.filter((o) => o.batch_name);
	const displayedOrders = tab === 'available' ? availableOrders : batchedOrders;

	const handleCreate = async () => {
		if (!name.trim() || selectedOrderIds.size === 0) return;

		await createBatch.mutateAsync({
			name: name.trim(),
			orderIds: [...selectedOrderIds],
		});

		navigate('/batches');
	};

	return (
		<div className={shared.pageContainer}>
			<PageHeader
				title="New Batch"
				rightActions={
					<FormActions
						onCancel={() => navigate('/batches')}
						onConfirm={handleCreate}
						confirmLabel="Create Batch"
						pendingLabel="Creating..."
						isPending={createBatch.isPending}
						disabled={!name.trim() || selectedOrderIds.size === 0}
					/>
				}
			/>

			<div className="mb-6 max-w-sm">
				<label className="block mb-2">
					<Text weight="medium">Batch Name</Text>
				</label>
				<TextField.Standalone
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="e.g. Week of Feb 24"
				/>
			</div>

			<Tabs.Root value={tab} onValueChange={(value) => setTab(value as Tab)}>
				<Flex justify="between" align="center" className="mb-4">
					<Tabs.List>
						<Tabs.Trigger value="available">
							<span className="flex items-center gap-2">
								Available
								<TabCount count={availableOrders.length} />
							</span>
						</Tabs.Trigger>
						<Tabs.Trigger value="in-batches">
							<span className="flex items-center gap-2">
								In Batches
								<TabCount count={batchedOrders.length} />
							</span>
						</Tabs.Trigger>
					</Tabs.List>
					{tab === 'available' && selectedOrderIds.size > 0 && (
						<Text size="2" color="secondary">
							{selectedOrderIds.size} selected
						</Text>
					)}
				</Flex>

				<LoadingWrapper
					isLoading={isLoading}
					skeleton={<PageSpinner />}
					isError={!!error}
					errorState={<ErrorState description="Failed to load orders." />}
					isEmpty={displayedOrders.length === 0}
					emptyState={
						<Text color="secondary">
							{tab === 'available' ? 'No available orders.' : 'No orders in batches yet.'}
						</Text>
					}>
					{displayedOrders.length > 0 && (
						<SelectOrdersTable
							orders={displayedOrders}
							tab={tab}
							selectedOrderIds={selectedOrderIds}
							expandedOrderIds={expandedOrderIds}
							onToggle={toggleOrder}
							onExpand={toggleExpand}
						/>
					)}
				</LoadingWrapper>
			</Tabs.Root>
		</div>
	);
};

export default CreateBatchPage;
