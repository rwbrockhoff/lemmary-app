import { useMemo } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { Heading, Flex } from '@artifact-ui/core';
import { WorkflowIcon } from '@/components/icons';
import { PageSpinner } from '@/components/page-spinner';
import { LoadingWrapper } from '@/components/loading-wrapper/loading-wrapper';
import { ErrorState } from '@/components/error-state/error-state';
import { useWorkflowBoard } from '@/features/orders/api/orders-queries';
import { BatchFilter } from './components/batch-filter';
import { KanbanColumn } from './components/kanban-column';
import { OrderCardOverlay } from './components/order-card';
import { useWorkflowDnd } from './hooks/use-workflow-dnd';
import { useWorkflowFilters } from './hooks/use-workflow-filters';

const WorkflowPage = () => {
	const { data, isLoading, error } = useWorkflowBoard();
	const activeBatches = useMemo(() => data?.activeBatches ?? [], [data]);
	const activeIds = useMemo(
		() => new Set(activeBatches.map((b) => b.id)),
		[activeBatches],
	);

	const {
		checkedIds,
		showAll,
		completedCollapsed,
		toggleBatch,
		toggleShowAll,
		toggleCompletedCollapsed,
	} = useWorkflowFilters(activeIds);

	const filteredOrders = useMemo(() => {
		if (!data) return [];
		if (showAll) return data.orders;
		return data.orders.filter((o) => o.batch_id && checkedIds.has(o.batch_id));
	}, [data, showAll, checkedIds]);

	const { sensors, activeOrder, displayOrders, handleDragStart, handleDragEnd } =
		useWorkflowDnd(filteredOrders);

	const stages = data?.stages ?? [];

	return (
		<div className="p-8">
			<Flex justify="between" align="center" className="mb-6">
				<Heading size="6" iconLeft={<WorkflowIcon />}>
					Workflow
				</Heading>
			</Flex>

			<LoadingWrapper
				isLoading={isLoading}
				skeleton={<PageSpinner />}
				isError={!!error}
				errorState={<ErrorState description="Failed to load workflow board." />}>
				<BatchFilter
					batches={activeBatches}
					selectedIds={checkedIds}
					showAll={showAll}
					onToggleBatch={toggleBatch}
					onToggleShowAll={toggleShowAll}
				/>

				<DndContext
					sensors={sensors}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd}>
					<Flex gap="4" className="overflow-x-auto pb-4 pl-1">
						{stages.map((stage) => (
							<KanbanColumn
								key={stage.id}
								stage={stage}
								orders={displayOrders.filter((o) => o.workflow_stage_id === stage.id)}
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
			</LoadingWrapper>
		</div>
	);
};

export default WorkflowPage;
