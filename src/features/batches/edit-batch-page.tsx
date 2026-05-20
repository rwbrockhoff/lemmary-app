import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Heading, Text, Button, Table, Flex } from '@artifact-ui/core';
import { useOrdersWithItems } from '@/features/orders/api/orders-queries';
import { useBatch, useUpdateBatchOrders } from './api/batches-queries';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { EditBatchOrderRow } from './components/edit-batch-order-row';
import shared from '@/styles/shared.module.css';

const EditBatchPage = () => {
	const { batchId } = useParams<{ batchId: string }>();
	const navigate = useNavigate();
	const { data: batch, isLoading: batchLoading } = useBatch(batchId!);
	const { data, isLoading: ordersLoading } = useOrdersWithItems();
	const orders = data?.orders;
	const updateBatchOrders = useUpdateBatchOrders();

	const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
	const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(new Set());
	const [prevBatchId, setPrevBatchId] = useState<string | null>(null);

	if (batch && batch.id !== prevBatchId) {
		setPrevBatchId(batch.id);
		setSelectedOrderIds(new Set(batch.orders.map((o) => o.order_id)));
	}

	const isLoading = batchLoading || ordersLoading;

	const pendingOrders = useMemo(
		() =>
			orders
				?.filter((o) => o.fulfillment_status === 'pending')
				.sort(
					(a, b) => new Date(a.order_date).getTime() - new Date(b.order_date).getTime(),
				),
		[orders],
	);

	const currentBatchOrderIds = useMemo(
		() => new Set(batch?.orders.map((o) => o.order_id) ?? []),
		[batch],
	);

	const availableOrders =
		pendingOrders?.filter((o) => !o.batch_name || currentBatchOrderIds.has(o.id)) ?? [];

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
						<Flex justify="between" align="center" className="mb-6">
							<Flex gap="3" align="center">
								<Breadcrumbs
									segments={[
										{ label: 'Batches', to: '/batches' },
										{ label: batch.name, to: `/batches/${batchId}` },
									]}
								/>
								<Heading size="6">Edit Orders</Heading>
							</Flex>
							<Flex gap="3" align="center">
								<Button variant="outline" onClick={() => navigate(`/batches/${batchId}`)}>
									Cancel
								</Button>
								<Button
									onClick={handleSave}
									disabled={selectedOrderIds.size === 0 || updateBatchOrders.isPending}>
									{updateBatchOrders.isPending ? 'Saving...' : 'Save'}
								</Button>
							</Flex>
						</Flex>

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
