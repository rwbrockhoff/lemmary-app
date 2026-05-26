import { useDroppable } from '@dnd-kit/core';
import { Text, Flex, IconButton, DropdownMenu, cn } from '@artifact-ui/core';
import { EllipsisHorizontalIcon } from '@/components/icons/icons';
import { StatusBadge } from '@/features/orders/components/status-badge';
import { DraggableOrderCard } from './order-card';
import styles from './kanban-column.module.css';
import shared from '@/styles/shared.module.css';
import type { WorkflowBoardOrder, WorkflowStage } from '@/types/api';

type KanbanColumnProps = {
	stage: WorkflowStage;
	orders: WorkflowBoardOrder[];
	collapsed?: boolean;
	onToggleCollapse?: () => void;
};

export const KanbanColumn = ({
	stage,
	orders,
	collapsed,
	onToggleCollapse,
}: KanbanColumnProps) => {
	const { setNodeRef, isOver } = useDroppable({ id: stage.id });

	return (
		<div className="flex flex-col h-full min-w-[280px] max-w-[320px] shrink-0">
			<Flex align="center" gap="2" className="mb-3 px-1">
				<StatusBadge name={stage.name} color={stage.color} />
				<Text size="1" color="secondary">
					{orders.length}
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
					orders.map((order) => <DraggableOrderCard key={order.id} order={order} />)}
				{!collapsed && orders.length === 0 && (
					<Text size="1" color="secondary" className="text-center py-8">
						No orders
					</Text>
				)}
				{collapsed && (
					<Text size="1" color="secondary" className="text-center py-8">
						{orders.length} completed {orders.length === 1 ? 'order' : 'orders'}
					</Text>
				)}
			</div>
		</div>
	);
};
