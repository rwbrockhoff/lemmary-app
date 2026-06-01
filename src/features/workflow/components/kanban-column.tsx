import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Text, Flex, IconButton, Button, DropdownMenu, cn } from '@artifact-ui/core';
import { EllipsisHorizontalIcon } from '@/components/icons/icons';
import { StatusBadge } from '@/features/orders/components/status-badge';
import { useStageOrders } from '@/features/workflow/api/workflow-queries';
import { DraggableOrderCard } from './order-card';
import styles from './kanban-column.module.css';
import shared from '@/styles/shared.module.css';
import type { WorkflowBoardOrder, WorkflowStage } from '@/types/api';

type KanbanColumnProps = {
	stage: WorkflowStage;
	orders: WorkflowBoardOrder[];
	hasMore?: boolean;
	collapsed?: boolean;
	onToggleCollapse?: () => void;
};

export const KanbanColumn = ({
	stage,
	orders,
	hasMore = false,
	collapsed,
	onToggleCollapse,
}: KanbanColumnProps) => {
	const { setNodeRef, isOver } = useDroppable({ id: stage.id });

	// only enable the infinite query once the user actually asks for more,
	// otherwise it would auto-fetch a duplicate first page on mount
	const [loadMoreActive, setLoadMoreActive] = useState(false);
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useStageOrders(
		stage.id,
		loadMoreActive,
	);

	const additionalOrders = data?.pages.flatMap((p) => p.orders) ?? [];
	const displayedOrders = [...orders, ...additionalOrders];
	const canLoadMore = loadMoreActive ? hasNextPage : hasMore;

	const handleLoadMore = () => {
		if (!loadMoreActive) {
			setLoadMoreActive(true);
		} else {
			fetchNextPage();
		}
	};

	return (
		<div className="flex flex-col h-full min-w-[280px] max-w-[320px] shrink-0">
			<Flex align="center" gap="2" className="mb-3 px-1">
				<StatusBadge name={stage.name} color={stage.color} />
				<Text size="1" color="secondary">
					{displayedOrders.length}
				</Text>
				{stage.is_complete && onToggleCollapse && (
					<div className="ml-auto">
						<DropdownMenu.DropdownMenu>
							<DropdownMenu.DropdownMenuTrigger asChild>
								<IconButton
									icon={<EllipsisHorizontalIcon size={14} />}
									label="Column options"
									size="1"
									variant="ghost"
									color="neutral"
								/>
							</DropdownMenu.DropdownMenuTrigger>
							<DropdownMenu.DropdownMenuContent align="end" size="1">
								<DropdownMenu.DropdownMenuItem onSelect={onToggleCollapse}>
									{collapsed ? 'Show completed orders' : 'Hide completed orders'}
								</DropdownMenu.DropdownMenuItem>
							</DropdownMenu.DropdownMenuContent>
						</DropdownMenu.DropdownMenu>
					</div>
				)}
			</Flex>
			<div
				ref={setNodeRef}
				className={cn(
					styles.dropZone,
					isOver && styles.dropZoneActive,
					shared.subtleScrollbar,
					'flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto p-2',
				)}>
				{!collapsed &&
					displayedOrders.map((order) => (
						<DraggableOrderCard key={order.id} order={order} />
					))}
				{!collapsed && displayedOrders.length === 0 && (
					<Text size="1" color="secondary" className="text-center py-8">
						No orders
					</Text>
				)}
				{!collapsed && canLoadMore && (
					<Button
						variant="secondary"
						size="1"
						onClick={handleLoadMore}
						disabled={isFetchingNextPage}
						className="self-center mt-1">
						{isFetchingNextPage ? 'Loading…' : 'Load more'}
					</Button>
				)}
				{collapsed && (
					<Text size="1" color="secondary" className="text-center py-8">
						{displayedOrders.length} completed{' '}
						{displayedOrders.length === 1 ? 'order' : 'orders'}
					</Text>
				)}
			</div>
		</div>
	);
};
