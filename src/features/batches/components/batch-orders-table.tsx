import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Table } from '@artifact-ui/core';
import { CompleteItemsModal } from './complete-items-modal';
import { BatchOrderRow } from './batch-order-row';
import { BatchOrdersTableHeader } from './batch-orders-table-header';
import { useCompleteAllOrderItems } from '@/features/orders/api/orders-queries';
import {
	useOrderStages,
	useUpdateOrderStage,
} from '@/features/workflow/api/workflow-queries';
import { useSortableTable } from '@/hooks/use-sortable-table';
import type { BatchOrder, BatchOrderItem } from '@/types/api';

type BatchOrdersTableProps = {
	batchId: string;
	orders: BatchOrder[];
	orderItems: BatchOrderItem[];
	onToggle: (id: string, completed: boolean) => void;
};

export type OrderSortKey = Extract<keyof BatchOrder, string> | 'progress';

export const BatchOrdersTable = ({
	batchId,
	orders,
	orderItems,
	onToggle,
}: BatchOrdersTableProps) => {
	const navigate = useNavigate();
	const { data: orderStagesData, isLoading: stagesLoading } = useOrderStages();
	const updateOrderStage = useUpdateOrderStage();
	const completeAllItems = useCompleteAllOrderItems();
	const orderStages = orderStagesData ?? [];

	const [completeModalOrder, setCompleteModalOrder] = useState<{
		orderId: string;
		items: BatchOrderItem[];
	} | null>(null);

	const getIncompleteItems = (order: BatchOrder) => {
		const items = orderItems.filter((i) => i.batch_order_id === order.id);
		return items.filter((i) => !i.is_complete);
	};

	const handleCheckboxToggle = (order: BatchOrder) => {
		onToggle(order.id, !order.completed);
		if (!order.completed) {
			const incomplete = getIncompleteItems(order);
			if (incomplete.length > 0) {
				setCompleteModalOrder({ orderId: order.order_id, items: incomplete });
			}
		}
	};

	const handleStageChange = (order: BatchOrder, stageId: string) => {
		updateOrderStage.mutate({ orderId: order.order_id, stageId });
		const newStage = orderStages.find((s) => s.id === stageId);
		if (newStage?.is_complete) {
			const incomplete = getIncompleteItems(order);
			if (incomplete.length > 0) {
				setCompleteModalOrder({ orderId: order.order_id, items: incomplete });
			}
		}
	};

	const progressByOrder = useMemo(() => {
		const map = new Map<string, number>();
		for (const order of orders) {
			const items = orderItems.filter((i) => i.batch_order_id === order.id);
			const completed = items.filter((i) => i.is_complete).length;
			const total = items.length;
			map.set(order.id, total > 0 ? completed / total : 0);
		}
		return map;
	}, [orders, orderItems]);

	const { sortedData, sortKey, sortDirection, toggleSort } = useSortableTable<
		BatchOrder,
		OrderSortKey
	>(orders, {
		defaultKey: 'order_date',
		defaultDirection: 'asc',
		storageKey: 'batch-orders',
		customSortFns: {
			progress: (a, b) =>
				(progressByOrder.get(a.id) ?? 0) - (progressByOrder.get(b.id) ?? 0),
		},
	});

	const handleCloseCompleteModal = (open: boolean) => {
		if (!open) setCompleteModalOrder(null);
	};

	const handleConfirmComplete = () => {
		if (!completeModalOrder) return;
		completeAllItems.mutate(completeModalOrder.orderId, {
			onSuccess: () => setCompleteModalOrder(null),
		});
	};

	return (
		<>
			<Table.Root>
				<BatchOrdersTableHeader
					sortKey={sortKey}
					sortDirection={sortDirection}
					onSort={toggleSort}
				/>
				<Table.Body>
					{sortedData.map((order) => {
						const items = orderItems.filter((i) => i.batch_order_id === order.id);
						return (
							<BatchOrderRow
								key={order.id}
								order={order}
								items={items}
								orderStages={orderStages}
								stagesLoading={stagesLoading}
								onRowClick={() =>
									navigate(`/orders/${order.order_id}?from=batch&batchId=${batchId}`)
								}
								onCheckboxToggle={() => handleCheckboxToggle(order)}
								onStageChange={(stageId) => handleStageChange(order, stageId)}
							/>
						);
					})}
				</Table.Body>
			</Table.Root>

			<CompleteItemsModal
				open={completeModalOrder !== null}
				onOpenChange={handleCloseCompleteModal}
				items={completeModalOrder?.items ?? []}
				onConfirm={handleConfirmComplete}
				isPending={completeAllItems.isPending}
			/>
		</>
	);
};
