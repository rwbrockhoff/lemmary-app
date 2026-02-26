import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Heading, Text, Badge, Card, Checkbox } from '@artifact-ui/core';
import { useWorkflowBoard } from '@/features/orders/orders-queries';
import { StatusBadge } from '@/features/orders/status-badge';
import { formatDate } from '@/utils/format';
import type { WorkflowBoardOrder, WorkflowStage } from '@/types/api';

const WorkflowPage = () => {
	const { data, isLoading, error } = useWorkflowBoard();
	const [selectedBatchIds, setSelectedBatchIds] = useState<Set<string> | null>(
		null,
	);
	const [showAll, setShowAll] = useState(false);

	const activeBatches = data?.activeBatches ?? [];

	const initializedBatchIds = useMemo(() => {
		if (selectedBatchIds !== null) return selectedBatchIds;
		return new Set(activeBatches.map((b) => b.id));
	}, [selectedBatchIds, activeBatches]);

	const filteredOrders = useMemo(() => {
		if (!data) return [];
		if (showAll) return data.orders;
		return data.orders.filter(
			(o) => o.batch_id && initializedBatchIds.has(o.batch_id),
		);
	}, [data, showAll, initializedBatchIds]);

	const toggleBatch = (batchId: string) => {
		setSelectedBatchIds((prev) => {
			const current = prev ?? new Set(activeBatches.map((b) => b.id));
			const next = new Set(current);
			if (next.has(batchId)) {
				next.delete(batchId);
			} else {
				next.add(batchId);
			}
			return next;
		});
		setShowAll(false);
	};

	const toggleShowAll = () => {
		setShowAll((prev) => !prev);
	};

	if (isLoading)
		return (
			<Text color="secondary" className="p-8">
				Loading workflow...
			</Text>
		);

	if (error)
		return (
			<Text color="danger" className="p-8">
				Failed to load workflow board.
			</Text>
		);

	const stages = data?.stages ?? [];

	return (
		<div className="p-8">
			<div className="flex items-center justify-between mb-6">
				<Heading size="6">Workflow</Heading>
			</div>

			<BatchFilter
				batches={activeBatches}
				selectedIds={initializedBatchIds}
				showAll={showAll}
				onToggleBatch={toggleBatch}
				onToggleShowAll={toggleShowAll}
			/>

			<div className="flex gap-4 overflow-x-auto pb-4">
				{stages.map((stage) => (
					<KanbanColumn
						key={stage.id}
						stage={stage}
						orders={filteredOrders.filter(
							(o) => o.workflow_stage_id === stage.id,
						)}
					/>
				))}

			</div>
		</div>
	);
};

type BatchFilterProps = {
	batches: { id: string; name: string }[];
	selectedIds: Set<string>;
	showAll: boolean;
	onToggleBatch: (batchId: string) => void;
	onToggleShowAll: () => void;
};

const BatchFilter = ({
	batches,
	selectedIds,
	showAll,
	onToggleBatch,
	onToggleShowAll,
}: BatchFilterProps) => {
	return (
		<div className="flex items-center gap-4 mb-6 flex-wrap">
			<Text size="2" color="secondary">
				Active Batches:
			</Text>
			{batches.map((batch) => (
				<label key={batch.id} className="flex items-center gap-2 cursor-pointer">
					<Checkbox
						checked={!showAll && selectedIds.has(batch.id)}
						onCheckedChange={() => onToggleBatch(batch.id)}
						size="1"
					/>
					<Text size="2">{batch.name}</Text>
				</label>
			))}
			<label className="flex items-center gap-2 cursor-pointer ml-2">
				<Checkbox
					checked={showAll}
					onCheckedChange={onToggleShowAll}
					size="1"
				/>
				<Text size="2">Show all orders</Text>
			</label>
		</div>
	);
};

type KanbanColumnProps = {
	stage: WorkflowStage | null;
	orders: WorkflowBoardOrder[];
};

const KanbanColumn = ({ stage, orders }: KanbanColumnProps) => {
	return (
		<div className="flex flex-col min-w-[280px] max-w-[320px] shrink-0">
			<div className="flex items-center gap-2 mb-3 px-1">
				<StatusBadge
					name={stage?.name ?? 'Unassigned'}
					color={stage?.color ?? 'gray'}
				/>
				<Text size="1" color="secondary">
					{orders.length}
				</Text>
			</div>
			<div className="flex flex-col gap-2 min-h-[200px] bg-gray-50 rounded-lg p-2">
				{orders.map((order) => (
					<OrderCard key={order.id} order={order} />
				))}
				{orders.length === 0 && (
					<Text size="1" color="secondary" className="text-center py-8">
						No orders
					</Text>
				)}
			</div>
		</div>
	);
};

const OrderCard = ({ order }: { order: WorkflowBoardOrder }) => {
	const navigate = useNavigate();

	return (
		<Card.Root
			className="cursor-pointer hover:shadow-md transition-shadow"
			onClick={() => navigate(`/orders/${order.id}?from=workflow`)}
		>
			<Card.Body className="p-3">
				<div className="flex items-center justify-between mb-1">
					<Text size="2" weight="medium">
						{order.order_number}
					</Text>
					{order.batch_name && (
						<Badge variant="outline" size="1" color="neutral">
							{order.batch_name}
						</Badge>
					)}
				</div>
				<Text size="2" color="secondary" className="mb-2">
					{order.customer_name}
				</Text>
				<div className="flex flex-col gap-0.5">
					<Text size="1" color="secondary">
						Ordered: {formatDate(order.order_date)}
					</Text>
					{order.due_date && (
						<Text size="1" color="secondary">
							Due: {formatDate(order.due_date)}
						</Text>
					)}
				</div>
				<Badge variant="soft" size="1" color="neutral" className="mt-2 self-start">
					{order.item_count} {order.item_count === 1 ? 'Item' : 'Items'}
				</Badge>
			</Card.Body>
		</Card.Root>
	);
};

export default WorkflowPage;
