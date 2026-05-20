import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Heading, Text, Button, Flex, TextField } from '@artifact-ui/core';
import { useOrdersWithItems } from '@/features/orders/api/orders-queries';
import { useCreateBatch } from './api/batches-queries';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { SelectOrdersTable } from './components/select-orders-table';
import shared from '@/styles/shared.module.css';

type Tab = 'available' | 'in-batches';

const CreateBatchPage = () => {
	const navigate = useNavigate();
	const { data, isLoading, error } = useOrdersWithItems();
	const orders = data?.orders;
	const createBatch = useCreateBatch();

	const [name, setName] = useState('');
	const [tab, setTab] = useState<Tab>('available');
	const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
	const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());

	const pendingOrders = useMemo(
		() =>
			orders
				?.filter((o) => o.fulfillment_status === 'pending')
				.sort(
					(a, b) => new Date(a.order_date).getTime() - new Date(b.order_date).getTime(),
				),
		[orders],
	);

	const availableOrders = pendingOrders?.filter((o) => !o.batch_name) ?? [];
	const batchedOrders = pendingOrders?.filter((o) => o.batch_name) ?? [];
	const displayedOrders = tab === 'available' ? availableOrders : batchedOrders;

	const toggleOrder = (orderId: string) => {
		setSelectedOrderIds((prev) => {
			const next = new Set(prev);
			if (next.has(orderId)) {
				next.delete(orderId);
			} else {
				next.add(orderId);
			}
			return next;
		});
	};

	const toggleExpand = (orderId: string) => {
		setExpandedOrderIds((prev) => {
			const next = new Set(prev);
			if (next.has(orderId)) {
				next.delete(orderId);
			} else {
				next.add(orderId);
			}
			return next;
		});
	};

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
			<Flex justify="between" align="center" className="mb-6">
				<Heading size="6">New Batch</Heading>
				<Flex gap="3" align="center">
					<Button variant="outline" onClick={() => navigate('/batches')}>
						Cancel
					</Button>
					<Button
						onClick={handleCreate}
						disabled={
							!name.trim() || selectedOrderIds.size === 0 || createBatch.isPending
						}>
						{createBatch.isPending ? 'Creating...' : 'Create Batch'}
					</Button>
				</Flex>
			</Flex>

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

			<Flex justify="between" align="center" className="mb-4">
				<Flex gap="4" align="center">
					<button
						type="button"
						onClick={() => setTab('available')}
						className={`text-sm font-medium pb-1 cursor-pointer ${tab === 'available' ? 'border-b-2 border-current' : 'opacity-50'}`}>
						Available ({availableOrders.length})
					</button>
					<button
						type="button"
						onClick={() => setTab('in-batches')}
						className={`text-sm font-medium pb-1 cursor-pointer ${tab === 'in-batches' ? 'border-b-2 border-current' : 'opacity-50'}`}>
						In Batches ({batchedOrders.length})
					</button>
				</Flex>
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
		</div>
	);
};

export default CreateBatchPage;
