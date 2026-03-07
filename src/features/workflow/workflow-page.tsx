import { useState, useMemo } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { Heading, Text, Flex } from '@artifact-ui/core';
import { WorkflowIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { useWorkflowBoard } from '@/features/orders/api/orders-queries';
import { BatchFilter } from './components/batch-filter';
import { KanbanColumn } from './components/kanban-column';
import { OrderCardOverlay } from './components/order-card';
import { useWorkflowDnd } from './hooks/use-workflow-dnd';

const STORAGE_KEY = 'workflow-completed-collapsed';
const BATCH_FILTER_KEY = 'workflow-batch-filter';
const SHOW_ALL_KEY = 'workflow-show-all';

const loadSavedBatchIds = (): Set<string> | null => {
	const stored = localStorage.getItem(BATCH_FILTER_KEY);
	if (!stored) return null;
	try {
		return new Set(JSON.parse(stored) as string[]);
	} catch {
		return null;
	}
};

const WorkflowPage = () => {
	const { data, isLoading, error } = useWorkflowBoard();
	const [selectedBatchIds, setSelectedBatchIds] = useState<Set<string> | null>(
		loadSavedBatchIds,
	);
	const [showAll, setShowAll] = useState(
		() => localStorage.getItem(SHOW_ALL_KEY) === 'true',
	);
	const [completedCollapsed, setCompletedCollapsed] = useState(
		() => localStorage.getItem(STORAGE_KEY) === 'true',
	);

	const activeBatches = data?.activeBatches ?? [];
	const activeIds = useMemo(
		() => new Set(activeBatches.map((b) => b.id)),
		[activeBatches],
	);

	const checkedIds = selectedBatchIds ?? activeIds;

	const filteredOrders = useMemo(() => {
		if (!data) return [];
		if (showAll) return data.orders;
		return data.orders.filter(
			(o) => o.batch_id && checkedIds.has(o.batch_id),
		);
	}, [data, showAll, checkedIds]);

	const { sensors, activeOrder, displayOrders, handleDragStart, handleDragEnd } =
		useWorkflowDnd(filteredOrders);

	const toggleBatch = (batchId: string) => {
		let next: Set<string>;
		if (showAll) {
			next = new Set([batchId]);
		} else {
			const current = selectedBatchIds ?? new Set(activeIds);
			next = new Set(current);
			if (next.has(batchId)) {
				next.delete(batchId);
			} else {
				next.add(batchId);
			}
		}
		setSelectedBatchIds(next);
		setShowAll(false);
		localStorage.setItem(BATCH_FILTER_KEY, JSON.stringify([...next]));
		localStorage.setItem(SHOW_ALL_KEY, 'false');
	};

	const toggleCompletedCollapsed = () => {
		setCompletedCollapsed((prev) => {
			const next = !prev;
			localStorage.setItem(STORAGE_KEY, String(next));
			return next;
		});
	};

	if (isLoading) return <PageSpinner />;

	if (error)
		return (
			<Text color="danger" className="p-8">
				Failed to load workflow board.
			</Text>
		);

	const stages = data?.stages ?? [];

	return (
		<div className="p-8">
			<Flex justify="between" align="center" className="mb-6">
				<Heading size="6" iconLeft={<WorkflowIcon />}>Workflow</Heading>
			</Flex>

			<BatchFilter
				batches={activeBatches}
				selectedIds={checkedIds}
				showAll={showAll}
				onToggleBatch={toggleBatch}
				onToggleShowAll={() => {
					setShowAll((prev) => {
						const next = !prev;
						localStorage.setItem(SHOW_ALL_KEY, String(next));
						return next;
					});
				}}
			/>

			<DndContext
				sensors={sensors}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<Flex gap="4" className="overflow-x-auto pb-4 pl-1">
					{stages.map((stage) => (
						<KanbanColumn
							key={stage.id}
							stage={stage}
							orders={displayOrders.filter(
								(o) => o.workflow_stage_id === stage.id,
							)}
							collapsed={stage.is_complete ? completedCollapsed : undefined}
							onToggleCollapse={
								stage.is_complete ? toggleCompletedCollapsed : undefined
							}
						/>
					))}
				</Flex>

				<DragOverlay dropAnimation={null}>
					{activeOrder && <OrderCardOverlay order={activeOrder} />}
				</DragOverlay>
			</DndContext>
		</div>
	);
};

export default WorkflowPage;
