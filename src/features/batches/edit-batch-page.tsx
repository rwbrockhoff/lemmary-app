import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Text, Table, Flex } from '@artifact-ui/core';
import { useOrdersWithItems } from '@/features/orders/api/orders-queries';
import { useBatch, useUpdateBatchOrders } from './api/batches-queries';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { PageHeader } from '@/components/page-header';
import { FormActions } from '@/components/form-actions';
import { EditBatchOrderRow } from './components/edit-batch-order-row';
import { useOrderSelection } from './hooks/use-order-selection';
import { getPendingOrders } from './utils/batch-utils';
import shared from '@/styles/shared.module.css';

const EditBatchPage = () => {
	const { batchId } = useParams<{ batchId: string }>();
	const navigate = useNavigate();
	const { data: batch, isLoading: batchLoading } = useBatch(batchId!);
	const { data, isLoading: ordersLoading } = useOrdersWithItems();
	const orders = data?.orders;
	const updateBatchOrders = useUpdateBatchOrders();

	const {
		selectedOrderIds,
		setSelectedOrderIds,
		expandedOrderIds,
		toggleOrder,
		toggleExpand,
	} = useOrderSelection();
	const [prevBatchId, setPrevBatchId] = useState<string | null>(null);

	if (batch && batch.id !== prevBatchId) {
		setPrevBatchId(batch.id);
		setSelectedOrderIds(new Set(batch.orders.map((o) => o.order_id)));
	}

	const isLoading = batchLoading || ordersLoading;

	const pendingOrders = useMemo(() => getPendingOrders(orders), [orders]);

	const currentBatchOrderIds = useMemo(
		() => new Set(batch?.orders.map((o) => o.order_id) ?? []),
		[batch],
	);

	const availableOrders = pendingOrders.filter(
		(o) => !o.batch_name || currentBatchOrderIds.has(o.id),
	);

	const handleSave = async () => {
		if (selectedOrderIds.size === 0) return;

		await updateBatchOrders.mutateAsync({
			batchId: batchId!,
			orderIds: [...selectedOrderIds],
		});

		navigate(`/batches/${batchId}`);
	};

	return (
		<div className={shared.pageContainer}>
			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!isLoading && !batch}
				errorState={<ErrorState description="Batch not found." />}>
				{batch && (
					<>
						<PageHeader
							segments={[
								{ label: 'Batches', to: '/batches' },
								{ label: batch.name, to: `/batches/${batchId}` },
							]}
							title="Edit Orders"
							rightActions={
								<FormActions
									onCancel={() => navigate(`/batches/${batchId}`)}
									onConfirm={handleSave}
									confirmLabel="Save"
									pendingLabel="Saving..."
									isPending={updateBatchOrders.isPending}
									disabled={selectedOrderIds.size === 0}
								/>
							}
						/>

						<Flex justify="between" align="center" className="mb-4">
							<Text size="2" color="secondary">
								Select orders to include in this batch
							</Text>
							{selectedOrderIds.size > 0 && (
								<Text size="2" color="secondary">
									{selectedOrderIds.size} selected
								</Text>
							)}
						</Flex>

						{availableOrders.length === 0 && (
							<Text color="secondary">No available orders.</Text>
						)}

						{availableOrders.length > 0 && (
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.HeaderCell className="w-10" />
										<Table.HeaderCell className="w-24">Order #</Table.HeaderCell>
										<Table.HeaderCell>Customer</Table.HeaderCell>
										<Table.HeaderCell>Date</Table.HeaderCell>
										<Table.HeaderCell>Due</Table.HeaderCell>
										<Table.HeaderCell className="text-center">Items</Table.HeaderCell>
										<Table.HeaderCell className="text-end">Total</Table.HeaderCell>
										<Table.HeaderCell className="w-14" />
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{availableOrders.map((order) => (
										<EditBatchOrderRow
											key={order.id}
											order={order}
											isSelected={selectedOrderIds.has(order.id)}
											isExpanded={expandedOrderIds.has(order.id)}
											onToggle={toggleOrder}
											onExpand={toggleExpand}
										/>
									))}
								</Table.Body>
							</Table.Root>
						)}
					</>
				)}
			</LoadingWrapper>
		</div>
	);
};

export default EditBatchPage;
