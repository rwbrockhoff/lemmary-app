import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Table, Checkbox, Badge, Text, cn } from '@artifact-ui/core';
import { StageSelect } from '@/features/orders/components/stage-select';
import { CompleteItemsModal } from './complete-items-modal';
import { getProgressColor } from '../batch-utils';
import { useWorkflowStages, useUpdateOrderStage, useCompleteAllOrderItems } from '@/features/orders/api/orders-queries';
import { SortableHeader } from '@/components/sortable-header';
import { useSortableTable } from '@/hooks/use-sortable-table';
import styles from '@/styles/shared.module.css';
import { formatDate } from '@/utils/format';
import type { BatchOrder, BatchOrderItem } from '@/types/api';

type BatchOrdersTableProps = {
	batchId: string;
	orders: BatchOrder[];
	orderItems: BatchOrderItem[];
	onToggle: (id: string, completed: boolean) => void;
};

type OrderSortKey = Extract<keyof BatchOrder, string> | 'progress';

export const BatchOrdersTable = ({
	batchId,
	orders,
	orderItems,
	onToggle,
}: BatchOrdersTableProps) => {
	const navigate = useNavigate();
	const { data: stages, isLoading: stagesLoading } = useWorkflowStages();
	const updateOrderStage = useUpdateOrderStage();
	const completeAllItems = useCompleteAllOrderItems();
	const orderStages = stages?.orderStages ?? [];

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
			const items = orderItems.filter(
				(i) => i.batch_order_id === order.id,
			);
			const completed = items.filter((i) => i.is_complete).length;
			const total = items.length;
			map.set(order.id, total > 0 ? completed / total : 0);
		}
		return map;
	}, [orders, orderItems]);

	const { sortedData, sortKey, sortDirection, toggleSort } =
		useSortableTable<BatchOrder, OrderSortKey>(orders, {
			defaultKey: 'order_date',
			defaultDirection: 'asc',
			storageKey: 'batch-orders',
			customSortFns: {
				progress: (a, b) =>
					(progressByOrder.get(a.id) ?? 0) -
					(progressByOrder.get(b.id) ?? 0),
			},
		});

	return (<>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell className="w-10" />
					<SortableHeader<OrderSortKey>
						label="Order #"
						sortKey="order_number"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-20"
					/>
					<SortableHeader<OrderSortKey>
						label="Customer"
						sortKey="customer_name"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-1/5"
					/>
					<SortableHeader<OrderSortKey>
						label="Date"
						sortKey="order_date"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-36"
					/>
					<SortableHeader<OrderSortKey>
						label="Due"
						sortKey="due_date"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-36"
					/>
					<SortableHeader<OrderSortKey>
						label="Progress"
						sortKey="progress"
						activeSortKey={sortKey}
						sortDirection={sortDirection}
						onSort={toggleSort}
						className="w-28"
					/>
					<Table.HeaderCell><Text size="2" weight="medium" color="secondary">Status</Text></Table.HeaderCell>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{sortedData.map((order) => {
					const items = orderItems.filter(
						(i) => i.batch_order_id === order.id,
					);
					const completed = items.filter((i) => i.is_complete).length;
					const total = items.length;

					const currentStage = orderStages.find((s) => s.id === order.workflow_stage_id);
					const isStageComplete = currentStage?.is_complete;
					const isInProgress = !isStageComplete && !currentStage?.is_default;
					const rowClass = isStageComplete || order.completed
						? styles.completedRow
						: isInProgress
							? styles.inProgressRow
							: '';

					return (
						<Table.Row
							key={order.id}
							className={cn('cursor-pointer', rowClass)}
							onClick={() =>
								navigate(`/orders/${order.order_id}?from=batch&batchId=${batchId}`)
							}
						>
							<Table.Cell onClick={(e) => e.stopPropagation()}>
								<Checkbox
									checked={order.completed}
									onCheckedChange={() => handleCheckboxToggle(order)}
								/>
							</Table.Cell>
							<Table.Cell>{order.order_number}</Table.Cell>
							<Table.Cell className="truncate max-w-0">{order.customer_name}</Table.Cell>
							<Table.Cell>
								{formatDate(order.order_date)}
							</Table.Cell>
							<Table.Cell>
								{order.due_date ? formatDate(order.due_date) : '—'}
							</Table.Cell>
							<Table.Cell>
								<Badge
									size="1"
									variant="soft"
									color={getProgressColor(completed, total)}
								>
									{completed}/{total}
								</Badge>
							</Table.Cell>
							<Table.Cell onClick={(e) => e.stopPropagation()}>
								{!stagesLoading && (
									<StageSelect
										stages={orderStages}
										value={order.workflow_stage_id}
										onChange={(stageId) => handleStageChange(order, stageId)}
									/>
								)}
							</Table.Cell>
						</Table.Row>
					);
				})}
			</Table.Body>
		</Table.Root>

		<CompleteItemsModal
			open={completeModalOrder !== null}
			onOpenChange={(open) => {
				if (!open) setCompleteModalOrder(null);
			}}
			items={completeModalOrder?.items ?? []}
			onConfirm={() => {
				if (completeModalOrder) {
					completeAllItems.mutate(completeModalOrder.orderId, {
						onSuccess: () => setCompleteModalOrder(null),
					});
				}
			}}
			isPending={completeAllItems.isPending}
		/>
	</>
	);
};
